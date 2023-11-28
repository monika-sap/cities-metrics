# Cities metrics

A coding challenge solution

## Server Setup

- server/index.js: Initializes an Express server and defines the `/api/cities` endpoint.

### Endpoints

- GET `/api/cities`: Returns a list of cities. The data is read from cities.json file located in the project root.

#### Parameters

- `fileType: json | csv`, defaults to 'json', if not any of those it will return 415: Unsupported media type, alternatively if headers are passed the server will infer from the `Content-Type` header
- `fileName: string`, defaults to 'cities'

### Error Handling

- Global error handling middleware is used to catch and respond to any server errors.
