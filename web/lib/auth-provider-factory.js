import { MsalAuthProviderFactory, LoginType } from 'react-aad-msal';

function create() {
	const config = {
		auth: {
			authority: 'https://login.microsoftonline.com/990c9b39-1625-4d97-a7ed-a9a32f64e6c2',
			clientId: '606cf8ad-f2d3-4492-ac57-37fa1b2bad8c',
			validateAuthority: true,
			postLogoutRedirectUri: window.location.origin,
			redirectUri: window.location.origin,
		},
		cache: {
			cacheLocation: 'sessionStorage',
			storeAuthStateInCookie: true,
		},
	};

	const authenticationParameters = {
		scopes: [
			'openid',
			'user.read'
		]
	};

	return new MsalAuthProviderFactory(config, authenticationParameters, LoginType.Redirect);
};

export const authProviderFactory = create();
