
// lib
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const redis = require("redis");
const responseTime = require("response-time");
const session = require("express-session");

// own lib
const cache = require("./lib/init-cache");
const initDatabases = require("./lib/db");
const logger = require("./lib/logger");
const log = logger.getLogger("server");
const routes = require("./routes");

// configuration
const config = require("./config/config.json");
const port = config.dev_env.port;

const redisClient = redis.createClient();
const app = express();
// set runtime config from config.json
app.set("globalConfig", config);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: "zaike",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(responseTime());

redisClient.on("connect", () => {
  log.info("Redis server connected!");
});

redisClient.on("error", function (err) {
  log.error("Redis error below!");
  log.error(err);
});

// initialize database and then start the server
initDatabases().then(dbs => {
  // initialize the cache
  cache.init(redisClient);
  // initialize the application once database connections are ready.
  routes(app, dbs, redisClient).listen(port, () => {
    log.info(`Listening on port ${port}`);
  });
}).catch(err => {
  log.error("Failed to make all database connections!");
  log.error(err);
  process.exit(1);
});

process.on("exit", function () {
  log.warn("Now quit the server as well as redis client!");
  redisClient.quit();
});
