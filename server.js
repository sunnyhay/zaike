
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");

const lib = require("./lib/db");
const logger = require("./lib/logger");
const log = logger.getLogger("server");

const app = express();
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

app.get("/", function (req, res) {
  res.send("Hello Jerry Sun");
  log.info("Cookies: ", req.cookies);
});

// This responds a GET request for the /getDocs page.
app.get("/getDocs", function (req, res) {
  log.log("Got a GET request for /getDocs");
  lib.getDocs().then(result => {
    log.info("final result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  }).catch(e => {
    log.error(e);
    res.send(e);
  });
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;
  log.info("Example app listening at http://%s:%s", host, port);
});
