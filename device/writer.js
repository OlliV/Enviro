const { fs: fsPromises } = require('fs');
const { readFileSync } = require('fs');
const ms = require('ms');
const splitArray = require('split-array');
const { findWorkbook, addRows } = require('./excel');

const BACKUP_FILE = 'writer.bak.json';
const BACKUP_INTERVAL = ms('5m');
const queue = [];

let writingToDisk = false;

try {
	const data = readFileSync(BACKUP_FILE, 'utf8');

	queue.push(...JSON.parse(data));
} catch (err) {
	console.error('Failed to read the backup data:', err);
}

async function syncToDisk(arr) {
	if (writingToDisk) {
		throw new Error('Previous sync incomplete');
	}
	writingToDisk = true;

	try {
		await fs.writeFile(BACKUP_FILE, JSON.stringify(arr), {
			encoding: 'utf8',
			flag: 'w'
		});
	} catch (err) {
		throw err;
	} finally {
		writingToDisk = false;
	}
}

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

	// Periodic write to SPO
	setInterval(() => {
		writeout().catch((err) => console.error(`Writer error:`, err));
	}, syncInterval);

	// Periodic backup to disk
	setInterval(() => {
		syncToDisk(arr)
			.then(() => console.log('syncToDisk complete'))
			.catch((err) => console.error('Writer error: ', err));
	}, BACKUP_INTERVAL);

	return function write(row) {
		queue.push(row);
	};
};
