import 'babel-polyfill';
import 'isomorphic-fetch';

export class SlashCommandRoute {
    constructor() {
    }
    chosei(req, res, next) {
        console.log(req.headers);
        console.log(req.body);
        res.header("content-type", "application/json");
        res.send(new CommandResponse().toJson());
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
    constructor() {
        this.query = {
            "attendee": [],
            "start_datetime": "",
            "meeting_time": "", // (min)
        }; // query summary
        this.iamgeUrl = ""; // url of grass-graph
        this.suggestions = []; // suggested meeting datetime
    }

    toJson() {
        return {
            "response_type": "in_channel",
            "attachments": [
                {
                    "color": "#88fff00",
                    "text": "${query_summary}",
                    "image_url": "http://www.mattermost.org/wp-content/uploads/2016/03/logoHorizontal_WS.png",
                    "actions": [
                    {
                        "name": "meeting",
                        "integration": {
                            "url": "http://localhost:8080/chosei/requestMeeting",
                            "context": {
                                "attendees": ["test1@example.com","test2@example.com"],
                                "start_datetime": "2017-12-20T10:00:00",
                                "meeting_time": 60 * 2
                            }
                        }
                    }]
                }
            ]
        }
    }
}