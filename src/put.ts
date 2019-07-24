import { APIGatewayProxyResult } from 'aws-lambda';
import { jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import { logger } from './lib/logger';
import schema from './schema/putEvent.schema.json';
import { IDynamoItem, IPutEvent } from './types';

const putHandler = httpHandler(
  async (event: IPutEvent): Promise<APIGatewayProxyResult> => {
    const {
      body: { complete, description },
      pathParameters: { id },
    } = event;

    const item: IDynamoItem = {
      complete,
      description,
      id,
    };

    logger.info('Putting item to storage', { item });

    await event.storage.put(item);

    return { body: '', statusCode: 201 };
  })
  .use(jsonBodyParser())
  .use(validator({ inputSchema: schema }));

export const handler = putHandler;
