import express from 'express';
import bodyParser from 'body-parser';
import {readObject} from '../helpers/minio'
import {commandResponse} from '../helpers/mattermost/command'
import {getAvailability} from '../ews/EwsClient'
import {generate} from 'shortid';
import {writeGrassSVG} from '../ews/misc/GrassGenerator'

const app = express();

app.set('port', 8080);

app.get('/ping', function(req, res) {
    res.send('pong');
})

app.post('/chosei', function(req, res){
    const attendees = [req.params.text];
    getAvailability(attendees).then((availabilities) => {
        const id = generate();
        const data = {
            'total_attendees': attendees.length,
            'availabilities': availabilities
        };
        Promise.all(writeGrassSVG(id, data));
        return commandResponse(attendees, id, data);
    }).then((responseText) => {
        res.header('content-type', 'application/json')
            .send(responseText)
            .status(200).end();
    }).catch((err) => {
        console.error(err)
        res.status(500).send(err).end();
    });
})

app.get('/chosei/grass/:id', function(req, res) {
    Promise.resolve(readObject("test", req.params.id, function(err, stream) {
    	if(err) {
            res.status(500).send(err).end();
		    return;
	    }
        res.header({'Content-Type': 'image/png'});
        stream.on('data', function(d) { res.send(d); })
    }))
    .then(res.end());
})

app.listen(app.get('port'), (err) => {
    if (err) {
        console.error(err);
    } else {
        console.info('listen:', app.get('port'));
    }
})