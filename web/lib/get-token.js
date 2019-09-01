import { authProviderFactory } from './auth-provider-factory';

let p = null;

async function getToken() {
	if (p) {
		const { expiresOn } = await p;
		if (Number(expiresOn) - Date.now() - 20000 <= 0) {
			p = null;
		}
	}

	if (!p) {
		const authProvider = authProviderFactory.getAuthProvider();

		p = authProvider.getToken();
		p.catch(() => p = null);
	}

	return p;
};

export default getToken;
