import dynamic from 'next/dynamic';

const Auth = dynamic(import('./auth'), { ssr: false });

export default () => (
	<main>
		<div className="container">
			<div className="app-name">
				<h1>Enviro</h1>
			</div>
			<div className="auth">
				<Auth />
			</div>
		</div>
		<style jsx>{`
			h1 {
				text-align: left;
				margin-top: 0;
				margin-bottom: 0;
			}
			.container {
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #e1e1e1;
				margin-left: 5pt;
				margin-right: 5pt;
				margin-bottom: 5pt;
			}
			.auth {
				display: flex;
				justify-content: flex-end;
			}
		`}</style>
	</main>
);
