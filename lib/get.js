import httpErrors from 'http-errors';
import 'source-map-support/register';
import { dynamo, httpHandler, logger } from './lib';
const get = async (event, context) => {
    const { id } = event.pathParameters;
    const { tableName } = context;
    logger.info(`Getting item from table '${tableName}' with id '${id}'`);
    const { Item: item } = await dynamo
        .get({ Key: { id }, TableName: tableName })
        .promise()
        .catch(error => {
        logger.error(error);
        throw new httpErrors.InternalServerError();
    });
    if (!item) {
        logger.info(`No item returned from table '${tableName}'; returning 404`);
        throw new httpErrors.NotFound();
    }
    logger.info(`Successfully retrieved item from table '${tableName}'`, {
        item,
    });
    return {
        body: JSON.stringify({ item }),
        statusCode: 200,
    };
};
export const handler = httpHandler(get);
//# sourceMappingURL=get.js.map