import dotenv from 'dotenv';

dotenv.config();

export default {
  MONGODB_URL:
    process.env.MONGODB_URL || 'mongodb://localhost:27017/fixture-api-test',
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 4003,
};
