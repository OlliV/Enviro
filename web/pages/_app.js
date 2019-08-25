import Header from '../components/header';

const App = ({Component, pageProps}) => (
	<main>
		<div>
			<Header />
			<Component {...pageProps} />
		</div>
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
