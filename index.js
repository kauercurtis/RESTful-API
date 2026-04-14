const express = require('express');
const app = express();
const { checkContentType, checkBusiness, checkReview, checkPhoto } = require('./middleware');
const { generateUniqueId } = require('./hash');

const port = 8086;

let businesses = new Map();

app.use(express.json());

app.listen(port, () => {
	console.log(`========= Server is listening on port ${port} =========`);
});

app.get("/", (req, res, next) => {
	res.status(200).send();
});

app.get("/businesses", (req, res) => {
	res.status(200).send(businesses);
});

app.get("/businesses/:id/reviews", (req, res) => {
	const businessID = req.params.id;
	console.log(`Validating GET request to /businesses/${businessID}/reviews`);
	const businessEvaluated = businesses[businessID];
	if (businessEvaluated != null) {
		console.log("GET request accepted");
		res.status(200).send(businessEvaluated["reviews"]);
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
	const reviewEvaluated = businesses[businessID]["reviews"][reviewID];
	if ((businesses[businessID] != null) && reviewEvaluated != null)) {
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
	const photoEvaluated = businesses[businessID]["photos"][photoID];
	if ((businesses[businessID != null) && photoEvaluated != null)) {
		console.log("GET request accepted");
		res.status(200).send(photoEvaluated);
	}
	else {
		res.status(404).send({"error": "business or photo not found"});
	}
});

app.post("/businesses", checkContentType, checkBusiness, async (req, res, next) => {
	const newBusiness = JSON.stringify(req.body);
	console.log(`Adding to /businesses: ${newBusiness}`);
	console.log('Generating new id');
	const id = await generateUniqueId(req.body);
	console.log(`Id generated: ${id}`);
	newBusiness.id = id;
	newBusiness.website = req.body.website ? req.body.website : "";
	newBusiness.email = req.body.email ? req.body.email : "";
	newBusiness.reviews = [];
	newBusiness.photos = [];
	businesses[id] = newBusiness;
	res.status(201).send({"links": {"business": `/businesses/${id}`}});
});

app.post("/businesses/:id/reviews", checkContentType, checkReview, (req, res, next) => {
	const businessID = req.params.id;
	if (businesses[businessID] != null) {
		const newReview = JSON.stringify(req.body);
		console.log(`Adding to /businesses/${businessID}/reviews: ${newReview}`);
		console.log('Generating new id');
		const id = businesses[businessID]["reviews"].length
		console.log(`Id generated: ${id}`);
		newReview.id = id;
		businesses[businessID]["reviews"][id] = newReview;
		res.status(201).send({"links": {"review": `businesses/${businessID}/reviews/${id}`}});
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});

app.post("/businesses/:id/photos",checkContentType, checkPhoto, (req, res, next) => {
	const businessID = req.params.id;
	if (businesses[businessID] != null) {
		const newPhoto = JSON.stringify(req.body);
		console.log(`Adding to /businesses/${businessID}/photos: ${newPhoto}`);
		console.log('Generating new id');
		const id = businesses[businessID]["photos"].length
		console.log(`Id generated: ${id}`);
		newPhoto.id = id;
		businesses[businessID]["photos"][id] = newPhoto;
		res.status(201).send({"links": {"photo": `businesses/${businessID}/photos/${id}`}});
	}
	else {
		res.status(404).send({"error": "business not found"});
	}
});
