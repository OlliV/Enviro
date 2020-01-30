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
const resource = config.clientId;

turnOnLogging();

const context = new AuthenticationContext(authorityUrl);

module.exports = async function acquireToken() {
	return new Promise((resolve, reject) => {
		context.acquireTokenWithClientCredentials(resource, config.clientId, config.clientSecret, (err, tokenResponse) => {
			if (err) {
				reject(err);
			} else {
				resolve(tokenResponse);
			}
		});
	});
}
