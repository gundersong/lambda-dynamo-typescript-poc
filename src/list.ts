import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { IStorage } from './lib/storage';
import { storageMiddleware } from './lib/storageMiddleware';

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
