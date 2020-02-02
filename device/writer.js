const { findWorkbook, addRows } = require('./excel');
const splitArray = require('split-array');

const queue = [];

function calcAvgs(arr, bucketSize) {
	const buckets = splitArray(arr, bucketSize);

	// Calculate geometric mean of the timestamps
	const timestamps = buckets.map((samples) => {
		const prod = samples.reduce((acc, values) => acc * values[0], 1);
		return Math.floor(Math.pow(prod, 1 / samples.length));
	});

	const res = buckets.map((samples) => samples.reduce((avgs, values, _, { length }) => {
		return avgs.map((avg, i) => avg + values[i] / length);
	}, Array(arr[0].length).fill(0)));

	// Replace the timestamps with proper geometric means
	for (let i = 0; i < res.length; i++) {
		res[i][0] = timestamps[i];
	}

	return res;
}

module.exports = function createWriter(path, filename, sampleSize, syncInterval) {
	async function writeout() {
		const workbookId = await findWorkbook(path, filename);
		const rawData = [...queue];
		const len = rawData.length;
		if (len === 0) {
			return;
		}

		await addRows(workbookId, 'Table1', calcAvgs(rawData, sampleSize));

		// Splice only if the previous op was successful.
		// This makes us retry forever or until OOM.
		queue.splice(0, len);

		console.log(`Processed ${len} samples`);
	};

	setInterval(() => {
		writeout().catch((err) => console.error(`Writer error:`, err));
	}, syncInterval);

	return function write(row) {
		queue.push(row);
	};
};
