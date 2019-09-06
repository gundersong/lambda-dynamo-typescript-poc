import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import { logger } from './lib/logger';

const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(event.path);

  return {
    body: JSON.stringify({ data: [] }, null, 2),
    statusCode: 200,
  };
};

export const handler = httpHandler(list);
