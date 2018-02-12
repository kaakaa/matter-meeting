import {ExchangeClient} from './service';
import {AttendeeInfo, AvailabilityOptions, DateTime, GetUserAvailabilityRequest, MeetingAttendeeType, TimeWindow, SuggestionQuality} from 'ews-javascript-api';
import moment from 'moment';

export function requestAvailability(users, qualityThreshold = 2) {
    const request = new GetUserAvailabilityRequest(ExchangeClient);
    request.Attendees = users.map((u) => new AttendeeInfo(u.email, MeetingAttendeeType.Required));
    request.TimeWindow = new TimeWindow(DateTime.Now, DateTime.Now.AddDays(7)); // eslint-disable-line new-cap

    const availabilityOptions = new AvailabilityOptions();
    availabilityOptions.MinimumSuggestionQuality = convertIntToSuggestionQuality(qualityThreshold);
    request.Options = availabilityOptions;

    return request.Execute(); // eslint-disable-line new-cap
}

function convertIntToSuggestionQuality(i) {
    switch (i) {
    case 0:
        return SuggestionQuality.Excellent;
    case 1:
        return SuggestionQuality.Good;
    case 2:
        return SuggestionQuality.Fair;
    default:
        return SuggestionQuality.Poor;
    }
}

export function convertAvailability(availabilityResult) {
    return availabilityResult.suggestionsResponse.daySuggestions.map((item) => {
        // the smaller the number of `quality`, the more people are free (i.e. scheduled to vacate).
        return {
            date: moment(item.date.originalDateInput).format('YYYY-MM-DD'),
            schedules: item.timeSuggestions.filter(filterTimeSuggestion).map(convertToJson)
        };
    });
}

function filterTimeSuggestion(suggestion, qualityThreshold = 3) {
    return suggestion.quality <= qualityThreshold;
}

function convertToJson(suggestion) {
    return {
        time: moment(suggestion.meetingTime.originalDateInput).format('HH:mm'),
        isWorkTime: suggestion.isWorkTime,
        quality: suggestion.quality / 3, // change quality value (ranged 0,1,2,3) to notation of percent.
        freeBusyStatus: suggestion.conflicts.map((c) => c.freeBusyStatus)
    };
}

export function interpolate(data) {
    return data.map(interpolateSchedule);
}

/**
 * Perform interpolation so that all the time when the day is devided every 30 minutes has data
 */
export function interpolateSchedule(dateItem) {
    let dummyTime = moment('2000-01-01 00:00:00');
    const dummyEnd = moment('2000-01-02 00:00:00');

    const defined = dateItem.schedules.map((s) => s.time);
    const newData = [];

    const filterTimes = (s) => s.time === dummyTime.format('HH:mm');
    while (dummyTime.isBefore(dummyEnd)) {
        if (defined.includes(dummyTime.format('HH:mm'))) {
            const d = dateItem.schedules.filter(filterTimes);
            newData.push(d[0]);
        } else {
            // If there is no data, make dummy data and push it.
            newData.push({
                time: dummyTime.format('HH:mm'),
                isWorkTime: dummyTime.isAfter(moment('2000-01-01 08:00')) && dummyTime.isBefore(moment('2000-01-01 18:00')),
                quality: 1,
                freeBusyStatus: []
            });
        }
        dummyTime = dummyTime.add('30', 'minutes');
    }
    dateItem.schedules = newData;
    return dateItem;
}
