import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import 'source-map-support/register';

import { dynamo, httpHandler, logger, sns } from './lib';

const {
  TABLE_NAME: tableName,
  DELETE_TOPIC_ARN: deleteTopicArn,
} = process.env;

const deleteItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { pathParameters: { id } } = event;

  logger.info(`Deleting item from storage with id '${id}' from table '${tableName}'`);

  await dynamo.delete({ Key: { id }, TableName: tableName })
    .promise()
    .catch((error) => {
      throw new httpErrors.InternalServerError(error.message);
    });

  logger.info(`Publishing delete message to topic '${deleteTopicArn}'`, { id });

  await sns.publish(deleteTopicArn, { id })
    .catch((error) =>
      logger.error(`Error publishing message to topic '${deleteTopicArn}'`, error),
    );

  return { body: '', statusCode: 203 };
};

export const handler = httpHandler(deleteItem);
