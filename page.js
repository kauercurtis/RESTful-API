function getNewPage(pageNumber) {
	const newPage = {
		"pageNumber": pageNumber,
		"pageSize": 0,
		"data": {}
	};
	return newPage;
}

module.exports = {
	getNewPage
}

