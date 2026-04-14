const express = require('express');

const BUSINESS_KEYS = ["name", "streetAddress", "city", "state", "zip", "phone", "category", "subCategories", "website", "email"];

function checkContentType(req, res, next) {
	if (req.get('Content-Type') != "application/json") {
		res.status(415).send({"error": "unaccepted Content-Type"});
	}
	else {
		next();
	}
}

function checkBodySize(requestBody, maximumSize, minimumSize) {
	const keyLength = Object.keys(requestBody).length;
	if ((keyLength === minimumSize) || (keyLength === maximumSize)) {
		return true;
	}
	else {
		return false;
	}
}

function checkBodyContent(requestBody, possibleKeys) {
	const keys = Object.keys(requestBody);
	keys.forEach (key) {
		if (!possibleKeys.includes(key)) {
			return false;
		}
	}
	return true;
}

function checkSubCategories(subCategories) {
	if ((subCategories != null) && (subCategories.length > 0)) {
		return true;
	}
	else {
		return false;
	}
}

function checkBusiness(req, res, next) {
	if (checkBodySize(req.body, 10, 8) && checkBodyContent(req.body, BUSINESS_KEYS) && req.body.name && req.body.streetAddress && req.body.city && req.body.state && req.body.zip && req.body.phone && req.body.category && checkSubCategories(req.body.subCategories) {
		next();
	} 
	else {
		res.status(400).send({"error": "missing required key(s)"});
	}
}

function checkReview(req, res, next) {
	if (checkBodySize(req.body, 3, 2) && req.body.starRating && req.body.dollarRating) {
		next();
	}
	else {
		res.status(400).send({"error": "missing required key(s)"});
	}
}

function checkPhoto(req, res, next) {
	if (checkBodySize(req.body, 2, 0) && req.body.url && req.body.caption) {
		next();
	}
	else {
		res.status(400).send({"error": "missing required key(s)"});
	}
}

module.exports = {
	checkContentType,
	checkBusiness,
	checkReview,
	checkPhoto
}
