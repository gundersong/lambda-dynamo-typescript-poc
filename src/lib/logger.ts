import { LambdaLog } from 'lambda-log';

export interface ILogger {
  log(level: string, msg: string, meta?: object, tags?: string[]): void;
  info(msg: string, meta?: object, tags?: string[]): void;
  warn(msg: string, meta?: object, tags?: string[]): void;
  error(msg: string | Error, meta?: object, tags?: string[]): void;
  debug(msg: string, meta?: object, tags?: string[]): void;
}

const keyMap: Array<[string, string]> = [
  ['msg', 'message'],
  ['_logLevel', 'log_level'],
];

const renameProp = (
  oldKey: string,
  newKey: string,
  { [oldKey]: old, ...others },
) => ({ [newKey]: old, ...others });

const addTimeStamp = (value) => {
  const timestamp = +Date.now();
  value.timestamp = timestamp;
};

const keyReplacer = (key, value) => {
  if (key === '') {
    // Replace log object keys
    addTimeStamp(value);
    return keyMap.reduce((acc, [oldKey, newKey]) => renameProp(oldKey, newKey, acc), value);
  }
  return value;
};

export const logger: ILogger = new LambdaLog({
  replacer: keyReplacer,
  tags: [`${process.env.API_ENTITY}_service`],
});
