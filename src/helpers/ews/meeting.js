import {Appointment, Attendee, DateTime, DateTimeKind, MessageBody, SendInvitationsMode} from 'ews-javascript-api';
import {ExchangeClient} from './service';

export function sendMeetingRequest(attendees, start, time) {
    const appointment = new Appointment(ExchangeClient);
    attendees.forEach((a) => appointment.RequiredAttendees.Add(new Attendee('', a))); // eslint-disable-line new-cap

    appointment.Subject = 'matter-meeting';
    appointment.Body = new MessageBody('This meeting request is from matter-meeting.');

    const startTime = DateTime.Parse(start, DateTimeKind.Local); // eslint-disable-line new-cap
    appointment.Start = startTime;
    appointment.End = startTime.AddMinutes(time); // eslint-disable-line new-cap

    appointment.Save(SendInvitationsMode.SendOnlyToAll); // eslint-disable-line new-cap
}
