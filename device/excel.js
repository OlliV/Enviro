const LRU = require('lru-cache');
const ms = require('ms');
const promiseCache = require('./promise-cache');
const { listFiles } = require('./one-drive');
const fetch = require('./fetch-graph-api');

findWorkbook = promiseCache(new LRU({
	max: 1000,
	maxAge: ms('120m')
}), async (path, name) => {
	const files = await listFiles(path);

	for (const file of files) {
		if (file.name === name) {
			return file.id;
		}
	}

	throw new Error('File not found');
});
exports.findWorkbook = findWorkbook;

exports.addRows = async function addRows(workbookId, table, values) {
	const encodedTable = encodeURIComponent(table);

	await fetch(`/me/drive/items/${workbookId}/workbook/tables/${encodedTable}/rows/add`, {
		method: 'POST',
		body: {
			index: null,
			values
		}
	});
}
