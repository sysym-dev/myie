import { Request } from 'express-serve-static-core';

export type RequestQuery<T> = Request<{}, {}, {}, T>;
