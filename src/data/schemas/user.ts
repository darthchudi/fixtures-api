import bycrpt from 'bcrypt';

import { Schema, SchemaTypes } from 'mongoose';
import {
  uuid,
  trimmedLowercaseString,
  trimmedString,
  readMapper,
  timestamps,
} from '../helpers/schema';

import { IUserModel } from '../models/user';

const SALT_ROUNDS = 10;

const UserSchema = new Schema(
  {
    _id: uuid,
    deleted_at: { type: SchemaTypes.Date },
    email: { ...trimmedLowercaseString, required: true, unique: true },
    first_name: { ...trimmedLowercaseString, required: true },
    last_name: { ...trimmedLowercaseString, required: true },
    role: { type: SchemaTypes.String, default: 'user' },
    username: { ...trimmedLowercaseString, required: true, unique: true },
    phone_number: { ...trimmedLowercaseString, required: true },
    password: { ...trimmedString, required: true },
  },
  {
    ...readMapper,
    ...timestamps,
  }
);

UserSchema.pre('save', function(next) {
  bycrpt.hash((this as IUserModel).password, SALT_ROUNDS, (err, hash) => {
    if (err) return next(err);
    (this as IUserModel).password = hash;
    next();
  });
});

export default UserSchema;
