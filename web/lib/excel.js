import retry from 'async-retry';
import fetch from '../lib/fetch-graph-api';

// GET chart
// https://docs.microsoft.com/en-us/graph/excel-display-chart-image

// Refresh pivot tables
// POST /me/drive/root/workbook/worksheets/{id}/pivotTables/refreshAll
export async function refreshPivotTables(id, sheet) {
	const encodedSheet = encodeURIComponent(sheet);

	await fetch(`/me/drive/items/${id}/workbook/worksheets/${encodedSheet}/pivotTables/refreshAll`, {
		method: 'POST',
		throwOnHTTPError: true
	});
}

export async function getPivotTableSize(id, sheet, pivotTable) {
	const encodedSheet = encodeURIComponent(sheet);
	const encodedPivotTable = encodeURIComponent(pivotTable);

	const {columnCount, rowCount} = await fetch(`/me/drive/items/${id}/workbook/worksheets/${encodedSheet}/pivotTables/${encodedPivotTable}/worksheet/usedRange?$select=columnCount,rowCount`, {
		throwOnHTTPError: true
	});

	return {columnCount, rowCount};
}

// range: "address='A1:B5'"
export async function getPivotTableRange(id, sheet, pivotTable, range) {
	const encodedSheet = encodeURIComponent(sheet);
	const encodedPivotTable = encodeURIComponent(pivotTable);
	const encodedRange = encodeURIComponent(range);
	let sessionId;

	return retry(async (bail) => {
		// Create session
		if (!sessionId) {
			const {id: sId} = await fetch(`/me/drive/items/${id}/workbook/createSession`, {
				method: 'POST',
				body: '{"persistChanges":"false"}',
				throwOnHTTPError: true
			});
			sessionId = sId;
			console.log(sessionId);
		}

		await new Promise((r) => setTimeout(r, 10000));
		console.log('sleep done');

		try {
		// Refresh the pivot table
		await fetch(`/me/drive/items/${id}/workbook/worksheets/${encodedSheet}/pivotTables/refreshAll`, {
			method: 'POST',
			headers: {
				'workbook-session-id': sessionId
			},
			throwOnHTTPError: true
		});
		console.log('refresh done');

		// Get values
		const { values } = await fetch(`/me/drive/items/${id}/workbook/worksheets/${encodedSheet}/pivotTables/${encodedPivotTable}/worksheet/range(${encodedRange})?$select=values`, {
			headers: {
				'workbook-session-id': sessionId
			},
			throwOnHTTPError: true
		});
		console.log(values);
		} catch (err) {
			if (err.code === 'InvalidOrTimedOutSession') {
				console.error(`Reseting the session: "${err.message}"`);
				sessionId = null;
				throw err;
			}
			if (err.status === 400) {
				bail(err);
			}
		}

		return values;
	}, { retries: 3, maxTimeout: 30000 });
}
