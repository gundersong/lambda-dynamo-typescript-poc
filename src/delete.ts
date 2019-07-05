import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { httpErrorHandler } from 'middy/middlewares';
import 'source-map-support/register';
import { storageMiddleware } from './lib/storageMiddleware';

import { IStorage } from './lib/storage';

interface IDeleteEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}

const deleteHandler = middy(
  async (event: IDeleteEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    await event.storage.delete(id);

    return {
      body: '',
      statusCode: 203,
    };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler());

export const handler = deleteHandler;
