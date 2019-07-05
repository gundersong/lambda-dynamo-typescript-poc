import * as DynamoDB from 'aws-sdk/clients/dynamodb';

interface IDynamoItem {
  id: string;
  [key: string]: any;
}

export interface IStorage {
  get: <T>(id: string) => Promise<T | null>;
  put: (item: IDynamoItem) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

class Storage implements IStorage {
  private ddb: DynamoDB.DocumentClient;

  constructor() {
    console.log('in storage constructor');
    this.ddb = new DynamoDB.DocumentClient({
      region: process.env.AWS_REGION,
    });
  }

  public async get<T>(id: string): Promise<T | null> {
    const item = await this.ddb.get({
      Key: { id },
      TableName: process.env.TABLE_NAME,
    })
      .promise()
      .catch(() => null);

    return item ? item.Item : null;
  }

  public async put(item: IDynamoItem) {
    return this.ddb.put({
      Item: item,
      TableName: process.env.TABLE_NAME,
    })
      .promise()
      .catch(() => null);
  }

  public async delete(id: string) {
    return this.ddb.delete({
      Key: { id },
      TableName: process.env.TABLE_NAME,
    })
      .promise()
      .catch(() => null);
  }
}

export const storage = new Storage();
