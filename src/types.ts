import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

declare type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

export interface IStoredItem extends IBody, DocumentClient.AttributeMap {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContext extends Context {
  tableName: string;
}

/**
 * @additionalProperties false
 */
export interface IBody {
  /**
   * @description A boolean indicating whether the Todo has been completed or not
   */
  complete: boolean;
  /**
   * @description The description of the Todo entry
   */
  description: string;
}

export type IPostEvent = Modify<
  APIGatewayProxyEvent,
  {
    body: IBody;
  }
>;

export type IPutEvent = Modify<
  APIGatewayProxyEvent,
  {
    body: IBody;
  }
>;

export interface IHeaders {
  /**
   * @description Ensure the content-type is application/json
   */
  'Content-Type': 'application/json';
}

/**
 * PUT
 * @description Schema for POST request event
 */
export interface IPostRequestSchema {
  /**
   * @description The required event headers
   */
  headers: IHeaders;
  /**
   * @description The body of the event
   */
  body: IBody;
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
  body: IBody;
}
