
// lib
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");

// own lib
const initDatabases = require("./lib/db");
const logger = require("./lib/logger");
const log = logger.getLogger("server");
const routes = require("./routes");

// configuration
const config = require("./config/config.json");
const port = config.dev_env.port;

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


// initialize database and then start the server
initDatabases().then(dbs => {
  // Initialize the application once database connections are ready.
  routes(app, dbs).listen(port, () => {
    log.info(`Listening on port ${port}`);
  });
}).catch(err => {
  log.error("Failed to make all database connections!");
  log.error(err);
  process.exit(1);
});

