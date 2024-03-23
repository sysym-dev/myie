import { Query, Request as ExpressRequest } from 'express-serve-static-core';

export interface Request<T extends Query> extends ExpressRequest {
  query: T;
}
