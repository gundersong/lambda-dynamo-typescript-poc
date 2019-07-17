import { APIGatewayProxyResult } from 'aws-lambda';
import { validator } from 'middy/middlewares';
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

    logger.info({ message: 'Putting item to storage', details: item });

    await event.storage.put(item);

    return { body: '', statusCode: 201 };
  })
  .use(validator({ inputSchema: schema }));

export const handler = putHandler;
