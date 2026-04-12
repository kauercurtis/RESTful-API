const express = require('express');

function checkContentType(req, res, next) {
	if (req.get('Content-Type') != "application/json") {
		res.status(415).send({"error": "unaccepted Content-Type"});
	}
	else {
		next();
	}
}

function checkBusiness(req, res, next) {
	if (req.body.name && req.body.streetAddress && req.body.city && req.body.state && req.body.zip && req.body.phone && req.body.category && req.body.subcategories) {
		next();
	} 
	else {
		res.status(400).send({"error": "missing required key(s)"});
	}
}
