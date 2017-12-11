import 'babel-polyfill';
import 'isomorphic-fetch';

import {getAvailability, sendMeetingRequest} from '../ews/EwsClient';
import {writeGrassSVG} from '../ews/misc/GrassGenerator';
import {generate} from 'shortid';

export class SlashCommandRoute {
    constructor() {
    }
    chosei(req, res, next) {
        console.log(req.headers);
        console.log(req.body);
        const attendees = ["test@example.com"];
        Promise.resolve(getAvailability(attendees))
            .then(function(availabilities) {
                const id = generate();
                const data = {
                    "total_attendees": attendees.length,
                    "availabilities": availabilities
                };
                writeGrassSVG(id, data);
                res.header("content-type", "application/json");
                res.send(new CommandResponse(id, attendees, data).toJson());
            })
            .catch(function(err){ console.error(err) });
    }
    requestMeeting(req, res, next) {
        res.header("content-type", "application/json");
        res.send({
            "update": {
              "message": "Send meeting request!"
            },
            "ephemeral_text": "You updated the post!"
        });
    }
}

export class CommandResponse {
    constructor(id, attendees, data) {
        this.query = {
            "attendee": [],
            "start_datetime": "",
            "meeting_time": "", // (min)
        }; // query summary
        this.imageUrl = "http://localhost:8080/chosei/grass/" + id; // url of grass-graph
        this.suggestions = data.availabilities.map((availability) => {
            return availability.schedules
                .filter((schedule) => schedule.quality <= 0)
                .map((s) => availability.date + " " + s.time);
        }).map((suggestion) => {
            return {
                "name": "meeting",
                "integration": {
                    "url": "http://localhost:8080/chosei/requestMeeting",
                    "context": {
                        "attendees": attendees,
                        "start_datetime": suggestion,
                        "meeting_time": 60 * 2
                    }
                }
            }
        });
    }

    toJson() {
        return {
            "response_type": "in_channel",
            "attachments": [
                {
                    "color": "#88fff00",
                    "text": this.query,
                    "image_url": this.imageUrl,
                    "actions": this.suggestions
                }
            ]
        }
    }
}