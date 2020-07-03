import { handler } from '../src/delete';
import { dynamo, eventbridge } from '../src/lib';

jest.mock('../src/lib');

const deletePromise = jest.fn();

const event = {
  pathParameters: {
    id: 'path-id',
  },
};

const context = {
  tableName: 'table-name',
};

describe('delete', () => {
  beforeAll(() => {
    deletePromise.mockResolvedValue({});
    dynamo.delete.mockReturnValue({ promise: deletePromise });
    eventbridge.sendEvent.mockResolvedValue();
  });

  it('calls dynamo.delete with the key and table name', async () => {
    await handler(event, context);

    expect(dynamo.delete).toHaveBeenCalledTimes(1);
    expect(dynamo.delete).toHaveBeenCalledWith({
      Key: { id: 'path-id' },
      TableName: 'table-name',
    });
  });
});
