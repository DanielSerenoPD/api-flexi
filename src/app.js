const express = require('express');
//const socketIo = require('socket.io')
const http = require('http')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const errorHandler = require('./utils/middlewares/errorHandler.js')
const setHeaders = require('./utils/middlewares/setHeaders.js')
const cors = require('cors');
const Parse = require('./parse');
const config = require('./config/parse.config');
const app = express();
const server = http.createServer(app)
const io = require("socket.io")(server, 
    { 
    cors: {    
      origin: "*",    
      methods: ["GET", "POST"]  
    }});
server.name = 'API';
var ParseServer    = require('parse-server').ParseServer;
var api = new ParseServer({
    appId: config.appId,
    masterKey: config.masterKey, //Add your master key here. Keep it secret!
    serverURL: config.serverURL, // Don't forget to change to https if needed,
});
Parse.init();
var mountPath = '/parse';
app.use(mountPath, api);
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(cors({
  origin: '*'
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });
  
app.use('/', cors({
  origin: '*'
}),routes);
app.use(errorHandler);

module.exports = server;