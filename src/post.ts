import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { IStorage } from './lib/storage';
import { storageMiddleware } from './lib/storageMiddleware';
import { inputSchema } from './schema';

interface IPostEvent extends APIGatewayProxyEvent {
  body: any;
  storage: IStorage;
}

const postHandler = middy(
  async (event: IPostEvent): Promise<APIGatewayProxyResult> => {
    const { body, pathParameters: { id } } = event;

    await event.storage.put({ ...body, id });

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
