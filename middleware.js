const express = require('express');

const BUSINESS_KEYS = ["name", "streetAddress", "city", "state", "zip", "phone", "category", "subCategories", "website", "email"];
const REVIEW_KEYS = ["starRating", "dollarRating", "writtenReview"];
const PHOTO_KEYS = ["caption", "url"];
const PATCH_KEYS = ["op", "path", "value"];

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
	keys.forEach((key) =>  {
		if (!possibleKeys.includes(key)) {
			return false;
		}
	});
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

function checkPatch(req, res, next) {
	if (checkBodySize(req.body, 3, 3) && checkBodyContent(req.body, PATCH_KEYS) && req.body.op && req.body.path && req.body.value) {
		next();
	}
	else {
		res.status(400).send({"error": "required key(s) mismatch"});
	}
}

function checkBusiness(req, res, next) {
	if (checkBodySize(req.body, 10, 8) && checkBodyContent(req.body, BUSINESS_KEYS) && req.body.name && req.body.streetAddress && req.body.city && req.body.state && req.body.zip && req.body.phone && req.body.category && checkSubCategories(req.body.subCategories)) {
		next();
	} 
	else {
		res.status(400).send({"error": "required key(s) mismatch"});
	}
}

function checkReview(req, res, next) {
	if (checkBodySize(req.body, 3, 2) && checkBodyContent(req.body, REVIEW_KEYS) && req.body.starRating && req.body.dollarRating) {
		next();
	}
	else {
		res.status(400).send({"error": "required key(s) mismatch"});
	}
}

function checkPhoto(req, res, next) {
	if (checkBodySize(req.body, 2, 1) && checkBodyContent(req.body, PHOTO_KEYS) && req.body.url && req.body.caption) {
		next();
	}
	else {
		res.status(400).send({"error": "required key(s) mismatch"});
	}
}

module.exports = {
	checkContentType,
	checkBusiness,
	checkReview,
	checkPhoto,
	checkPatch
}
