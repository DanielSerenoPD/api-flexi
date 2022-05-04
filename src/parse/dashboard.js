const ParseDashboard = require('parse-dashboard');
const config = require('../config/parse.config')

const dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": config.serverURL,
      "appId": config.appId,
      "masterKey": config.masterKey,
      "appName": config.appName
    },
  ],
  "users": [
    {
      "user": "admin",
      "pass": "cliente"
    },
    {
      "user":"brounie",
      "pass":"brounie1A"
    }
  ]
}, true);

module.exports = {
  dashboard: dashboard,
  url: '/parse/dashboard'
};
