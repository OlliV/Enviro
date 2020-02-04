const { readFileSync, promises: fsPromises } = require('fs');
const { downsample } = require('@olliv/timeseries');
const ms = require('ms');
const { findWorkbook, addRows } = require('./excel');

const BACKUP_FILE = 'writer.bak.json';
const BACKUP_INTERVAL = ms('10m');
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
		await fsPromises.writeFile(BACKUP_FILE, JSON.stringify(arr), {
			encoding: 'utf8',
			flag: 'w'
		});
	} catch (err) {
		throw err;
	} finally {
		writingToDisk = false;
	}
}

module.exports = function createWriter(path, filename, sampleSize, syncInterval) {
	async function writeout() {
		const workbookId = await findWorkbook(path, filename);
		const rawData = [...queue];
		const len = rawData.length;
		if (len === 0) {
			return;
		}

		await addRows(workbookId, 'Table1', downsample(rawData, sampleSize));

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
		syncToDisk([...queue])
			.then(() => console.log('syncToDisk complete'))
			.catch((err) => console.error('Writer error: ', err));
	}, BACKUP_INTERVAL);

	return function write(row) {
		queue.push(row);
	};
};
