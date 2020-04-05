import { MsalAuthProviderFactory, LoginType } from 'react-aad-msal';

function create() {
	const config = {
		auth: {
			authority: 'https://login.microsoftonline.com/vanhoja.onmicrosoft.com',
			clientId: '6c745641-ae3c-4df3-a680-d2a42ea0dff8',
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
		scopes: ['openid', 'profile', 'user.read', 'files.readwrite.appfolder'],
	};

	return new MsalAuthProviderFactory(
		config,
		authenticationParameters,
		LoginType.Redirect
	);
}

export const authProviderFactory = create();
