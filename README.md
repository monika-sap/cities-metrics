# Cities metrics

A coding challenge solution

## Server

- server/index.js: Initializes an Express server and defines the `/api/cities` endpoint.

### Endpoints

- GET `/api/cities`: Returns a list of cities. The data is read from cities.json file located in the project root and enriched with a population `density` field. Accepts sort and order query parameters. Valid sort fields are name, population, and area. The order can be ASC or DESC.

#### Parameters

- `fileType: json | csv`, defaults to 'json', if not any of those it will return 415: Unsupported media type, alternatively if headers are passed the server will infer from the `Content-Type` header
- `fileName: string`, defaults to 'cities'

### Error Handling

- Global error handling middleware is used to catch and respond to any server errors.
