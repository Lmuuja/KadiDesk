const serverless = require('serverless-http');

module.exports.handler = async (event, context) => {
  const expressApp = await import('../server.js');
  const handler = serverless(expressApp.default || expressApp);
  return handler(event, context);
};
