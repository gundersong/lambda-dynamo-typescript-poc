import { APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import { IDynamoTodo, IStorageAPIGatewayProxyEvent } from './types';

const getHandler = httpHandler(
  async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    const data: IDynamoTodo = await event.storage.get(id);

    if (!data) { throw new httpErrors.NotFound(); }

    return {
      body: JSON.stringify({ data }, null, 2),
      statusCode: 200,
    };
  });

export const handler = getHandler;
