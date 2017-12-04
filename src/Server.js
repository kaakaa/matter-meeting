import express from 'express';
import bodyParser from 'body-parser';
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

let server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.get("/ping", ping);
server.post("/chosei", slashCommandRoute.chosei)
server.post("/chosei/requestMeeting", slashCommandRoute.requestMeeting);

server.listen(8080);