import { APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import { jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';

import { dynamo, httpHandler, logger, sns } from './lib';
import schema from './schema/putEvent.schema.json';
import { IPutEvent, IStoredItem } from './types';

const {
  TABLE_NAME: tableName,
  PUT_TOPIC_ARN: putTopicArn,
} = process.env;

const put = async (event: IPutEvent): Promise<APIGatewayProxyResult> => {
  const { body, pathParameters } = event;
  const { id } = pathParameters;

  logger.info(`Getting item from table '${tableName}' with id '${id}'`);

  const { Item: existingItem } = await dynamo.get({ Key: { id }, TableName: tableName })
    .promise()
    .catch((error) => {
      throw new httpErrors.InternalServerError(error.message);
    });

  if (!existingItem) {
    logger.info(`No item returned from table '${tableName}'; returning 404`);
    throw new httpErrors.NotFound();
  }

  const updatedItem: IStoredItem = { id, ...body };

  logger.info(`Putting item to table '${tableName}'`, { updatedItem });

  await dynamo.put({ Item: updatedItem, TableName: tableName })
    .promise()
    .catch((error) => {
      throw new httpErrors.InternalServerError(error.message);
    });

  logger.info(`Publishing put message to topic '${putTopicArn}'`, { message: { updatedItem } });

  await sns.publish(putTopicArn, updatedItem)
    .catch((error) =>
      logger.error(`Error publishing message to topic '${putTopicArn}'`, error),
    );

  return { body: JSON.stringify(updatedItem), statusCode: 200 };
};

export const handler = httpHandler(put)
  .use(jsonBodyParser())
  .use(validator({ inputSchema: schema }));
