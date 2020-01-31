const { listFiles } = require('./one-drive');

let workbookIdPromise = null;

exports.findWorkbook = async function findWorkbook(path, name) {
	if (!workbookIdPromise) {
		const fn = async () => {
			const files = await listFiles(path);

			for (const file of files) {
				if (file.name === name) {
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
};
