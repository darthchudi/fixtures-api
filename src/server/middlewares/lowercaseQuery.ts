import { Request, Response, NextFunction } from 'express';

/**
 * Converts all Get query strings to lowercase
 */
export const LowercaseQueryStrings = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method !== 'GET') return next();

  for (var key in req.query) {
    req.query[key] = req.query[key].toLowerCase();
  }
  next();
};
