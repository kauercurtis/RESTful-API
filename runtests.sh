#!/bin/sh

. ./curltest.sh

show_response = 1
show_request = 1

PORT=8086
URL="http://localhost:${PORT}"

BUSINESS_PATHS=""

status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}

# /businesses POST endpoint basic tests for required keys

# status 'POST /businesses with all valid keys should return 201 success
request_json "POST /businesses with all valid keys should return 201 success" POST $URL/businesses '{
		"name": "The foobar", "streetAddress": "123 vanilla dr.", "city": "Denver", "state": "colorado", "zip": "1234567", "phone": "834-234-9090", "category": "bar", "subCategories": ["drink", "food"]
	}' \
	201 '{"links": {"business": "/businesses/.*"}}'
NEW_PATH=$(jq_query '.links.business' | tr -d '""')
BUSINESS_PATHS="$BUSINESS_PATHS $NEW_PATH"

FIRST_PATH=$(echo $BUSINESS_PATHS | awk '{print $1}')
request_json "GET $FIRST_PATH should return 200 success" \
	"GET" \
	"${URL}${FIRST_PATH}" \
        "" \
	200 \
	'{"name": ".*", "streetAddress": ".*", "city": ".*", "state": ".*", "zip": ".*", "phone": ".*", "category": ".*", "subcategories": \[.*\], "website": ".*", "email": ".*", "reviews": \{.*\}, "photos": \{.*\}, "id": ".*"}'

status 'POST /businesses without name key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"streetAddress": "this shouldnt work avenue", "city": "Hanoi", "state": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", "subCategories": ["stuff"]}' \
	http://localhost:8086/businesses

status 'POST /businesses without streetAdress key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "city": "Hanoi", "state": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", "subCategories": ["stuff"]}' \
	http://localhost:8086/businesses

status 'POST /businesses without city key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "state": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", "subCategories": ["stuff"]}' \
	http://localhost:8086/businesses

status 'POST /businesses without state key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", "subCategories": ["stuff"]}' \
	http://localhost:8086/businesses

status 'POST /businesses without zip key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "state": "123456", "phone": "345-8763452", "category": "someplace", "subCategories": ["stuff"]}' \
	http://localhost:8086/businesses

status 'POST /businesses without phone key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "state": "345-8763452", "category": "someplace", "subCategories": ["stuff"]}' \
	http://localhost:8086/businesses

status 'POST /businesses without category key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "phone": "345-8763452", "phone": "someplace", "subCategories": ["stuff"]}' \
	http://localhost:8086/businesses

status 'POST /businesses without subCategories key should return 400 failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", "state": ["stuff"]}' \
	http://localhost:8086/businesses

# /businesses POST endpoint empty values 

status 'POST /businesses with empty valid keys should return failure'
curl -X POST -H 'Content-Type: application/json' \
	-d '{"name": "",  "streetAddress": "123 vanilla dr.", "city": "Denver", "state": "colorado", "zip": "1234567", "phone": "834-234-9090", "category": "bar", "subCategories": ["drink", "food"]}' \
	http://localhost:8086/businesses

# /businesses/id/reviews POST endpoint basic tests for required keys






























