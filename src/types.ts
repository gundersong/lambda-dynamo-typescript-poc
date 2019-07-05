import { APIGatewayProxyEvent } from 'aws-lambda';
import { IStorage } from './storage';

export interface ITodo {
  complete: boolean;
  description: string;
}

export interface IDynamoTodo extends ITodo {
  id: string;
}

export interface IStorageAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  storage: IStorage;
}
