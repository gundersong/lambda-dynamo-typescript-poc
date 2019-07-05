import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { storageMiddleware } from './lib/storageMiddleware';
import { inputSchema } from './schema';
import { IStorage } from './storage';
import { IDynamoTodo } from './types';

interface IPostEvent extends APIGatewayProxyEvent {
  body: any;
  storage: IStorage;
}

const postHandler = middy(
  async (event: IPostEvent): Promise<APIGatewayProxyResult> => {
    const { body, pathParameters: { id } } = event;

    const data: IDynamoTodo = { ...body, id };

    await event.storage.put(data);

    return {
      body: '',
      statusCode: 201,
    };
  })
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(storageMiddleware())
  .use(httpErrorHandler());

export const handler = postHandler;
