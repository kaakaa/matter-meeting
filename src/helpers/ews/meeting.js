import {Appointment, Attendee, DateTime, DateTimeKind, MessageBody, SendInvitationsMode} from 'ews-javascript-api';
import {ExchangeClient} from './service';

export function sendMeetingRequest(attendees, start, time) {
        let appointment = new Appointment(ExchangeClient);
	attendees.forEach((a) => appointment.RequiredAttendees.Add(new Attendee("", a)));

        appointment.Subject = "matter-meeting";
        appointment.Body = new MessageBody("This meeting request is from matter-meeting.");

	const startTime = DateTime.Parse(start, DateTimeKind.Local);
        appointment.Start = startTime;
        appointment.End = startTime.AddMinutes(time);

        appointment.Save(SendInvitationsMode.SendOnlyToAll);
}
