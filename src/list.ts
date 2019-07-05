import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { httpErrorHandler } from 'middy/middlewares';
import 'source-map-support/register';
import { storageMiddleware } from './lib/storageMiddleware';

import { IStorage } from './lib/storage';

interface IListEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}

const listHandler = middy(
  async (event: IListEvent): Promise<APIGatewayProxyResult> => {
    console.log(event.path);

    return {
      body: JSON.stringify({ data: [] }, null, 2),
      statusCode: 200,
    };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler());

export const handler = listHandler;
