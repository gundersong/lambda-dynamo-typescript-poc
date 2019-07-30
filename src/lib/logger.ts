import { LambdaLog } from 'lambda-log';

const keyMap: Array<[string, string]> = [
  ['msg', 'message'],
  ['_logLevel', 'log_level'],
];

const renameProp = (
  oldKey: string,
  newKey: string,
  { [oldKey]: old, ...others },
) => ({ [newKey]: old, ...others });

export const logger = new LambdaLog({
  replacer: (key, value) => {
    if (key === '') {
      // Replace log object keys
      return keyMap.reduce((acc, [oldKey, newKey]) => renameProp(oldKey, newKey, acc), value);
    }
    return value;
  },
  tags: [`${process.env.API_ENTITY}_service`],
});
