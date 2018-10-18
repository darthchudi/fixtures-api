import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: 4003,
  MONGODB_URL: process.env.MONGODB_URL,
};
