import { useState } from 'react';
import Select from 'react-select';
import ms from 'ms';
import { useSelector } from 'react-redux';
import useInterval from '../lib/use-interval';
import Line from './line';
import getSeries from '../lib/get-series';

const points = 15;
const timeWindowOptions = [
	{ i: 0, value: 60, label: 'Hour' },
	{ i: 1, value: 1440, label: 'Day' },
	{ i: 2, value: 10080, label: 'Week' },
	{ i: 3, value: 40320, label: 'Month' }
];

export default () => {
	const isAuthenticated = useSelector(
		({ state }) => state === 'Authenticated'
	);
	const dataStates = timeWindowOptions.map(() => useState([]));
	const [timeWindow, setTimeWindow] = useState(timeWindowOptions[0]);

	timeWindowOptions.map(({i, value: nrSamples}) => {
		useInterval(async () => {
			if (!isAuthenticated) {
				return;
			}

			try {
				const data = await getSeries(nrSamples, points);
				const setWin = dataStates[i][1];
				setWin(data);
			} catch (err) {
				console.error(err);
			}
		}, ms('30s'));
	});

	const handleChange = (selectedOption) => {
		setTimeWindow(selectedOption);
	}

	return (
		<div>
			<Select
				value={timeWindow}
				onChange={handleChange}
				options={timeWindowOptions}
			/>
			<div className="container">
				{isAuthenticated
					?  dataStates[timeWindow.i][0].map((v, i) => (<Line key={i} series={[v]} title={v.id}/>))
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
