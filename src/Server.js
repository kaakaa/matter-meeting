import {createServer} from 'restify';
import {EwsClient} from './EwsClient';

const ewsClient = new EwsClient();


function ping(rew, res, next) {
    res.send("pong");
    next();
}

function requestMeeting(req, res, next) {
    ewsClient.sendMeetingRequest();
    next();
}

let server = createServer();
server.get("/ping", ping);
server.post("/chosei/requestMeeting", requestMeeting);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});