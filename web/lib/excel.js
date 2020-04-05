import fetch from '../lib/fetch-graph-api';

// GET chart
// https://docs.microsoft.com/en-us/graph/excel-display-chart-image

export async function getLabels(id, sheet) {
	const encodedSheet = encodeURIComponent(sheet);

	const { value } = await fetch(
		`/me/drive/items/${id}/workbook/worksheets/${encodedSheet}/tables/Table1/columns`,
		{
			throwOnHTTPError: true,
		}
	);

	return value.map(({ name }) => name);
}

// range: "address='A1:B5'"
export async function getLastN(id, sheet, count) {
	const encodedSheet = encodeURIComponent(sheet);

	const { address: fullAddr, rowCount } = await fetch(
		`/me/drive/items/${id}/workbook/worksheets/${encodedSheet}/usedRange?$select=address,rowCount`,
		{
			throwOnHTTPError: true,
		}
	);

	let start = rowCount - count;
	if (start < 2) {
		start = 2;
	}
	const address = `address='A${start}:${fullAddr.split(':')[1]}'`;

	// Get values
	const { values } = await fetch(
		`/me/drive/items/${id}/workbook/worksheets/${encodedSheet}/range(${address})?$select=values`,
		{
			throwOnHTTPError: true,
		}
	);

	return values;
}
