import { APIGatewayProxyResult } from 'aws-lambda';
import { validator } from 'middy/middlewares';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import schema from './schema/event.schema.json';
import { IStorageAPIGatewayProxyEvent, ITodo } from './types';

type IPostEvent = Modify<IStorageAPIGatewayProxyEvent, {
  body: ITodo;
}>;

const postHandler = httpHandler(
  async (event: IPostEvent): Promise<APIGatewayProxyResult> => {
    const {
      body: { complete, description },
      pathParameters: { id },
    } = event;

    await event.storage.put({ id, complete, description });

    return { body: '', statusCode: 201 };
  })
  .use(validator({ inputSchema: schema }));

export const handler = postHandler;
