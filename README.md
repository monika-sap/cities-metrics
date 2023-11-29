# Cities metrics

A coding challenge solution

## Setup

```
npm run setup // installs necessary packages
```

create an `.env` file in the `server` directory that contains the following data:
```
PORT=8000 // or whichever port you see fit
```
and an `.env` file in the `client` directory that contains the following data:
```
REACT_APP_API_URL=http://192.168.1.11:8000/api // or the local ip the server is running, if using wsl execute `ip addr` and lookup the eth0 interface's ip
REACT_APP_HIGHLIGHT_THRESHOLD=1000000
```
```
npm run dev // should run bot server and client
```
Enhancement could be some containerization, more and robust tests, and better error handling.

## Server

- server/index.js: Initializes an Express server and defines the `/api/cities` endpoint.

### Endpoints

- GET `/api/cities`: Returns a list of cities. The data is read from cities.json file located in the project root and enriched with a population `density` field. Accepts sort and order query parameters. Valid sort fields are name, population, and area. The order can be ASC or DESC. Accepts nameContains query parameter to filter the city data based on a substring of the city name.
- POST `/api/cities/add`: Accepts JSON payload with name, population, and area fields to add a new city to the data.

#### Parameters

- `fileType: json | csv`, defaults to 'json', if not any of those it will return 415: Unsupported media type, alternatively if headers are passed the server will infer from the `Content-Type` header
- `fileName: string`, defaults to 'cities'

### Error Handling

- Global error handling middleware is used to catch and respond to any server errors.
