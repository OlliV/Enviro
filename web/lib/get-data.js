import moment from 'moment';
import { listFiles } from './one-drive';
import { getLabels, getLastN } from './excel';

const ENVIRO_PATH = '/Enviro';

let workbookIdPromise = null;

// TODO for now we support just one workbook that we find by name
async function findworkbook() {
	if (!workbookIdPromise) {
		const fn = async () => {
			const files = await listFiles(ENVIRO_PATH);

			for (const file of files) {
				if (file.name === 'enviro-data.xlsx') {
					return file.id;
				}
			}

			throw new Error('File not found');
		};

		const p = fn();
		workbookIdPromise = p;
		p.catch((error) => {
			console.error(error);
			workbookIdPromise = null;
		});
	}

	return workbookIdPromise;
}

export default async function getSeries() {
	const workbookId = await findworkbook();
	const worksheetName = 'Measurements';

	const range = await getLastN(workbookId, worksheetName, 15);
	const labels = await getLabels(workbookId, worksheetName);
	labels[0] = 'time';
	range.shift(); // remove the blank row

	const series = [];
	for (let i = 1; i < labels.length; i++) {
		const label = labels[i];

		series.push({
			id: label,
			color: `hsl(${i * 10}, 70%, 50%)`,
			data: []
		});
	}

	for (const row of range) {
		for (let i = 1; i < row.length; i++) {
			series[i - 1].data.push({
				x: moment(row[0] * 1000).format('YYYY-MM-DD HH:mm'),
				y: row[i]
			});
		}
	}

	return series;
}
