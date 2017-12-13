export function commandResponse(attendees, choseiId, suggestions) {
    return {
        'response_type': 'in_channel',
        'attachments': [
            {
                'color': '#88ff00',
                'text': '## matter-meeting Result',
                'fields': [
                    {
                        'short': false,
                        'title': 'Attendees',
                        'value': attendees.join(" ")
                    },
                ],
                'image_url': 'http://10.25.165.168:8080/chosei/grass/' + choseiId,
                'actions': makeSuggestionTimes(suggestions, attendees)
            }
        ]
    };
}

function makeSuggestionTimes(data, attendees) {
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
                    "url": "http://10.25.165.168:8080/chosei/requestMeeting",
                    "context": {
                        "attendees": attendees,
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
