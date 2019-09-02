import { useState } from 'react';
import { useSelector } from 'react-redux';
import useInterval from '../lib/use-interval';
import Line from './line';
import getData from '../lib/get-data';

export default () => {
	const isAuthenticated = useSelector(
		({ state }) => state === 'Authenticated'
	);
	const [data, setData] = useState([]);

	getData().then(setData);
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
	}, 300000);


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
