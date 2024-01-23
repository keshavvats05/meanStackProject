// config.js

require('dotenv').config();

module.exports = {
  mongodbKey: process.env.MONGODB_KEY || 'admin',
  jwtKey: process.env.JWT_KEY || 'secret_this_should_be_longer',
};
