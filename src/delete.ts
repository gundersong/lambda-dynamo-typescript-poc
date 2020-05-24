import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import 'source-map-support/register';

import { dynamo, eventbridge, httpHandler, logger } from './lib';
import { IContext } from './types';

const deleteItem = async (
  event: APIGatewayProxyEvent,
  context: IContext
): Promise<APIGatewayProxyResult> => {
  const {
    pathParameters: { id },
  } = event;

  const { tableName } = context;

  logger.info(
    `Deleting item from storage with id '${id}' from table '${tableName}'`
  );

  await dynamo
    .delete({ Key: { id }, TableName: tableName })
    .promise()
    .catch(error => {
      logger.error(error);
      throw new httpErrors.InternalServerError();
    });

  logger.info(`Publishing delete message`, { id });

  await eventbridge
    .sendEvent({ type: 'deleted', data: { id } })
    .catch(error => {
      // event should not throw error
      logger.info(`Error sending delete message to eventBus`);
      logger.error(error);
    });

  return { body: '', statusCode: 204 };
};

export const handler = httpHandler(deleteItem);
