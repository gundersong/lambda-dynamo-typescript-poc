import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import 'source-map-support/register';

import { dynamo, httpHandler, logger } from './lib';

const tableName = process.env.TABLE_NAME;

const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { pathParameters: { id } } = event;

  logger.info(`Getting item from table '${tableName}' with id '${id}'`);

  const { Item: item } = await dynamo.get({ Key: { id }, TableName: tableName })
    .promise()
    .catch((error) => {
      throw new httpErrors.InternalServerError(error.message);
    });

  if (!item) {
    logger.info(`No item returned from table '${tableName}'; returning 404`);
    throw new httpErrors.NotFound();
  }

  logger.info(`Successfully retrieved item from table '${tableName}'`, { item });

  return {
    body: JSON.stringify({ item }, null, 2),
    statusCode: 200,
  };
};

export const handler = httpHandler(get);
