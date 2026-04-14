## JSON Schemes

### Business JSON Scheme

```json

{
	"id": int,
	"name": string,
	"streetAddress": string,
	"city": string,
	"state": string,
	"zip": string,
	"phone": string,
	"category": string,
	"subCategories": string [],
	
	"website": string (optional),
	"email": string (optional),

	"reviews": string [],
	"photos": string []
}
```

### Review JSON Scheme

```json
{
	"id": int,
	"starRating": int,
	"dollarRating": int,
	"writtenReview": string (optional),
	"links": {
		"business": "/businesses/:id"
	}
}

```

### User JSON Scheme

```json
{
	"userID, int,
	"reviews": string []
	"photos": []
}
```

### Photo JSON Scheme

```json
	"businessID": int,
	"caption": string,
	"links": {
		"user": "/users/:userID",
		"business": "/businesses/:id"
	}
```

### API POST Operations

Request: 'POST /businesses'
Request Body:
```json
{
	"name": "random resturant",
	"streetAddress": "1234 fake ave",
	"city": "Flavortown",
	"state": "Missouri",
	"zip": "87612",
	"phone": "123-456-7890",
	"category": "resturant",
	"subCategories": [
		"burgers",
		"meatloaf"
	]
}
```
Response Body:
```json
{"links": {"business": /businesses/:id}}
```

Request: 'POST /businesses/{id}/reviews'
Request Body:
```json
{
	"starRating": 2,
        "dollarRating": 4,
        "writtenReview": "The vibes are foul and the food rancid"
}
```
Response Body: - 

Request: 'POST /businesses/:id/photos'
Request Body:
```json
	"businessID": int,
	"caption": string,
	"url": string
```

### API PATCH Operations

Request: 'PATCH /businesses/{id}'
Request Body:
```json
{
	"op": "replace",
	"path": "/{variable to update}",
	"value": "new value"
}
```
Response Body: -

### API GET Operations

Request: 'GET /businesses'
Request Body: -
Response Body: 
```json
{
	"businesses": [
		{
			"id": 1234,
			"name": "random resturant",
			"streetAddress": "123 made up avenue",
			...
		},
		{
			"id": 2345,
			...
		}
	]
}
```

Request: 'GET /users/{userID}/reviews'
Request Body: - 
Response Body:
```json
{
	"reviews": [
		{
			
		}
	]
}
```

### API DELETE Operations

Request 'DELETE /businesses/{id}'
Request Body: - 
Response Body: - 


