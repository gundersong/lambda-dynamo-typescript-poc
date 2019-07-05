export interface ITodo {
  complete: boolean;
  description: string;
}

export interface IDynamoTodo extends ITodo {
  id: string;
}
