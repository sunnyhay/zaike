const fs = require("fs-extra");
// centralize log configurations
const log4js = require("log4js");


function getLogger(category) {
  const log4jsConfig = JSON.parse(fs.readFileSync(__dirname + "/../config/log-config.json"));
  log4js.configure(log4jsConfig);
  return log4js.getLogger(category);
}

module.exports = {
  getLogger
};
