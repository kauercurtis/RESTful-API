## JSON Schemes

### Pages Data Structure
```json
{
	"totalPages": int,
	"maxPageSize": int,
	"pages": [Page {}, Page {}, ...]
}
```

### Page Data Structure

```json
{
	"pageNumber": int,
	"pageSize": int,
	":dataType(businesses, reviews, ect)": [dataType {}, dataType {}, ...]
}
```

### Business JSON Scheme

```json

{
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

	"reviews": Page {},
	"photos": Page {},
	"id": string
}
```

### Review JSON Scheme

```json
{
	"starRating": int,
	"dollarRating": int,
	"writtenReview": string (optional),
	"links": {
		"business": "/businesses/:id"
	},
	"id": string
}

```

### Photo JSON Scheme

```json
	"caption": string
	"url": string
	"links": {
		"business": "/busineses/:id
	}
	"id": string
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
Response Body:
```json
{"links": {"review": /businesses/:businessID/reviews/:reviewID
```

Request: 'POST /businesses/:id/photos'
Request Body:
```json
	"businessID": int,
	"caption": string,
	"url": string
```
Response Body:
```json
{"links": {"photo": "/businesses/:businessID/photos/:photoID"}}
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
Response Body:
```json
{
	"links": "links": { "business": `/businesses/${req.params.id}` }
}
```

Request: 'PATCH /businesses/{id}/reviews/reviewID'
Request Body:
```json
{
	"op": "replace",
	"path": "/{variable to update}",
	"value": "new value"
}
```
Response Body:
```json
{
	"links": { "review": `businesses/${businessID}/reviews/${reviewID}` }
}
```

Request: 'PATCH /businesses/{id}/photos/photoID'
Request Body:
```json
{
	"op": "replace",
	"path": "/{variable to update}",
	"value": "new value"
}
```
Response Body:
```json
{
	"links": { "photo": `businesses/${businessID}/photos/${photoID}` }
}
```


### API GET Operations

Request: 'GET /businesses'
Request Body: -
Response Body: 
```json
{
	"pageNumber": int,
	"totalPages": int,
	"pageSize": int,
	"totalCount": int,
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
	"links": {
		"nextPage": "/businesses?page=:nextPageNumber",
		"lastPage": "/businesses?page=:lastPageNumber"
	}
}
```

Request: 'GET /businesses/:businessID/photos'
Request Body: -
Response Body:
```json
{
	"pageNumber": int,
	"totalPages": int,
	"pageSize": int,
	"totalCount": 
	"photos": [
		{
			
		}
	]
}
```

Request: 'GET /businesses/:businessID/reviews'
Request Body: - 
Response Body:
```json
{
	"pageNumber": int,
	"totalPages": int,
	"pageSize": int,
	"totalCount": 
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


