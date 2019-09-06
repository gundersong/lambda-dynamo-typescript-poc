import DynamoDB from 'aws-sdk/clients/dynamodb';
import https from 'https';

type DynamoDocumentClientParams = DynamoDB.DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration;

const {
  AWS_REGION,
  IS_OFFLINE,
  DYNAMO_OFFLINE_PORT,
} = process.env;

let documentClientParams: DynamoDocumentClientParams = {
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
      rejectUnauthorized: true,
    }),
  },
  region: AWS_REGION,
};

if (IS_OFFLINE) {
  documentClientParams = {
    endpoint: `http://localhost:${DYNAMO_OFFLINE_PORT}`,
    region: 'localhost',
  };
}

export const dynamo = new DynamoDB.DocumentClient(documentClientParams);
