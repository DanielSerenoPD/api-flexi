// CONFIG CONSTANTS
APP_ID = 'BrounieApp';
MASTER_KEY = "C4suYZKkyRMYPGR7fEae";
APP_NAME = "Parse Server";
/**Esta ruta apunta al servidor de parse en el droplet pero se cambio para usar ambas aplicaciones en el mismo droplet,
** en caso de hacerlo en 2 droplets separados se debe cambiar*/
//serverURL = "https://coparmex.brounieapps.com/parse";
serverURL = "https://flexi.brounieapps.com/parse"
//serverURL = "http://localhost:3000/parse"
mongoDB = "mongodb://admin:cliente@159.203.180.137:27017/dev?authSource=admin"
//mongodb://brounie1A:brounie@198.199.79.121:27017/dev?authSource=admin

const databaseUri = mongoDB
if (!databaseUri) {
  console.log('Si no se especifica el nombre de la BD usara dev por defecto');
}

module.exports = {
  appId: APP_ID,
  masterKey: MASTER_KEY,
  appName: APP_NAME,
  serverURL: serverURL,
  databaseUri: databaseUri,
  sessionLenght: 31336000*2
};

