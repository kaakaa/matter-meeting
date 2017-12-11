import express from 'express';
import bodyParser from 'body-parser';
import {EwsClient} from './ews/EwsClient';
import {SlashCommandRoute} from './mattermost/Command';

import {read} from './minio/MinioClient';

const slashCommandRoute = new SlashCommandRoute();

function ping(rew, res, next) {
    res.send("pong");
    next();
}

let server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.get("/ping", ping);
server.post("/chosei", slashCommandRoute.chosei)
server.post("/chosei/requestMeeting", slashCommandRoute.requestMeeting);
server.get("/chosei/grass/:id", function(req, res, next) {
    read("test", req.params.id, function(err, stream){
        res.header({'Content-Type': 'image/png'});
        stream.on('data', function(d) { res.send(d); })
    });
})
server.listen(8080);