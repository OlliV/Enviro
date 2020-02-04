import { useState } from 'react';
import Select from 'react-select';
import ms from 'ms';
import { useSelector } from 'react-redux';
import useInterval from '../lib/use-interval';
import Line from './line';
import getData from '../lib/get-data';

const points = 15;
const timeWindowOptions = [
	{ i: 0, value: 60, label: 'Hour' },
	{ i: 1, value: 1440, label: 'Day' },
	{ i: 2, value: 1080, label: 'Week' },
	{ i: 3, value: 40320, label: 'Month' }
];


export default () => {
	const isAuthenticated = useSelector(
		({ state }) => state === 'Authenticated'
	);
	const [data, setData] = useState([[], [], [], []]);
	const [timeWindow, setTimeWindow] = useState(timeWindowOptions[0]);

	const handleChange = (selectedOption) => {
		setTimeWindow(selectedOption);
	}

	useInterval(async () => {
		if (!isAuthenticated) {
			return;
		}

		try {
			const d = await Promise.all([
				getData(timeWindowOptions[0].value, points),
				getData(timeWindowOptions[1].value, points),
				getData(timeWindowOptions[2].value, points),
				getData(timeWindowOptions[3].value, points)
			]);
			setData(d);
		} catch (err) {
			console.error(err);
		}
	}, ms('30s'));

	return (
		<div>
			<Select
				value={timeWindow}
				onChange={handleChange}
				options={timeWindowOptions}
			/>
			<div className="container">
				{isAuthenticated
					?  data[timeWindow.i].map((v, i) => (<Line key={i} series={[v]} title={v.id}/>))
					: (<b>Please login</b>)}
			</div>
			<style jsx>{`
				.container {
					height: 90vh;
					width: 100vw;
					display: flex;
					flex-wrap: wrap;
					margin-left: 5pt;
					margin-right: 5pt;
				}
			`}</style>
		</div>
	);
};
