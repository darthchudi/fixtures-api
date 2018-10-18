import { Schema, SchemaTypes } from 'mongoose';
import {
  uuid,
  trimmedLowercaseString,
  trimmedString,
  readMapper,
  timestamps,
} from '../helpers/schema';

const UserSchema = new Schema(
  {
    _id: uuid,
    deleted_at: { type: SchemaTypes.Date },
    email: { ...trimmedLowercaseString, required: true },
    first_name: { ...trimmedLowercaseString, required: true },
    is_admin: { type: SchemaTypes.Boolean, default: false },
    last_name: { ...trimmedLowercaseString, required: true },
    username: { ...trimmedLowercaseString, required: true },
    phone_number: { ...trimmedLowercaseString, required: true },
    password: { ...trimmedString, required: true },
  },
  {
    ...readMapper,
    ...timestamps,
  }
);

export default UserSchema;
