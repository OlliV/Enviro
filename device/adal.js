const fs = require('fs');
const adal = require('adal-node');

const AuthenticationContext = adal.AuthenticationContext;

function turnOnLogging() {
	const log = adal.Logging;
	log.setLoggingOptions( {
		level: log.LOGGING_LEVEL.VERBOSE,
		log: (level, message, error) => {
			console.log(message);
			if (error) {
				console.log(error);
			}
    }
  });
}

function readConfig() {
	const data = fs.readFileSync('./config.json');

	if (data) {
	  return JSON.parse(data);
	} else {
		throw new Error(`File not found: ${parametersFile}`);
	}
}

const config = readConfig();
const authorityUrl = `${config.authorityHostUrl}/${config.tenant}`;

turnOnLogging();

const tokenCache = new adal.MemoryCache();
const context = new AuthenticationContext(authorityUrl, true, tokenCache);

module.exports = async function acquireToken(resource) {
	const userCodeInfo = await new Promise((resolve, reject) => context.acquireUserCode(resource, config.clientId, 'en-us', (err, res) => {
		if (err) {
			reject(err);
		} else {
			resolve(res);
		}
	}));

	console.log('Use a web browser to open the page ' + userCodeInfo.verificationUrl + ' and enter the code ' + userCodeInfo.userCode + ' to sign in.');

	return new Promise((resolve, reject) => {
		context.acquireTokenWithDeviceCode(resource, config.clientId, userCodeInfo,  (err, tokenResponse) => {
			if (err) {
				reject(err);
			} else {
				resolve(tokenResponse);
			}
		});
	});
};
