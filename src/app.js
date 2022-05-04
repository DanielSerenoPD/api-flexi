const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const errorHandler = require('./utils/middlewares/errorHandler.js')
const setHeaders = require('./utils/middlewares/setHeaders.js')
const cors = require('cors');
const Parse = require('./parse');
const config = require('./config/parse.config');
const server = express();
server.name = 'API';
var ParseServer    = require('parse-server').ParseServer;
var api = new ParseServer({
    appId: config.appId,
    masterKey: config.masterKey, //Add your master key here. Keep it secret!
    serverURL: config.serverURL, // Don't forget to change to https if needed,
});
Parse.init();
var mountPath = '/parse';
server.use(mountPath, api);
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(setHeaders);
server.use('/api', routes);
server.use(errorHandler);
module.exports = server;