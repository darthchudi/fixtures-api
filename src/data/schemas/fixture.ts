import { Schema, SchemaTypes } from 'mongoose';
import {
  readMapper,
  timestamps,
  trimmedLowercaseString,
  trimmedString,
  uuid,
} from '../helpers/schema';

const ScoreSchema = new Schema({
  winner: { ...trimmedString, required: true },
  home_team: { type: SchemaTypes.Number, required: true },
  away_team: { type: SchemaTypes.Number, required: true },
});

const FixtureSchema = new Schema(
  {
    _id: uuid,
    away_team: {
      type: SchemaTypes.String,
      ref: 'Teams',
      required: true,
    },
    competition: { ...trimmedLowercaseString, default: null },
    date: { type: SchemaTypes.Date, required: true },
    deleted_at: { type: SchemaTypes.Date },
    group: { ...trimmedLowercaseString, default: null },
    home_team: {
      type: SchemaTypes.String,
      ref: 'Teams',
      required: true,
    },
    match_day: { type: SchemaTypes.Number, default: null },
    stadium: { ...trimmedLowercaseString, required: true },
    stage: { ...trimmedLowercaseString, default: null },
    status: {
      ...trimmedLowercaseString,
      enum: ['pending', 'ongoing', 'completed'],
      default: 'pending',
    },
    score: { type: ScoreSchema, default: null },
    time: { ...trimmedString, required: true },
  },
  {
    ...readMapper,
    ...timestamps,
  }
);

export default FixtureSchema;
