import BaseRepository from './base';
import { injectable } from 'inversify';

import { IUserModel } from '../models/user';
import UserSchema from '../schemas/user';

@injectable()
export default class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super('Users', UserSchema, 'user');
  }
}
