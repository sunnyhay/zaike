
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("tucao-api");
const dbUtil = require("../lib/db-util");

async function updateUser(db, option) {
  option.type = "updateOne";
  let result = await dbUtil(db, option);
  log.info(result);
  return result;
}


module.exports = {
  updateUser
};
