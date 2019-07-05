import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import createError from 'http-errors';
import https from 'https';

interface IDynamoItem {
  id: string;
  [key: string]: any;
}

export interface IStorage {
  get: (id: string) => Promise<any>;
  put: (item: IDynamoItem) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

class Storage implements IStorage {
  private ddb: DynamoDB.DocumentClient;

  constructor() {
    this.ddb = new DynamoDB.DocumentClient({
      httpOptions: {
        agent: new https.Agent({
          keepAlive: true,
          rejectUnauthorized: true,
        }),
      },
      region: process.env.sAWS_REGION,
    });
  }

  public async get(id: string): Promise<any> {
    const item = await this.ddb.get({
      Key: { id },
      TableName: process.env.TABLE_NAME,
    })
      .promise()
      .catch((err) => {
        throw new createError.InternalServerError(err.message);
      });

    return item.Item;
  }

  public async put(item: IDynamoItem) {
    return this.ddb.put({
      Item: item,
      TableName: process.env.TABLE_NAME,
    })
      .promise()
      .catch((err) => {
        throw new createError.InternalServerError(err.message);
      });
  }

  public async delete(id: string) {
    return this.ddb.delete({
      Key: { id },
      TableName: process.env.TABLE_NAME,
    })
      .promise()
      .catch((err) => {
        throw new createError.InternalServerError(err.message);
      });
  }
}

export const storage = new Storage();
