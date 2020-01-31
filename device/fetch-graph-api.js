const fetch = require('@olliv/fetch').default();
const getToken = require('./adal');

const RESOURCE = 'https://graph.microsoft.com';
let tokenPromise;
let tokenTimeout;

module.exports = async function fetchAPI(path, opts = {}) {
	if (!tokenPromise) {
		tokenPromise = getToken(RESOURCE);
	}

	const { tokenType, expiresIn, accessToken } = await tokenPromise;
	if (!tokenTimeout) {
		tokenTimeout = setTimeout(() => {
			tokenTimeout = null;
			tokenPromise = null;
		}, expiresIn * 1000);
	}

	const url = `https://graph.microsoft.com/v1.0${path}`;
	const headers = {
		Authorization: `${tokenType} ${accessToken}`,
		...(opts.headers || {})
	};

	const res = await fetch(url, { ...opts, headers });
	if (res.status < 200 || res.status >= 300) {
		const err = new Error(`Fetch failed (${res.status})`);

		err.path = path;
		err.body = await res.text();

		throw err;
	} else if (res.status === 204) {
		return null;
	} else {
		if (type === 'application/json') {
			return res.json();
		} else {
			return res.text();
		}
	}
};
