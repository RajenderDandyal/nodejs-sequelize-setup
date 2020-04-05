const path = require('path');
require('dotenv').config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '../../.env.prod')
      : path.resolve(__dirname, '../../.env.dev'),
});

export const keys = {
  DATABASE: process.env.DATABASE,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};
