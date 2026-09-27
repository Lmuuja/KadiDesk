const serverless = require('serverless-http');
const app = require('../server'); // يربط مع ملف server.js الرئيسي

module.exports.handler = serverless(app);
