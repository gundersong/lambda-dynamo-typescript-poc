import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import { logger } from './lib/logger';
import { IStorageAPIGatewayProxyEvent } from './types';

const deleteItem = async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { pathParameters: { id } } = event;

  logger.info(`Deleting item from storage with id: ${id}`);

  await event.storage.delete(id);

  return { body: '', statusCode: 203 };
};

export const handler = httpHandler(deleteItem);
