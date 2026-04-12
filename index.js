const express = require('express');
const app = express();
const { checkContentType, checkBusiness } = require('./middleware');

const port = 8086;

let businesses = new Map();

app.use(express.json());

app.listen(port, () => {
	console.log(`========= Server is listening on port ${port} =========`);
});

app.get("/", (req, res, next) => {
	res.status(200).send();
});

app.post("/businesses", checkContentType, checkBusiness, (req, res, next) => {
		const newBusiness = JSON.stringify(req.body);
		console.log(`Adding: ${newBusiness}`);
		res.status(201).send();
	}
});
