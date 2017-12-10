import {Appointment, Attendee, AttendeeInfo, AvailabilityOptions, ConfigurationApi, DateTime, ExchangeCredentials, ExchangeService, ExchangeVersion, EwsLogging, GetUserAvailabilityRequest, MeetingAttendeeType, MessageBody, SendInvitationsMode, TimeWindow, Uri} from 'ews-javascript-api';
import {ntlmAuthXhrApi} from 'ews-javascript-api-auth';
import moment from 'moment';

EwsLogging.DebugLogEnabled = false;

const username = process.env.EWS_USERNAME;
const password = process.env.EWS_PASSWORD;
const ignoreCert = true;
ConfigurationApi.ConfigureXHR(new ntlmAuthXhrApi(username, password, ignoreCert));

let exch = new ExchangeService(ExchangeVersion.Exchange2010_SP2);
exch.Credentials = new ExchangeCredentials(username, password);
exch.Url = new Uri(process.env.EWS_SERVER);

export function getAvailability(attendees, qualityThreshold = 3) {
        let availabilityRequest = new GetUserAvailabilityRequest(exch);
        availabilityRequest.Attendees = attendees.map((attendee) => new AttendeeInfo(attendee, MeetingAttendeeType.Required));
        availabilityRequest.TimeWindow = new TimeWindow(DateTime.Now, DateTime.Now.AddDays(7));
        availabilityRequest.Options = new AvailabilityOptions();

        return Promise.resolve(availabilityRequest.Execute()
            .then(function(result){
                return result.suggestionsResponse.daySuggestions.map((item) => {
                    // the smaller the number of `quality`, the more people are free (i.e. scheduled to vacate)
                    return {
                        "date": moment(item.date.originalDateInput).format('YYYY-MM-DD'),
                        "schedules": item.timeSuggestions.filter((suggestion) => suggestion.quality <= qualityThreshold)
                            .map((suggestion) => {
                                return {
                                    "time": moment(suggestion.meetingTime.originalDateInput).format('HH:mm'),
                                    "isWorkTime": suggestion.isWorkTime,
                                    "quality": suggestion.quality / 3, // cahnge quality value (ranged 0,1,2,3) to notation of percentage.
                                    "freeBusyStatus": suggestion.conflicts.map((c) => c.freeBusyStatus)
                                }
                        })
                    }
                });
            })
        ).then(function(data){
            return data.map(function(item){
                let time = moment("2000-01-01 00:00:00");
                let end = moment("2000-01-02 00:00:00");

                const defined = item.schedules.map((s) => s.time);
                let newData = new Array();
                while (time.isBefore(end)) {
                    if(defined.includes(time.format("HH:mm"))) {
                        const d = item.schedules.filter((s) => s.time == time.format("HH:mm"));
                        newData.push(d[0]);
                    } else {
                        newData.push({
                            "time": time.format('HH:mm'),
                            "isWorkTime": time.isAfter(moment("2000-01-01 08:00")) && time.isBefore(moment("2000-01-01 18:00")),
                            "quality": 1,
                            "freeBusyStatus": []
                        });
                    }
                    time = time.add('30', 'minutes');
                }
                item.schedules = newData;
                return item;
            })
        }).catch(function(err){
            throw err
        });
}

export function sendMeetingRequest() {
        let appointment = new Appointment(exch);
        appointment.Subject = "test";
        appointment.Body = new MessageBody("test appointment");
        appointment.RequiredAttendees.Add(new Attendee("test", "test@example.com"));
        appointment.Start = DateTime.Now;
        appointment.End = DateTime.Now.AddHours(1);
        appointment.Save(SendInvitationsMode.SendOnlyToAll);
}
