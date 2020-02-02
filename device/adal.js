const fs = require('fs');
const { promisify } = require('util');
const adal = require('adal-node');

const AuthenticationContext = adal.AuthenticationContext;
const config = readConfig();

function readConfig() {
	const data = fs.readFileSync('./config.json');

	if (data) {
		return JSON.parse(data);
	} else {
		throw new Error(`JSON parsing error: ${parametersFile}`);
	}
}

function turnOnLogging() {
	const log = adal.Logging;

	log.setLoggingOptions({
		level: log.LOGGING_LEVEL.VERBOSE,
		log: (level, message, error) => {
			console.log(message);
			if (error) {
				console.log(error);
			}
		}
	});
}

function createContext() {
	const authorityUrl = `${config.authorityHostUrl}/${config.tenant}`;

	turnOnLogging();

	const tokenCache = new adal.MemoryCache();
	const context = new AuthenticationContext(authorityUrl, true, tokenCache);

	return context;
}

const context = createContext();
const acquireUserCode = promisify(context.acquireUserCode).bind(context);
const acquireTokenWithDeviceCode = promisify(context.acquireTokenWithDeviceCode).bind(context);

module.exports = async function acquireToken(resource) {
	const userCodeInfo = await acquireUserCode(resource, config.clientId, 'en-us');

	console.log('Use a web browser to open the page ' + userCodeInfo.verificationUrl + ' and enter the code ' + userCodeInfo.userCode + ' to sign in.');

	return acquireTokenWithDeviceCode(resource, config.clientId, userCodeInfo);
};
