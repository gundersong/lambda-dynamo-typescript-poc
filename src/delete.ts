import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { storageMiddleware } from './lib/storageMiddleware';
import { IStorage } from './storage';

interface IDeleteEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}

const deleteHandler = middy(
  async (event: IDeleteEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    await event.storage.delete(id);

    return { body: '', statusCode: 203 };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler());

export const handler = deleteHandler;
