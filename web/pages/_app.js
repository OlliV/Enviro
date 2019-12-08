import Header from '../components/header';
import { Provider } from 'react-redux';
import { basicReduxStore } from '../lib/redux-store';

const App = ({Component, pageProps}) => (
	<main>
	<Provider store={basicReduxStore}>
		<Header />
		<Component {...pageProps} />
	</Provider>
    <style jsx global>{`
        body {
            display: inline;
            text-align: left;
			background-color: #121212;
			color: #e1e1e1;
        }
    `}</style>
	</main>
);

App.getInitialProps = async function({ Component, ctx }) {
	let pageProps = {};

	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx);
	}

	return { pageProps };
}

export default App;
