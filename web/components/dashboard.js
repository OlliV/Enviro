import { useState } from 'react';
import ms from 'ms';
import { useSelector } from 'react-redux';
import useInterval from '../lib/use-interval';
import Line from './line';
import getData from '../lib/get-data';

export default () => {
	const isAuthenticated = useSelector(
		({ state }) => state === 'Authenticated'
	);
	const [data, setData] = useState([]);

	useInterval(async () => {
		if (!isAuthenticated) {
			return;
		}

		try {
			const d = await getData();
			setData(d);
		} catch (err) {
			console.error(err);
		}
	}, ms('30s'));


	return (
		<div>
			<div className="container">
				{isAuthenticated ? (
					<div>
						<Line series={data}/>
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
