import { Response, Request } from 'express';
import { inject } from 'inversify';
import bcrypt from 'bcrypt';
import {
  controller,
  httpPost,
  request,
  response,
  requestBody,
  httpGet,
} from 'inversify-express-utils';

import CONSTANTS from '../../common/constants/identifiers';

import validator from '../validators/user';

import UserRepository from '../../data/respositories/user/user';

import BaseController from './base';

import { signToken, decodeToken } from '../helpers/auth';

@controller('/user')
export class UserController extends BaseController {
  protected _user: UserRepository;
  constructor(@inject(CONSTANTS.USER_REPOSITORY) _user: UserRepository) {
    super();
    this._user = _user;
  }

  @httpPost('/signup')
  async signUp(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: any
  ) {
    const { err, result } = validator.signUp(body);

    if (err) return this.handleValidationError(err, req, res);

    try {
      const user = await this._user.create(result);
      const token = signToken(user.toJSON());

      return this.handleSuccess(token, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }

  @httpPost('/login')
  async login(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: any
  ) {
    const { err, result } = validator.login(body);

    if (err) return this.handleValidationError(err, req, res);

    try {
      const user = await this._user.byQuery({
        conditions: { username: result.username },
      });
      const isPasswordValid = await bcrypt.compare(
        result.password,
        user.password
      );

      if (!isPasswordValid) throw new Error('Invalid username or password');

      const token = signToken(user.toJSON());

      return this.handleSuccess(token, req, res);
    } catch (e) {
      return this.handleError(e, req, res);
    }
  }

  @httpGet('/')
  async getUser(@request() req: Request, @response() res: Response) {
    try {
      if (!req.headers.authorization)
        throw new Error('Missing token in Authorization header');
      const authHeader = req.headers.authorization.split(' ');
      const token = authHeader[1];
      const user = await decodeToken(token);

      if (user) {
        delete user.iat;
        delete user.exp;
      }

      return this.handleSuccess(user, req, res);
    } catch (e) {
      return this.handleError(e, req, res);
    }
  }
}
