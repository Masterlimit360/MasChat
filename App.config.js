export default {
  extra: {
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
  },
};
// File: ./app.config.js

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      API_URL: process.env.API_URL || 'http://10.94.219.125:8080/api',
      ENV: process.env.ENV || 'development',
    },
  };
};