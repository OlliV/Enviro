import { useState } from 'react';
import Select from 'react-select';
import ms from 'ms';
import { useSelector } from 'react-redux';
import useInterval from '../lib/use-interval';
import Line from './line';
import getData from '../lib/get-data';

const timeWindowOptions = [
	{ value: 60, label: 'Hour' },
	{ value: 1440, label: 'Day' },
	{ value: 1080, label: 'Week' },
	{ value: 40320, label: 'Month' }
];

export default () => {
	let updatingData = false;
	const isAuthenticated = useSelector(
		({ state }) => state === 'Authenticated'
	);
	const [data, setData] = useState([]);
	const [timeWindow, setTimeWindow] = useState(timeWindowOptions[0]);

	const updateGraphs = async (twin) => {
		if (!isAuthenticated) {
			updatingData = false;
			return;
		}

		if (updatingData) {
			return;
		}

		try {
			updatingData = true;

			const d = await getData(twin, 15);
			setData(d);
		} catch (err) {
			console.error(err);
		} finally {
			updatingData = false;
		}
	}

	const handleChange = (selectedOption) => {
		setTimeWindow(selectedOption);
		updateGraphs(selectedOption.value);
	}

	setTimeout(async () => updateGraphs(timeWindow.value), 0);
	useInterval(async () => updateGraphs(timeWindow.value), ms('30s'));

	return (
		<div>
			<Select
				value={timeWindow}
				onChange={handleChange}
				options={timeWindowOptions}
			/>
			<div className="container">
				{isAuthenticated
					?  data.map((v, i) => (<Line key={i} series={[v]} title={v.id}/>))
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
