
// lib
const dbClient = require("mongodb").MongoClient;

// own lib
const logger = require("./logger");
const log = logger.getLogger("db");

// configuration
const config = require("../config/config.json");
const host = config.dev_env.host, port = config.dev_env.mongo_port;
// Connection URL
const url = `mongodb://${host}:${port}`;
// Database Name: zaike
const dbName = config.dev_env.db.name;

function connectDb(url) {
  log.info("current MongoDB connection URL: " + url);
  return dbClient.connect(url)
    .then(client => client.db(dbName))
    .catch(err => {
      log.error("MongoDB connection Error!");
      log.error(err);
    });
}

module.exports = async function () {
  const databases = await Promise.all([connectDb(url)]);
  return {
    dev: databases[0]
  };
};


