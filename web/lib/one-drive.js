import fetch from '../lib/fetch-graph-api';

function getType(file) {
	if (file.file) {
		return file.file.mimeType;
	}
	if (file.folder) {
		return 'folder';
	}
	return 'application/octet-stream';
}

export async function listFiles(path) {
	const encodedPath = encodeURIComponent(path);
	const res = await fetch(
		`/me/drive/special/approot${path ? `:${encodedPath}:` : ''}/children`
	);

	if (!res.value) {
		throw new Error('`value` missing');
	}

	return res.value.map((file) => ({
		id: file.id,
		name: file.name,
		type: getType(file),
	}));
}

export async function getFile(path) {
	const encodedPath = encodeURIComponent(path);
	const res = await fetch(`/me/drive/special/approot:${encodedPath}`);

	return res;
}
