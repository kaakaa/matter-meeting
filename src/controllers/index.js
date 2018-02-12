import express from 'express';
import bodyParser from 'body-parser';
import {readObject, checkBucket, makeBucket} from '../helpers/minio';
import {commandResponse} from '../helpers/mattermost/command';
import {sendMeetingRequest} from '../helpers/ews/meeting';
import {generate} from 'shortid';
import {writeGrassSVG} from '../helpers/grass';
import config from 'config';
import {EwsUser} from '../models/ews/user';
import {convertAvailability, interpolate, requestAvailability} from '../helpers/ews/availability';

const app = express();

app.set('port', config.server.port);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('pong');
});

function getAllowedMailAddress(users) {
    return users.filter((u) => {
        return config.ews.allowed_domain.some((d) => new RegExp(d).test(u.email));
    });
}

function diffArray(origin, after) {
    return origin.filter((o) => after.indexOf(o) < 0);
}

/**
 * Schedule Chosei
 */
app.post('/chosei', (req, res) => {
    const users = req.body.text.split(' ', -1).map((s) => new EwsUser('', s));
    const targets = getAllowedMailAddress(users);

    // TODO: When there is no attendees, return error message.
    requestAvailability(targets)
        .then(convertAvailability)
        .then(interpolate)
        .then((availabilities) => {
            return {
                id: generate(),
                total_attendees: targets.length,
                availabilities
            };
        }).then((data) => {
            writeGrassSVG(config.minio.bucket, data);
            return data;
        }).then((data) => {
            return commandResponse(targets, diffArray(users, targets), data);
        }).then((responseText) => {
            res.header({'content-type': 'application/json'});
            res.status(200).send(responseText);
        }).catch((err) => {
            console.log('fufadufasfjdoidsuafp'); // eslint-disable-line no-console
            console.error(err); // eslint-disable-line no-console
            res.status(500).send(err);
        });
});

app.post('/chosei/request', (req, res) => {
    const attendees = req.body.context.attendees;
    const targets = getAllowedMailAddress(attendees);
    const start = req.body.context.start_datetime;
    const time = req.body.context.meeting_time;
    try {
        sendMeetingRequest(targets, start, time);
        res.header({'content-type': 'application/json'});
        res.status(200).send({
            update: {
                message: 'Already having sent meeting request.\n* Start: ' + start + '\n* Attendees: ' + targets.join(', ') + '\n* NotAllowed: ' + diffArray(attendees, targets).join(', ')
            }
        });
    } catch (err) {
        res.status(500).send({
            update: {
                message: 'error'
            }
        });
    }
});

/**
 * Read grass graph from Minio
 */
app.get('/chosei/grass/:id', (req, res) => {
    readObject(config.minio.bucket, req.params.id)
        .then((stream) => {
            res.set('Content-Type', 'image/svg+xml');
            stream.on('data', (d) => res.write(d));
            stream.on('end', () => res.end());
        }).catch((err) => console.log(err.code + ': ' + err.resource)); // eslint-disable-line no-console
});

/**
 *  Making bucket on Minio if not exists.
 */
checkBucket(config.minio.bucket)
    .then(makeBucket)
    .then((err) => {
        if (err) {
            console.error(err); // eslint-disable-line no-console
        }
    })
    .catch((err) => console.log(err)); // eslint-disable-line no-console

app.listen(app.get('port'), (err) => {
    if (err) {
        console.error(err); // eslint-disable-line no-console
    } else {
        console.info('listen:', app.get('port')); // eslint-disable-line no-console
    }
});
