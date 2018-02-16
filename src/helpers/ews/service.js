import {ConfigurationApi, EwsLogging, ExchangeCredentials, ExchangeService, ExchangeVersion, Uri} from 'ews-javascript-api';
import {ntlmAuthXhrApi} from 'ews-javascript-api-auth';
import config from 'config';

EwsLogging.DebugLogEnabled = false;

const server = process.env.EWS_SERVER || config.ews.server; // eslint-disable-line no-process-env
const username = process.env.EWS_USERNAME || config.ews.username; // eslint-disable-line no-process-env
const password = process.env.EWS_PASSWORD || config.ews.password; // eslint-disable-line no-process-env
const ignoreCert = true;
ConfigurationApi.ConfigureXHR(new ntlmAuthXhrApi(username, password, ignoreCert)); // eslint-disable-line new-cap

export const ExchangeClient = new ExchangeService(ExchangeVersion.Exchange2010_SP2);
ExchangeClient.Credentials = new ExchangeCredentials(username, password);
ExchangeClient.Url = new Uri(server);

