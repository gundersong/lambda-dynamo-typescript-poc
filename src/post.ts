import { APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import { jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';
import uuid from 'uuid/v4';

import { dynamo, httpHandler, logger, sns } from './lib';
import schema from './schema/postEvent.schema.json';
import { IPostEvent, IStoredItem } from './types';

const {
  TABLE_NAME: tableName,
  POST_TOPIC_ARN: postTopicArn,
} = process.env;

const post = async (event: IPostEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event;

  const item: IStoredItem = { id: uuid(), ...body };

  logger.info(`Putting item to table '${tableName}'`, { item });

  await dynamo.put({ Item: item, TableName: tableName })
    .promise()
    .catch((error) => {
      throw new httpErrors.InternalServerError(error.message);
    });

  logger.info(`Publishing put message to topic '${postTopicArn}'`, { message: { item } });

  await sns.publish(postTopicArn, item)
    .catch((error) =>
      logger.error(`Error publishing message to topic '${postTopicArn}'`, error),
    );

  return { body: JSON.stringify(item), statusCode: 201 };
};

export const handler = httpHandler(post)
  .use(jsonBodyParser())
  .use(validator({ inputSchema: schema }));
