import config from 'config';

function makeServerUrl() {
    return 'http:///' + config.server.host + ':' + config.server.port;
}

export function commandResponse(targets, attendees, choseiId, suggestions) {
    return {
        'response_type': 'in_channel',
        'attachments': [
            {
                'color': '#88ff00',
                'pretext': '## matter-meeting',
		'text': makeServerUrl() + '/chosei/grass/' + choseiId,
                'fields': [
                    {
                        'short': true,
                        'title': 'Attendees',
                        'value': targets.join(" ")
                    },
                    {
                        'short': true,
                        'title': 'NotAllowed Member',
                        'value': attendees.join(" ")
                    }
                ],
                'image_url': makeServerUrl() + '/chosei/grass/' + choseiId,
                'actions': makeSuggestionTimes(suggestions, targets, attendees)
            }
        ]
    };
}

function makeSuggestionTimes(data, targets, attendees) {
    const maxQuality = 0;
    const maxResult = 10;
    const result = data.availabilities
        .map((availability) => {
            return availability.schedules
                .filter((schedule) => schedule.quality <= maxQuality)
                .map((s) => availability.date + " " + s.time);
    	})
        .reduce((x, y) => [...x, ...y])
        .map((suggestion) => {
            return {
                "name": suggestion,
                "integration": {
                    "url": makeServerUrl() + "/chosei/request",
                    "context": {
                        "attendees": targets,
                        "start_datetime": suggestion,
                        "meeting_time": 30
                    }
                }
            }
        });

    if (result.length > maxResult) {
	return result.slice(0, maxResult);
    } else {
        return result;
    }
};
