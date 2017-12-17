import express from 'express';
import bodyParser from 'body-parser';
import {readObject} from '../helpers/minio'
import {commandResponse} from '../helpers/mattermost/command'
import {getAvailability, sendMeetingRequest} from '../ews/EwsClient'
import {generate} from 'shortid';
import {writeGrassSVG} from '../ews/misc/GrassGenerator'
import config from 'config';

const app = express();

app.set('port', 8080);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/ping', function(req, res) {
    res.send('pong');
})

function getAllowedMailAddress(attendees) {
    return attendees.filter((attendee) => {
        return config.ews.allowed_domain.some((d) => new RegExp(d).test(attendee) );
    });
}

function diffArray(origin, after) {
    return origin.filter((o) => after.indexOf(o) < 0 );
};

app.post('/chosei', function(req, res){
    const attendees = req.body.text.split(" ", -1);
    const targets = getAllowedMailAddress(attendees);
    getAvailability(targets).then((availabilities) => {
        const id = generate();
        const data = {
            'total_attendees': targets.length,
            'availabilities': availabilities
        };
        Promise.all(writeGrassSVG(id, data));
        return commandResponse(targets, diffArray(attendees, targets), id, data);
    }).then((responseText) => {
        res.header({'content-type': 'application/json'});
        res.status(200).send(responseText);
    }).catch((err) => {
	console.log("fufadufasfjdoidsuafp");
        console.error(err)
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
		res.header({"content-type": "application/json"});
		res.status(200).send({
			"update": {
				"message": "Already having sent meeting request.\n* Start: " + start + "\n* Attendees: " + targets.join(", ") + "\n* NotAllowed: " + diffArray(attendees, targets).join(", ")
			}
		});
	} catch(err) {
		res.status(500).send({
			"update": {
				"message": "error"
			}
		});
	}
});

app.get('/chosei/grass/:id', function(req, res) {
    readObject("test", req.params.id)
        .then((stream) => {
            res.header({'Content-Type': 'image/svg+xml'});
            stream.on('data', (d) => res.status(200).send(d));
        }).catch((err) => console.error(err));
})

app.listen(app.get('port'), (err) => {
    if (err) {
        console.error(err);
    } else {
        console.info('listen:', app.get('port'));
    }
})
