import httpErrors from 'http-errors';
import 'source-map-support/register';
import { dynamo, eventbridge, httpHandler, logger } from './lib';
export const handler = async (event, context) => {
    const { pathParameters: { id }, } = event;
    const { tableName } = context;
    logger.info(`Deleting item from storage with id '${id}' from table '${tableName}'`);
    await dynamo
        .delete({ Key: { id }, TableName: tableName })
        .promise()
        .catch(error => {
        logger.error(error);
        throw new httpErrors.InternalServerError();
    });
    logger.info(`Publishing delete message`, { id });
    await eventbridge
        .sendEvent({ data: { id }, type: 'deleted' })
        .catch(error => {
        // event should not throw error
        logger.info(`Error sending delete message to eventBus`);
        logger.error(error);
    });
    return { body: '', statusCode: 204 };
};
export default httpHandler(handler);
//# sourceMappingURL=delete.js.map