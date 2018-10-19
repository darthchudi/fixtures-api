import BaseRepository from './base';
import { injectable } from 'inversify';

import { IUserModel } from '../models/user';
import UserSchema from '../schemas/user';

import RepositoryErrors from '../errors/repository';

@injectable()
export default class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super('Users', UserSchema, 'user');
  }

  create(attributes: any): Promise<IUserModel> {
    return new Promise<IUserModel>((resolve, reject) => {
      this.model.create(attributes, (err, result) => {
        if (!err) return resolve(result);
        if (err.code !== 11000) return reject(err);
        return reject(
          new RepositoryErrors.DuplicateModelError(
            'Username or email already exists'
          )
        );
      });
    });
  }
}
