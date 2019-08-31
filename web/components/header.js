import dynamic from 'next/dynamic';

const Auth = dynamic(import('./auth'), { ssr: false });

export default () => (
	<main>
		<div className="app-name">
			<h1>Enviro</h1>
		</div>
		<div className="auth-div">
			<Auth />
		</div>
		<hr />
		<style jsx>{`
			.app-name {
				display: inline-block;
			}
			h1 {
				text-align: left;
				margin-top: 0;
				margin-bottom: 0;
			}
			.auth-div {
				display: inline-block;
				float: right;
			}
		`}</style>
	</main>
);
