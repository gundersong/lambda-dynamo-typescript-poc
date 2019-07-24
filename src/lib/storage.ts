import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import httpErrors from 'http-errors';

interface IDynamoItem {
  id: string;
  [key: string]: any;
}

export interface IDynamoStorage {
  get: <T>(id: string) => Promise<T>;
  put: (item: IDynamoItem) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

export class DynamoStorage implements IDynamoStorage {
  private tableName: string;
  private ddb: DocumentClient;

  constructor(ddb: DocumentClient) {
    this.tableName = process.env.TABLE_NAME;
    this.ddb = ddb;
  }

  public async get(id: string): Promise<any> {
    const { Item } = await this.ddb.get({ Key: { id }, TableName: this.tableName })
      .promise().catch((err) => {
        throw new httpErrors.InternalServerError(err.message);
      });
    return Item;
  }

  public async put(item: IDynamoItem) {
    return this.ddb.put({ Item: item, TableName: this.tableName })
      .promise().catch((err) => {
        throw new httpErrors.InternalServerError(err.message);
      });
  }

  public async delete(id: string) {
    return this.ddb.delete({ Key: { id }, TableName: this.tableName })
      .promise().catch((err) => {
        throw new httpErrors.InternalServerError(err.message);
      });
  }
}
