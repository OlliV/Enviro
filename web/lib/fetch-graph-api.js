import fetch from 'isomorphic-unfetch';
import retry from 'async-retry';
import { parse as parseContentType } from 'content-type';
import getToken from './get-token';

const NETWORK_ERR_CODE = 'network_error';
const NETWORK_ERR_MESSAGE = 'A network error has occurred. Please retry';

export default async function fetchAPI(path, opts = {}) {
	const { accessToken } = await getToken();

	const headers = Object.assign(
		{
			Authorization: `Bearer ${accessToken}`,
		},
		opts.headers || {}
	);
	const url = `https://graph.microsoft.com/v1.0${path}`;

	return retry(
		async (bail) => {
			let res, data, err;

			try {
				res = await fetch(url, { ...opts, headers });

				const { type } = parseContentType(
					res.headers.get('Content-Type') || ''
				);
				if (
					opts.throwOnHTTPError &&
					(res.status < 200 || res.status >= 300)
				) {
					if (type === 'application/json') {
						data = await res.json();

						console.log(data);
						err = new Error(
							data.error == null
								? `Unexpected Error (${opts.method} ${url})`
								: data.error.message
						);
						err.res = res;
						err.status = res.status;
						if (data.error) {
							err.code = data.error.code;
							for (const field of Object.keys(data.error)) {
								if (field !== 'message') {
									err[field] = data.error[field];
								}
							}
						} else {
							err.code = res.status;
						}
					} else {
						// handle it below as network error
						let text = '';
						try {
							text = await res.text();
						} catch (berr) {
							// eslint-disable-next-line no-console
							console.error('error buffering text', berr);
						}
						throw new Error(
							`Unexpected response content-type (${opts.method} ${url}): ` +
								type +
								`(${res.status}) ${text}`
						);
					}
				} else if (res.status === 204) {
					// Since 204 means no content we return null
					data = null;
				} else {
					if (type === 'application/json') {
						data = await res.json();
					} else {
						data = await res.text();
					}
				}
			} catch (e) {
				err = e; //new Error(NETWORK_ERR_MESSAGE)
				err.code = NETWORK_ERR_CODE;
				err.res = null;
				err.status = null;
			}

			if (!err) return data;
			if (err.status < 500) return bail(err);
			err.stack =
				(err.stack ? err.stack : '') + ' ### Fetched URL: ' + url;
			if (opts.body) {
				err.stack =
					(err.stack ? err.stack : '') +
					' ### Request Body: ' +
					opts.body;
			}
			throw err;
		},
		{ retries: 3, maxTimeout: 20000 }
	);
}
