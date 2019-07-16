import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { httpHandler } from './lib/httpHandler';
import { IStorageAPIGatewayProxyEvent } from './types';

const deleteHandler = httpHandler(
  async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    await event.storage.delete(id);

    return { body: '', statusCode: 203 };
  });

export const handler = deleteHandler;
