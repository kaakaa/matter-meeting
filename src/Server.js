import {createServer} from 'restify';
import {EwsClient} from './ews/EwsClient';
import {SlashCommandRoute} from './mattermost/Command';

// const ewsClient = new EwsClient();
const slashCommandRoute = new SlashCommandRoute();

function ping(rew, res, next) {
    res.send("pong");
    next();
}

/*
function requestMeeting(req, res, next) {
    ewsClient.sendMeetingRequest();
    next();
}
*/

console.log(slashCommandRoute.chosei)
let server = createServer();
server.get("/ping", ping);
server.post("/chosei", slashCommandRoute.chosei)
server.post("/chosei/requestMeeting", slashCommandRoute.requestMeeting);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});