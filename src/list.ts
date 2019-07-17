import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import { logger } from './lib/logger';
import { IStorageAPIGatewayProxyEvent } from './types';

const listHandler = httpHandler(
  async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info({ message: 'Path', details: event.path });

    return {
      body: JSON.stringify({ data: [] }, null, 2),
      statusCode: 200,
    };
  });

export const handler = listHandler;
