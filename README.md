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

### SNS
The service also deploys an SNS topic for the POST, PUT and DELETE calls so that other services can listen on these topics and distribute/act on the events if needed, preferably with an SQS queue, conforming to the popular pub/sub architecture.

The ARN's for these SNS topics are added to AWS Systems Managers Parameter Store so other repositories can get and subscribe to these topics, e.g.

```yaml
custom:
  entityDeleteTopicArn: ${ssm:entity-deleted}
  entityPutTopicArn: ${ssm:entity-put}

SQSQueue:
  Type: AWS::SQS::Queue
  Properties:
    MessageRetentionPeriod: 345600
    QueueName: ${self:service.name}-queue
    ReceiveMessageWaitTimeSeconds: 20
    VisibilityTimeout: 120
SQSQueuePolicy:
  Type: AWS::SQS::QueuePolicy
  Properties:
    PolicyDocument:
      Version: '2012-10-17'
      Statement:
        - Effect: Allow
          Principal: '*'
          Action: sqs:SendMessage
          Resource: '*'
          Condition:
            ArnEquals:
              'aws:SourceArn':
                - ${self:custom.entityDeleteTopicArn}
                - ${self:custom.entityPutTopicArn}
    Queues:
      - Ref: SQSQueue
  DependsOn:
    - SQSQueue
PutSnsSubscription:
  Type: AWS::SNS::Subscription
  Properties:
    Endpoint:
      Ref: SQSQueue
    Protocol: sqs
    TopicArn: ${self:custom.entityPutTopicArn}
  DependsOn:
    - SQSQueue
DeleteSnsSubscription:
  Type: AWS::SNS::Subscription
  Properties:
    Endpoint:
      Ref: SQSQueue
    Protocol: sqs
    TopicArn: ${self:custom.entityDeleteTopicArn}
  DependsOn:
    - SQSQueue
```
---

## Local Testing
Requires: 
- Serverless installed globally
- Docker version 18.09.2 or greater
- jq (JSON command line processor)
- AWS CLI

```bash
./scripts/startLocal.sh
```
By default the API will use port 3000 and the Local Dynamo will use port 8000.

If you need to specify a different port for the API endpoint or the DynamoDB server you can set them in environment variables e.g.

```bash
API_PORT=4567 DYNAMO_PORT=9000 ./scripts/startLocal.sh
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

### DYNAMO
The Docker container used for Local testing also comes with a UI to query the table directly, this can be reached at http://localhost:8000/shell/ (the port may be different if you specified one)
