import BaseRepository from './base';

import { IUserModel } from '../models/user';
import UserSchema from '../schemas/user';

export default class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super('Users', UserSchema, 'user');
  }
}
