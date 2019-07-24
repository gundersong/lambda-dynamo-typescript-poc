<div align="center">
  <p><strong>A Proof of concept REST api build on Lambda, DynamoDB and Serverless Framework</strong></p>
</div>

## Local Testing
Requires: Docker version 18.09.2 or greater

  ```bash
  docker-compose up -d
  ```

If you need to specify a different port for the API endpoint or the DynamoDB server you can set them in environment variables e.g.

  ```bash
  API_PORT=4567 DYNAMO_PORT=9000 docker-compose up -d
  ```

The defaults for these can be found in the [.env](.env) file

You can then hit the endpoint with curl or the http client of your choice e.g.

### PUT
  ```bash
  curl -X PUT http://localhost:4567/todos/1 \
  -H 'Content-Type: application/json' \
  -d '{"description": "Get stuff done", "complete": true}'
  ```

### GET
  ```bash
  curl -G http://localhost:4567/todos/1
  ```
### DELETE
  ```bash
  curl -X DELETE http://localhost:4567/todos/1
  ```
