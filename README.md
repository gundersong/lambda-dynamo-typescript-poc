<div align="center">
  <p><strong>A Proof of concept REST api build on Lambda, DynamoDB and Serverless Framework</strong></p>
</div>

## Details

This project was created as a boilerplate as a simple example of an AWS Lambda and DynamoDB based CRUD service written in typescript and using some of the best practices.

It was designed as a template to easily use as a boilerplate to copy and create multiple fast, scalable and modular crud services for any entities.

To create a new CRUD service for a new entity, only as few things need to change:

- Update the entity name within the [serverless.yml](serverless.yml) `custom.apiEntity`
  - This variable is propagated through the app as well as the AWS resource names
  - All necessary resource names, such as the dynamo table name and SNS topic name are passed into the Lambda as environment variables
- Update the IBody type within the [types](src/types.ts) file
  - This type is used to generate the schema for the PUT request using the [buildShema.sh](scripts/buildSchema.sh) script, this script is ran along with the [checkShema.sh](scripts/checkShema.sh) script before each commit to ensure the type and the schema are always in-sync. The [buildShema.sh](scripts/buildSchema.sh) will output the schema to a [json file](src/schema/putEvent.schema.json) which is used to validate the request body on every put request.

### Handler

A generic [httpHandler](src/lib/httpHandler.ts) was created which is used for each endpoint to share the functionality of:

- Event logging
- Adding appropriate custom middleware (storage and messaging classes)
- HTTP Error handling
- Cors headers
- Header normalisaion

This handler was created with a small library called [middy](https://www.npmjs.com/package/middy), which allows the handlers to share the functionality they need so that the actual crud functions only need to handle the small amount of business logic they need to.

### EventBridge

The service also deploys an EventBus and sends notifications about created/updated and deleted todos to the EventBus.

The ARN for the Event Bus is added to AWS Systems Managers Parameter Store so other repositories can use the ARN for use in pattern matching and triggering other services, e.g.

```yaml
functions:
  todoCreated:
    handler: src/functions/todoCreated/index.default
    name: ${self:service}-todo-created-${self:provider.stage}
    memorySize: 256
    timeout: 15
    events:
      - eventBridge:
          eventBus: arn:aws:events:#{AWS::Region}:#{AWS::AccountId}:event-bus/todos-dev-v1
          pattern:
            detail:
              metadata:
                entity:
                  - todos
                type:
                  - created
```

---

### Usage

Use the in-built serverless commands to deploy and remove the service, e.g.

#### Install Dependencies

```bash
yarn
```

or

```bash
npm install
```

#### Deploy

```bash
yarn sls deploy --stage dev -v
```

#### Remove

```bash
yarn sls remove --stage dev -v
```

---

## Local Testing

Before you can test locally, the service must first be deployed to AWS.

```bash
yarn sls deploy --stage dev -v
```

Once it has been successfully deployed, the serverless offline plugin can be used to test locally:

```bash
yarn sls offline --stage dev --port 3000
```

You can then hit the endpoint with curl or the http client of your choice e.g.

### POST

```bash
curl -X POST http://localhost:3000/v1/todos \
-H 'Content-Type: application/json' \
-d '{"description": "Find a date", "complete": false}'
```

### PUT

```bash
curl -X PUT http://localhost:3000/v1/todos/1 \
-H 'Content-Type: application/json' \
-d '{"description": "Find a date", "complete": true}'
```

### GET

```bash
curl -G http://localhost:3000/v1/todos/1
```

### LIST

Maximum Limit: 10  
The `from` query parameter indicates the next key to start the listing from, this can be taken from `meta.next` in the list response

```bash
curl -G http://localhost:3000/v1/todos?from={NEXT_KEY}&limit=5
```

### DELETE

```bash
curl -X DELETE http://localhost:3000/v1/todos/1
```
