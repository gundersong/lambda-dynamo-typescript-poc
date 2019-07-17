import { APIGatewayProxyEvent } from 'aws-lambda';
import { IStorage } from './lib/storage';

export interface IStorageAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}

export interface IPutBody {
  /**
   * @description A boolean indicating whether the Todo has been completed or not
   */
  complete: boolean;
  /**
   * @description The description of the Todo entry
   */
  description: string;
}

export interface IHeaders {
  /**
   * @description Ensure the content-type is application/json
   */
  'Content-Type': 'application/json';
}

export type IPutEvent = Modify<IStorageAPIGatewayProxyEvent, {
  body: IPutBody;
}>;

export interface IDynamoItem extends IPutBody {
  id: string;
}

/**
 * PUT
 * @description Schema for PUT request event
 */
export interface IPutRequestSchema {
  /**
   * @description The required event headers
   */
  headers: IHeaders;
  /**
   * @description The body of the event
   */
  body: IPutBody;
}
