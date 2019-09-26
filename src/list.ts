import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import 'source-map-support/register';

import { dynamo, httpHandler, logger } from './lib';

const { TABLE_NAME: tableName } = process.env;
const PAGE_LIMIT = 10;

const base64StringToObject = (base64String: string) => {
  const decoded = Buffer.from(base64String, 'base64').toString('ascii');
  try {
    return JSON.parse(decoded);
  } catch (e) {
    return undefined;
  }
};

const objectToBase64String = (objectKey: {}) => {
  const keyString = JSON.stringify(objectKey);
  if (!keyString) { return undefined; }
  return Buffer.from(keyString).toString('base64');
};

const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { from = '', limit: limitString } = (event.queryStringParameters || {});

  const limit = parseInt(limitString, 10);
  if (limit > PAGE_LIMIT) {
    throw new httpErrors.BadRequest(`Max page limit '${PAGE_LIMIT}'`);
  }

  const exclusiveStartKey = base64StringToObject(from);

  console.log(tableName);

  const { Items, LastEvaluatedKey } = await dynamo.scan({
    // TODO - replace with batchGet once items are indexed in ElasticSearch
    ExclusiveStartKey: exclusiveStartKey,
    Limit: limit,
    TableName: tableName,
  })
    .promise()
    .catch((error) => {
      logger.error(error);
      throw new httpErrors.InternalServerError();
    });

  const next = objectToBase64String(LastEvaluatedKey);

  return {
    body: JSON.stringify({ data: Items, meta: { next } }),
    statusCode: 200,
  };
};

export const handler = httpHandler(list);
