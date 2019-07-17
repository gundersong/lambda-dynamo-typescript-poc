/* tslint:disable no-console  */
interface IInfoLog {
  message: string;
  details?: any;
}

export interface ILogger {
  info: (info: IInfoLog) => void;
  error: (error: Error) => void;
}

export const logger: ILogger = {
  error: (error) => {
    const logError = {
      message: error.message,
      timestamp: + new Date(),
    };
    console.log(JSON.stringify(logError, null, 2));
  },
  info: (info) => {
    const logInfo = {
      ...info,
      timestamp: + new Date(),
    };
    console.log(JSON.stringify(logInfo, null, 2));
  },
};
