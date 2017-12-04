import {Appointment, Attendee, ConfigurationApi, DateTime, ExchangeCredentials, ExchangeService, ExchangeVersion, EwsLogging, MessageBody, SendInvitationsMode, Uri} from 'ews-javascript-api';
import {ntlmAuthXhrApi} from 'ews-javascript-api-auth';

EwsLogging.DebugLogEnabled = false;

export class EwsClient {
    constructor() {
        const username = process.env.EWS_USERNAME;
        const password = process.env.EWS_PASSWORD;
        const ignoreCert = true;
        ConfigurationApi.ConfigureXHR(new ntlmAuthXhrApi(username, password, ignoreCert));

        this.exch = new ExchangeService(ExchangeVersion.Exchange2010_SP2);
        this.exch.Credentials = new ExchangeCredentials(username, password);
        this.exch.Url = new Uri(process.env.EWS_SERVER);
    }
    sendMeetingRequest() {
        let appointment = new Appointment(this.exch);
        appointment.Subject = "test";
        appointment.Body = new MessageBody("test appointment");
        // appointment.RequiredAttendees.Add(new Attendee("test", "test@example.com"));
        appointment.Start = DateTime.Now;
        appointment.End = DateTime.Now.AddHours(1);
        appointment.Save(SendInvitationsMode.SendOnlyToAll);
    }
}