import dynamic from 'next/dynamic'
import Header from '../components/header';
import { Provider } from 'react-redux';
import { basicReduxStore } from '../lib/reduxStore';

const Auth = dynamic(
	import('../components/auth'),
	{ ssr: false }
);

const App = ({Component, pageProps}) => (
	<main>
	<Provider store={basicReduxStore}>
		<div>
			<Header />
	        <Auth />
            <hr/>
			<Component {...pageProps} />
		</div>
	</Provider>
    <style jsx>{`
        div {
            margin: 0 auto;
            margin-left: 5pt;
        }
    `}</style>
    <style jsx global>{`
        body {
            display: inline;
            text-align: left;
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
