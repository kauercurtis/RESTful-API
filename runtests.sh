#!/bin/sh

status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}

# This is where I'm testing the businesses POST endpoint

status 'POST business should return success'
curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "The foobar", "streetAddress": "123 vanilla dr.", "city": "Denver", "state": "colorado", "zip": "1234567", "phone": "834-234-9090", "category": "bar",\
	 "subCategories": ["drink", "food"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"streetAddress": "this shouldnt work avenue", "city": "Hanoi", "state": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", \
	"subCategories": ["stuff"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "city": "Hanoi", "state": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", \
	"subCategories": ["stuff"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "state": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", \
	"subCategories": ["stuff"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", \
	"subCategories": ["stuff"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "state": "123456", "phone": "345-8763452", "category": "someplace", \
	"subCategories": ["stuff"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "state": "345-8763452", "category": "someplace", \
	"subCategories": ["stuff"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "phone": "345-8763452", "phone": "someplace", \
	"subCategories": ["stuff"]}' http://localhost:8086/businesses

status 'POST business should return 400 failure'curl -X POST -h 'Content-Type: application/json' \
	-d '{"name": "this shouldnt work avenue", "streetAddress": "Hanoi", "city": "Idaho", "zip": "123456", "phone": "345-8763452", "category": "someplace", \
	"state": ["stuff"]}' http://localhost:8086/businesses
































