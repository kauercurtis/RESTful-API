# RESTful-API
Restful API for CS493 Cloud Development.

## To Run

`docker build -t api-server .` - build docker container

`sudo docker run -p 8086:8086 api-server` - to start the server

## Data Structures

`businesses` - map that holds pages with businesses and related data
`lookupTable`- map that holds business ids with their page number
