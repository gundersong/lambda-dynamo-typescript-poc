import { APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { cors, jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';

import schema from './event.schema.json';
import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { storageMiddleware } from './lib/storageMiddleware';
import { IStorageAPIGatewayProxyEvent, ITodo } from './types';

type IPostEvent = Modify<IStorageAPIGatewayProxyEvent, {
  body: ITodo;
}>;

const postHandler = middy(
  async (event: IPostEvent): Promise<APIGatewayProxyResult> => {
    const {
      body: { complete, description },
      pathParameters: { id },
    } = event;

    await event.storage.put({ id, complete, description });

    return { body: '', statusCode: 201 };
  })
  .use(jsonBodyParser())
  .use(validator({ inputSchema: schema }))
  .use(storageMiddleware())
  .use(httpErrorHandler())
  .use(cors());

export const handler = postHandler;
