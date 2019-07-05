import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { httpErrorHandler } from 'middy/middlewares';
import 'source-map-support/register';
import { storageMiddleware } from './lib/storageMiddleware';

import { IStorage } from './lib/storage';

interface IGetEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}

const getHandler = middy(
  async (event: IGetEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    const data = await event.storage.get(id);

    if (!data) {
      return { body: '', statusCode: 404 };
    }

    return {
      body: JSON.stringify({ data }, null, 2),
      statusCode: 200,
    };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler());

export const handler = getHandler;
