import { APIGatewayProxyEvent } from 'aws-lambda';
import { IStorage } from './lib/storage';

export interface ITodo {
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

export interface IEvent {
  /**
   * @description The required event headers
   */
  headers: IHeaders;
  /**
   * @description The body of the event
   */
  body: ITodo;
}

export interface IDynamoTodo extends ITodo {
  id: string;
}

export interface IStorageAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}
