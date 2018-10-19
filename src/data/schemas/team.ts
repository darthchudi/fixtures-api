import { Schema, SchemaTypes } from 'mongoose';
import {
  uuid,
  trimmedLowercaseString,
  readMapper,
  timestamps,
} from '../helpers/schema';

const TeamSchema = new Schema(
  {
    _id: uuid,
    city: { ...trimmedLowercaseString, default: null },
    country: { ...trimmedLowercaseString, default: null },
    deleted_at: { type: SchemaTypes.Date },
    league: { ...trimmedLowercaseString, required: true },
    name: { ...trimmedLowercaseString, required: true, unique: true },
    short_name: {
      ...trimmedLowercaseString,
      default: function() {
        return this.name;
      },
      unique: true,
    },
    stadium: { ...trimmedLowercaseString, required: true },
  },
  {
    ...readMapper,
    ...timestamps,
  }
);

export default TeamSchema;
