module.exports = function promiseCache(cache, fn) {
	return (...args) => {
		const key = JSON.stringify(args);
		let p = cache.get(key);

		if (!p) {
			p = fn(...args);
			p.catch(() => cache.del(key));
			cache.set(key, p);
		}

		return p;
	};
};
