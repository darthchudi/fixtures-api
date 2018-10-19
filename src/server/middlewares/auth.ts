import { Request, Response, NextFunction } from 'express';
import HTTPStatus from '../../common/constants/http-status';
import { decodeToken } from '../helpers/auth';

/**
 * Middleware that checks endpoints for Authorization Header
 * and fails if it doesn't exist
 */

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(HTTPStatus.UNAUTHORIZED_ERROR)
      .jSend.error('Missing authorization token in header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const validatedToken = await decodeToken(token);
    req.token = token;

    //End authentication if request is a HTTP Get method
    if (req.method === 'GET') return next();

    if (validatedToken.role !== 'admin') throw new Error('Unauthorized user');
    next();
  } catch (e) {
    res.status(HTTPStatus.UNAUTHORIZED_ERROR).jSend.error(e.message);
  }
};
