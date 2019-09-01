import { useSelector } from 'react-redux';
import fetch from '../lib/fetch-graph-api';
import Line from './line';

export default () => {
	const isAuthenticated = useSelector(
		({ state }) => state === 'Authenticated'
	);

	if (isAuthenticated) {
		fetch('/me/drive/items/C55AB945326036C!2074/workbook/worksheets').then(console.log);
	}

	return (
		<div>
			<div className="container">
				{isAuthenticated ? (
					<div>
						<Line />
						<Line />
					</div>
				) : (
					<b>Please login</b>
				)}
			</div>
			<style jsx>{`
				.container {
					height: 100vh;
					width: 100vw;
					display: grid;
					text-align: center;
					justify-content: center;
					align-items: center;
				}
			`}</style>
		</div>
	);
};
