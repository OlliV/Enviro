import { AzureAD } from 'react-aad-msal';
import { authProviderFactory } from '../lib/auth-provider-factory';
import { basicReduxStore } from '../lib/redux-store';

export default () => {
	const [accountInfo, setAccountInfo] = React.useState({});

	const unauthenticatedFunction = (loginFunction) => {
		console.log('UNAUTHENTICATED');
		return (
			<button className="Button" onClick={loginFunction}>
				Login
			</button>
		);
	};

	const userInfoReceived = (receivedAccountInfo) => {
		console.log('USER INFO RECEIVED');

		setAccountInfo(receivedAccountInfo);
	};

	const authenticatedFunction = (logout) => {
		console.log('AUTHENTICATED');
		return (
			<div>
				{accountInfo && accountInfo.account && accountInfo.account.name}
				<button onClick={logout} className="Button">
					Logout
				</button>
				<style jsx>{`
					button {
						margin-left: 5pt;
					}
				`}</style>
			</div>
		);
	};

	return (
		<AzureAD
			provider={authProviderFactory}
			unauthenticatedFunction={unauthenticatedFunction}
			accountInfoCallback={userInfoReceived}
			authenticatedFunction={authenticatedFunction}
			reduxStore={basicReduxStore}
		/>
	);
};
