import type { ErrorRequestHandler, RequestHandler } from 'express';

type HttpError = Error & {
  status?: number;
  statusCode?: number;
};

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Route not implemented' });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const err = error as HttpError;
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status).json({ message });
};

export default errorHandler;
