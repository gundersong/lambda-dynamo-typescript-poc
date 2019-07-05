import { APIGatewayProxyEvent } from 'aws-lambda';
import { IStorage } from './storage';

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

export interface IBody {
  /**
   * @description A Todo object describing a task to be done
   */
  body: ITodo;
}

export interface IDynamoTodo extends ITodo {
  id: string;
}

export interface IStorageAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}
