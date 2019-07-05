import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import createError from 'http-errors';
import middy from 'middy';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { storageMiddleware } from './lib/storageMiddleware';
import { IStorage } from './storage';
import { IDynamoTodo } from './types';

interface IGetEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}

const getHandler = middy(
  async (event: IGetEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    const data: IDynamoTodo = await event.storage.get(id);

    if (!data) { throw new createError.NotFound(); }

    return {
      body: JSON.stringify({ data }, null, 2),
      statusCode: 200,
    };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler());

export const handler = getHandler;
