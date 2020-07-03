import httpErrors from 'http-errors';
import { DateTime } from 'luxon';
import { jsonBodyParser, validator } from 'middy/middlewares';
import 'source-map-support/register';
import { dynamo, eventbridge, httpHandler, logger } from './lib';
import schema from './schema/putEvent.schema.json';
const put = async (event, context) => {
    const { body, pathParameters } = event;
    const { tableName } = context;
    const { id } = pathParameters;
    logger.info(`Getting item from table '${tableName}' with id '${id}'`);
    const { Item: existingItem } = await dynamo
        .get({ Key: { id }, TableName: tableName })
        .promise()
        .catch(error => {
        logger.error(error);
        throw new httpErrors.InternalServerError(error.message);
    });
    if (!existingItem) {
        logger.info(`No item returned from table '${tableName}'; returning 404`);
        throw new httpErrors.NotFound();
    }
    const updatedAt = DateTime.utc().toISO();
    const { createdAt } = existingItem;
    const updatedItem = Object.assign({ createdAt,
        id,
        updatedAt }, body);
    logger.info(`Putting item to table '${tableName}'`, updatedItem);
    await dynamo
        .put({ Item: updatedItem, TableName: tableName })
        .promise()
        .catch(error => {
        logger.error(error);
        throw new httpErrors.InternalServerError();
    });
    logger.info(`Publishing updated message`, {
        message: updatedItem,
    });
    await eventbridge
        .sendEvent({ type: 'updated', data: { id } })
        .catch(error => {
        // event should not throw error
        logger.info(`Error sending updated message to eventBus`);
        logger.error(error);
    });
    return { body: JSON.stringify(updatedItem), statusCode: 200 };
};
export const handler = httpHandler(put)
    .use(jsonBodyParser())
    .use(validator({ inputSchema: schema }));
//# sourceMappingURL=put.js.map