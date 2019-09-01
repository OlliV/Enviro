import { MsalAuthProviderFactory, LoginType } from 'react-aad-msal';

function create() {
	const config = {
		auth: {
			authority: 'https://login.microsoftonline.com/common',
			clientId: '2b180bc0-b503-4388-849d-75709b5387a2',
			validateAuthority: true,
			postLogoutRedirectUri: window.location.origin,
			redirectUri: window.location.origin
		},
		cache: {
			cacheLocation: 'sessionStorage',
			storeAuthStateInCookie: true
		}
	};

	const authenticationParameters = {
		scopes: [
			'openid',
			'profile',
			'user.read',
			'files.read',
		]
	};

	return new MsalAuthProviderFactory(
		config,
		authenticationParameters,
		LoginType.Redirect
	);
}

export const authProviderFactory = create();
