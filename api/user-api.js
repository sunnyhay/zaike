
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("user-api");
const dbUtil = require("../lib/db-util");
const util = require("../lib/util");

// TODO: introduce an integrated oauth2 user management

// add a new user
// 1. search for the same email address in current user table. if found, alert the user to use a different email
// 2. otherwise add the user
async function insertUser(db, option) {
  const curEmail = option.record.email;
  option.type = "find";
  option.query = { email: curEmail };
  let result = await dbUtil(db, option);
  if (result.length > 0) {
    log.debug(result);
    log.error("The email is already used for a user: " + curEmail);
    return "Please use another email address for user registration!";
  }

  option.type = "insertOne";
  result = await dbUtil(db, option);
  const objectId = result.insertedId;
  log.info("New created user object id: " + objectId);
  return objectId;
}

// update current user
async function updateUser(db, option) {
  option.type = "updateOne";
  let result = await dbUtil(db, option);
  log.info(result);
  return result;
}

// update a user's interest
// 1. read the user
// 2. update the user's interest
async function updateInterest(db, option) {
  // 1 find the user
  option.type = "find";
  option.query = { userId: option.userId };
  let result = await dbUtil(db, option);
  const userRecord = result[0];
  // 2 update the user
  option.type = "findOneAndReplace";
  option.criteria = { userId: option.userId };
  log.info("current user interest: " + JSON.stringify(userRecord.interest));
  log.info("new interest: " + JSON.stringify(option.record));
  userRecord.interest = util.mergeArrays(userRecord.interest, option.record);
  userRecord.modified = option.curDate;
  option.replace = userRecord;
  result = await dbUtil(db, option);
  log.info("Update current user interest: " + result);
  return result;
}


module.exports = {
  updateUser,
  insertUser,
  updateInterest
};
