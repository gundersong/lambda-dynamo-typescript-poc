import middy from 'middy';
import { IStorage, storage } from './storage';

export const storageMiddleware: middy.Middleware<IStorage> = () => {
  return {
    before: (handler, next) => {
      handler.event.storage = storage;
      next();
    },
  };
};
