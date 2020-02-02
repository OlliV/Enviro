const fetch = require('./fetch-graph-api');

const special = false;

function getType(file) {
	if (file.file) {
		return file.file.mimeType;
	}
	if (file.folder) {
		return 'folder';
	}
	return 'application/octet-stream';
}

exports.listFiles = async function listFiles(path) {
	const encodedPath = encodeURIComponent(path);
	const root = special ? 'special/approot' : 'root';
	const res = await fetch(`/me/drive/${root}${path ? `:${encodedPath}:` : ''}/children`);

	if (!res.value) {
		throw new Error('`value` missing');
	}

	return res.value.map((file) => ({
		id: file.id,
		name: file.name,
		type: getType(file),
	}));
};
