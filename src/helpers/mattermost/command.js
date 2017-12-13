export function commandResponse(attendees, choseiId, suggestions) {
    return {
        'response_type': 'in_channel',
        'attachements': [
            {
                'color': '#88ff00',
                'text': '## matter-meeting Result',
                'fields': [
                    {
                        'short': false,
                        'title': 'Attendees',
                        'value': attendees
                    },
                ],
                'image_url': 'http://localhost:8080/chosei/grass/' + choseiId,
                'actions': makeSuggestionTimes(suggestions, attendees)
            }
        ]
    };
}

function makeSuggestionTimes(data, attendees) {
    const maxQuality = 0;
    return data.availabilities
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
                    "url": "http://localhost:8080/chosei/requestMeeting",
                    "context": {
                        "attendees": attendees,
                        "start_datetime": suggestion,
                        "meeting_time": 30
                    }
                }
            }
        });
};
