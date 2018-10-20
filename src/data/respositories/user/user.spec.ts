import 'reflect-metadata';

import 'jest';
import mongoose from 'mongoose';
import ENV from '../../../common/config/env';

import _ from 'lodash';

import UserRepository from '../user/user';

import { UserRequest } from '../../../server/mocks';

import { IUserModel } from '../../models/user';

let request, userRepository: UserRepository, user: IUserModel;

beforeAll(async () => {
  mongoose.connect(
    ENV.MONGODB_URL,
    { useNewUrlParser: true }
  );

  userRepository = new UserRepository();

  request = UserRequest();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe('user Operations', () => {
  it('creates a user', async () => {
    expect.assertions(3);

    user = await userRepository.create(request);
    expect(user.email).toBe(_.toLower(request.email));
    expect(user.username).toBe(_.toLower(request.username));
    expect(user.role).toBe('user');
  });

  it('creates an admin', async () => {
    expect.assertions(3);

    const payload = { ...UserRequest(), role: 'admin' };
    user = await userRepository.create(payload);
    expect(user.email).toBe(_.toLower(payload.email));
    expect(user.username).toBe(_.toLower(payload.username));
    expect(user.role).toBe('admin');
  });

  it('prevents duplicate users from being created', () => {
    expect.assertions(1);
    return userRepository.create(request).catch(e => {
      expect(e.message).toBe('Username or email already exists');
    });
  });

  it('finds a user by ID', async () => {
    expect.assertions(2);
    const res = await userRepository.byID(user.id);
    expect(res.username).toBe(user.username);
    expect(res.email).toBe(user.email);
  });

  it('finds all users', async () => {
    expect.assertions(2);
    const users = await userRepository.all({
      conditions: {},
    });
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
  });
});
