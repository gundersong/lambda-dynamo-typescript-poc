import httpErrors from 'http-errors';
import { v4 as uuid } from 'uuid';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DateTime } from 'luxon';
import { jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';

import { dynamo, eventbridge, httpHandler, logger } from './lib';
import schema from './schema/postEvent.schema.json';
import { IContext, IPostEvent, IStoredItem } from './types';

const post = async (
  event: IPostEvent,
  context: IContext
): Promise<APIGatewayProxyResult> => {
  const { body } = event;
  const { tableName } = context;

  const id = uuid();
  const createdAt = DateTime.utc().toISO();

  const item: IStoredItem = {
    createdAt,
    id,
    updatedAt: createdAt,
    ...body,
  };

  logger.info(`Putting item to table '${tableName}'`, { item });

  await dynamo
    .put({ Item: item, TableName: tableName })
    .promise()
    .catch(error => {
      logger.error(error);
      throw new httpErrors.InternalServerError();
    });

  logger.info('Publishing created message');

  await eventbridge
    .sendEvent({ type: 'created', data: { id } })
    .catch(error => {
      // event should not throw error
      logger.info(`Error sending created message to eventBus`);
      logger.error(error);
    });

  return { body: JSON.stringify(item), statusCode: 201 };
};

export const handler = httpHandler(post)
  .use(jsonBodyParser())
  .use(validator({ inputSchema: schema }));
