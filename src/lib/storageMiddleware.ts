import DynamoDB from 'aws-sdk/clients/dynamodb';
import https from 'https';
import middy from 'middy';

import { DynamoStorage, IDynamoStorage } from './storage';

type DynamoDocumentClientParams = DynamoDB.DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration;

let documentClientParams: DynamoDocumentClientParams = {
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
      rejectUnauthorized: true,
    }),
  },
  region: process.env.AWS_REGION,
};

if (process.env.IS_OFFLINE) {
  const offlinePort = process.env.DYNAMO_OFFLINE_PORT;
  documentClientParams = {
    endpoint: `http://localhost:${offlinePort}`,
    region: 'localhost',
  };

}

const documentClient = new DynamoDB.DocumentClient(documentClientParams);

const storage = new DynamoStorage(documentClient);

export const storageMiddleware: middy.Middleware<IDynamoStorage> = () => ({
  before: (handler, next) => {
    handler.event.storage = storage;
    next();
  },
});
