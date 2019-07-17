import { APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import { logger } from './lib/logger';
import { IDynamoItem, IStorageAPIGatewayProxyEvent } from './types';

const getHandler = httpHandler(
  async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    logger.info({ message: `Getting item from storage with id: ${id}` });

    const data = await event.storage.get<IDynamoItem>(id);

    if (!data) {
      logger.info({ message: 'No item returned from storage, returning 404' });
      throw new httpErrors.NotFound();
    }

    logger.info({ message: `Successfully retrieved item from storage`, details: data });

    return {
      body: JSON.stringify({ data }, null, 2),
      statusCode: 200,
    };
  });

export const handler = getHandler;
