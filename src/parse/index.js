const Parse = require("parse/node");
const config = require('../config/parse.config');

const init = function(){
  Parse.initialize(config.appId, null, config.masterKey);
  Parse.serverURL = config.serverURL
};
module.exports = {
  init: init,
  Parse:Parse,
};
