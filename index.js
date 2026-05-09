const express = require('express');
const app = express();
const { checkContentType, checkBusiness, checkReview, checkPhoto, checkPatch } = require('./middleware');
const { generateUniqueId } = require('./hash');
const { getNewPage } = require('./page');

const port = 8086;

let businesses = new Map();
let lookupTable = new Map();

const PAGE_SIZE_LIMIT = 10;

app.use(express.json());

app.listen(port, () => {
	console.log(`========= Server is listening on port ${port} =========`);
});

app.patch("/businesses/:id", checkContentType, checkPatch, (req, res, next) => {
	const businessID = req.params.id;
	console.log(`Validating PATCH request to /businesses/${businessID}`);
	const businessEvaluated = businesses[businessID];
	if (businessEvaluated) {
		console.log("PATCH request accepted");
		const body = req.body[0];
		console.log(body);
		const key = body.path.slice(1);
		console.log(key)
		const newValue = body.value;
		console.log(newValue);
		businesses[businessID][key] = newValue;
		console.log(businesses[businessID][key]);
		res.status(201).send({"links": {"business": 'businesses/${businessID}'}});
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});

app.patch("/businesses/:id/reviews/:reviewid", checkContentType, checkPatch, (req, res, next) => {
	const businessID = req.params.id;
	const reviewID = req.params.reviewid;
	console.log(`Validating PATCH request to /businesses/${businessID}/reviews/${reviewID}`);
	const reviewEvaluated = businesses[businessID]["reviews"][reviewID];
	if ((businesses[businessID] != null) && (reviewEvaluated != null)) {
		console.log("PATCH request accepted");
		const newValue = req.body.value;
		businesses[businessID]["reviews"][reviewID] = newValue;
		res.status(204).send({"links": {"review": `businesses/${businessID}/reviews/${reviewID}`}});
	}
	else {
		res.status(404).send({"errror": "business or review not found"});
	}
});

app.patch("/businesses/:id/photos/:photoid", checkContentType, checkPatch, (req, res, next) => {
	const businessID = req.params.id;
	const photoID = req.params.photoid;
	console.log(`Validating PATCH request to /businesses/${businessID}/photos/${photoID}`);
	const photoEvaluated = businesses[businessID]["photos"][photoID];
	if ((businesses[businessID] != null) && (photoEvaluated != null)) {
		console.log("PATCH request accepted");
		const newValue = req.body.value;
		businesses[businessID]["photos"][photoID] = newValue;
		res.status(204).send({"links": {"photo": `businesses/${businessID}/photos/${photoID}`}});
	}
	else {
		res.status(404).send({"error": "business or photo not found"});
	}
});

app.delete("/businesses/:id", (req, res) => {
	const businessID = req.params.id;
	console.log(`Validating DELETE request to /businesses/${businessID}`);
	const businessEvaluated = businesses[businessID];
	if (businessEvaluated != null) {
		console.log("DELETE request accepted");
		businesses.delete(businessID);
		res.status(204).send();
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});

app.delete("/businesses/:id/reviews/:reviewid", (req, res) => {
        const businessID = req.params.id;
        const reviewID = req.params.reviewid;
        console.log(`Validating DELETE request to /businesses/${businessID}/reviews/${reviewID}`);
        const reviewEvaluated = businesses[businessID]["reviews"][reviewID];
        if ((businesses[businessID] != null) && (reviewEvaluated != null)) {
                console.log("DELETE request accepted");
                businesses[businessID]["reviews"].delete(reviewID);
		res.status(204).send();
        }
        else {
                res.status(404).send({"errror": "business or review not found"});
        }

});

app.delete("businesses/:id/photos/:photoid", (req, res) => {
	const businessID = req.params.id;
	const photoID = req.params.photoid;
	console.log(`Validating DELETE request to /businesses/${businessID}/photos/${photoID}`);
	const photoEvaluated = businesses[businessID]["photos"][photoID];
	if ((businesses[businessID] != null) && (reviewEvaluated != null)) {
		console.log("DELETE request accepted");
		businesses[businessID]["photos"].delete(photoID);
		res.status(204).send();
	}
	else {
		res.status(404).send({"error": "business or photo not found"});
	}
});

app.get("/", (req, res, next) => {
	res.status(200).send();
});

app.get("/businesses", (req, res) => {
	let response = {};
	if (businesses["page1"]) {
		response = {
			"totalPages": businesses.keys().length,
			"page": businesses["page1"],
			"links": {
				"nextPage": businesses["page2"] ? "/businesses?page=page2" : "N/A",
				"lastPage": `/businesses?page=page${businesses.keys().length}`
			}
		};
	}
	res.status(200).send(response);
});

app.get("/businesses/:id", (req, res) => {
	const businessID = req.params.id;
	console.log(`Validating GET request to /businesses/${businessID}`);
	const pageFound = lookupTable[businessID];
	if (pageFound) {
		console.log("GET request accepted");
		res.status(200).send(businesses[pageFound].data[businessID]);
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});

app.get("/businesses/:id/reviews", (req, res) => {
	const businessID = req.params.id;
	console.log(`Validating GET request to /businesses/${businessID}/reviews`);
	const pageFound = lookupTable[businessID];
	if (pageFound) {
		console.log("GET request accepted");
		const response = {
			"totalPages": businesses[pageFound].data[businessID].reviews.keys().length,
			"page": businesses[pageFound].data[businessID].reviews["page1"],
			"links": {
				"nextPage": businesses[pageFound].data[businessID].reviews["page2"] ? `/businesses/${businessID}/reviews?page=page2` : "N/A", 
				"lastPage": `/businesses/${businessID}/reviews?page=page${businesses[pageFound].data[businessID].reviews.keys().length}`
			}
		};
		res.status(200).send(response);
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});

app.get("/businesses/:id/photos", (req, res) => {
	const businessID = req.params.id;
	console.log(`Validating GET request to /businesses/${businessID}/reviews`);
	const businessEvaluated = businesses[businessID];
	if (businessEvaluated != null) {
		console.log("GET request accepted");
		res.status(200).send(businessEvaluated["photos"]);
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});

app.get("/businesses/:id/reviews/:reviewid", (req, res) => {
	const businessID = req.params.id;
	const reviewID = req.params.reviewid;
	console.log(`Validating GET request to /businesses/${businessID}/reviews/${reviewID}`);
	const business = businesses[businessID];
	const reviewEvaluated = business.reviews.get(reviewID);
	console.log(reviewEvaluated);
	if (reviewEvaluated) {
		console.log("GET request accepted");
		res.status(200).send(reviewEvaluated);
	}
	else {
		res.status(404).send({"error": "business or review not found"});
	}
});

app.get("/businesses/:id/photos/:photoid", (req, res) => {
	const businessID = req.params.id;
	const photoID = req.params.photoid;
	console.log(`Validating GET request to /businesses/${businessID}/photos/${photoID}`);
	const business = businesses[businessID]
	const photoEvaluated = business.photos.get(photoID);
	if (photoEvaluated) {
		console.log("GET request accepted");
		res.status(200).send(photoEvaluated);
	}
	else {
		res.status(404).send({"error": "business or photo not found"});
	}
});

app.post("/businesses", checkContentType, checkBusiness, async (req, res, next) => {
	req.body.website = req.body.website ? req.body.website : "";
	req.body.email = req.body.email ? req.body.email : "";
	req.body.reviews = new Map();
	req.body.photos = new Map();
	console.log(`Adding to /businesses: ${req.body.name}`);
	console.log('Generating new id');
	const id = await generateUniqueId(req.body);
	console.log(`Id generated: ${id}`);
	req.body.id = id;

	const pageNumber = businesses.keys().length;
	console.log(`Pages number: ${pageNumber}`);
	if (pageNumber === undefined) {
		let page = getNewPage(1);
		page["pageSize"] = 1;
		page["data"][id] = req.body;
		console.log("No pages exist, creating first page");
		businesses["page1"] = page;
		lookupTable[id] = "page1";
	}
	else if (businesses[`page${pageNumber}`].pageSize === PAGE_SIZE_LIMIT) {
		const newPageNum = pageNumber + 1;
		let page = getNewPage(newPageNum);
		page["pageSize"] = 1;
		page["data"][id] = req.body;
		console.log(`page added: ${newPageNum}`);
		businesses[`page${newPageNum}`] = page;
		lookupTable[id] = `page${newPageNum}`;
	}
	else {
		console.log(`Adding to existing page: ${pageNumber}`);
		businesses[`page${pageNumber}`].pageSize += 1;
		businesses[`page${pageNumber}`].data[id] = req.body;
		lookupTable[id] = `page${pageNumber}`;
	}

	res.status(201).send({"links": {"business": `/businesses/${id}`}});
});

app.post("/businesses/:id/reviews", checkContentType, checkReview, async (req, res, next) => {
	const businessID = req.params.id;
	const pageFound = lookupTable[businessID];
	if (pageFound) {
		console.log('Generating new id');
		const id = await generateUniqueId(req.body);
		console.log(`Id generated: ${id}`);
		req.body.links = {"business": `/businesses/${businessID}`};
		req.body.id = id;
		console.log(`Adding to /businesses/${businessID}/reviews: ${req.body}`);

		const pageNumber = businesses[pageFound].data[businessID].reviews.keys().length;
		if (pageNumber === undefined) {
			let page = getNewPage(1);
			page["pageSize"] = 1;
			page["data"][id] = req.body;
			console.log("No pages exist, creating first page");
			businesses[pageFound].data[businessID].reviews["page1"] = page;
		}
		else if (businesses[pageFound].data[businessID].reviews[pageNumber].pageSize === PAGE_SIZE_LIMIT) {
			const newPageNum = pageNumber + 1;
			let page = getNewPage(newPageNum);
			page["pageSize"] = 1;
			page["data"][id] = req.body;
			console.log(`page added: ${newPageNum}`);
			businesses[pageFound].data[businessID].reviews[`page${newPageNumber}`] = page;
		}
		else {
			console.log(`Adding to existing page: ${pageNumber}`);
			businesses[pageFound].data[businessID].reviews[pageNumber].pageSize += 1;
			businesses[pageFound].data[businessID].reviews[pageNumber].data[id] = req.body;
		}
		res.status(201).send({"links": {"review": `businesses/${businessID}/reviews/${id}`}});
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});

app.post("/businesses/:id/photos",checkContentType, checkPhoto, async (req, res, next) => {
	const businessID = req.params.id;
	const pageFound = lookupTable[businessID];
	if (pageFound) {
		console.log('Generating new id');
		const id = await generateUniqueId(req.body);
		console.log(`Id generated: ${id}`);
		req.body.links = {"business": `/businesses/${businessID}`};
		req.body.id = id;
		console.log(`Adding to /businesses/${businessID}/photos: ${req.body}`);
		// businesses[businessID].photos.set(id, req.body);
		const pageNumber = businesses[pageFound].data[businessID].photos.keys().length;
		if (pageNumber === undefined) {
			let page = getNewPage(1);
			page["pageSize"] = 1;
			page["data"][id] = req.body;
			console.log("No pages exist, creating first page");
			businesses[pageFound].data[businessID].photos["page1"] = page;
		}
		else if (businesses[pageFound].data[businessID].photos[pageNumber].pageSize === PAGE_SIZE_LIMIT) {
			const newPageNum = pageNumber + 1;
			let page = getNewPage(newPageNum);
			page["pageSize"] = 1;
			page["data"][id] = req.body;
			console.log(`page added: ${newPageNum}`);
			businesses[pageFound].data[businessID].photos[`page${newPageNumber}`] = page;
		}
		else {
			console.log(`Adding to existing page: ${pageNumber}`);
			businesses[pageFound].data[businessID].photos[pageNumber].pageSize += 1;
			businesses[pageFound].data[businessID].photos[pageNumber].data[id] = req.body;
		}
		res.status(201).send({"links": {"photo": `businesses/${businessID}/photos/${id}`}});
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});
