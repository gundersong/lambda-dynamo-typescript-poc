import DynamoDB from 'aws-sdk/clients/dynamodb';

export const dynamo = new DynamoDB.DocumentClient();
