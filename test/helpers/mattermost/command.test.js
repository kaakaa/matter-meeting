const assert = require('chai').assert;

const command = require('../../../lib/helpers/mattermost/command');

describe('Mattermost command response', () => {
    it('ok', async () => {
        const targets = [
            {email: 'test1@example.com'},
            {email: 'test2@example.com'}
        ];
        const attendees = [
            {email: 'not@allowed.com'}
        ];
        const suggestions = {
            id: 'test_id',
            availabilities: [
                {
                    date: '2018-01-01',
                    schedules: [
                        {
                            time: '00:00',
                            quality: 0
                        },
                        {
                            time: '00:30',
                            quality: 1
                        },
                        {
                            time: '01:00',
                            quality: 2
                        }
                    ]
                },
                {
                    date: '2018-01-02',
                    schedules: [
                        {
                            time: '12:00',
                            quality: 0
                        },
                        {
                            time: '12:30',
                            quality: 1
                        },
                        {
                            time: '13:00',
                            quality: 2
                        }
                    ]
                }
            ]
        }
        const actual = await command.commandResponse(targets, attendees, suggestions);

        const expected = {
            response_type: 'in_channel',
            attachments: [
                {
                    color: '#88ff00',
                    pretext: '## matter-meeting',
                    text: 'http://testserver:8080/chosei/grass/test_id',
                    fields: [
                        {
                            short: true,
                            title: 'Attendees',
                            value: 'test1@example.com\ntest2@example.com'
                        },
                        {
                            short: true,
                            title: 'Not Allowed (will not send meeting req)',
                            value: 'not@allowed.com'
                        }
                    ],
                    image_url: 'http://testserver:8080/chosei/grass/test_id',
                    actions: [
                        {
                            name: '2018-01-01 00:00',
                            integration: {
                                url: 'http://testserver:8080/chosei/request',
                                context: {
                                    attendees: ['test1@example.com','test2@example.com'],
                                    start_datetime: '2018-01-01 00:00',
                                    meeting_time: 30
                                }
                            }
                        },
                        {
                            name: '2018-01-02 12:00',
                            integration: {
                                url: 'http://testserver:8080/chosei/request',
                                context: {
                                    attendees: ['test1@example.com','test2@example.com'],
                                    start_datetime: '2018-01-02 12:00',
                                    meeting_time: 30
                                }
                            }
                        }
                    ]
                }
            ]
        };

        assert.deepEqual(actual, expected);
    })
});
