const express = require('express');
const app = express();

const port = 8086;

let businesses = new Map();

app.use(express.json());

app.listen(port, () => {
	console.log(`========= Server is listening on port ${port} =========`);
});

app.get("/", (req, res, next) => {
	res.status(200).send();
});

app.post("/businesses", (req, res, next) => {
	const newBusiness = JSON.stringify(req.body);
	console.log(`Attempting to add: ${newBusiness}`);
	res.status(201).send();
});
