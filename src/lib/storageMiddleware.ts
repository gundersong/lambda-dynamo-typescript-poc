import middy from 'middy';
import { IStorage, Storage } from './storage';

const storage = new Storage();

export const storageMiddleware: middy.Middleware<IStorage> = () => ({
  before: (handler, next) => {
    handler.event.storage = storage;
    next();
  },
});
