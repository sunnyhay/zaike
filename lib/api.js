
// own lib
const logger = require("./logger");
const log = logger.getLogger("api");
const dbUtil = require("./db-util");
const util = require("./util");

async function find(db, option) {
  const result = await dbUtil(db, option);
  return result;
}

// given a tucao, need to do the following jobs
// 1. add it into tucao table;
// 2. add it to the user's tucao array, increment tucaoNum and if tucaoNum reaches the next level, increase the user's level. update modified time.
// 3. update city's tucao and other minor-tucao arrays, update modified time.
// 4. if resort is not null, update resort's tucao and other minor-tucao arrays, update modified time.
async function insertTucao(db, option) {
  const config = option.config;

  // 1. insert tucao
  option.type = "insertOne";
  let result = await dbUtil(db, option);
  log.info(result);

  // 2. update user
  // 2.1 find the user
  const curUserId = option.record.userId;
  option.type = "find";
  option.query = { userId: curUserId };
  option.collection = option.userCol;
  result = await dbUtil(db, option);
  const userRecord = result[0];
  // 2.2 update the user
  option.type = "findOneAndReplace";
  option.criteria = { userId: curUserId };
  userRecord.tucao.push(option.record);
  const curUserLevel = userRecord.userLevel;
  log.info("Current User Level: " + JSON.stringify(curUserLevel, null, 2));
  userRecord.tucaoNum = userRecord.tucaoNum + 1;
  const newUserLevel = util.getUserLevel(userRecord.tucaoNum, config);
  log.info("New User Level: " + JSON.stringify(newUserLevel, null, 2));
  // TODO: if current user level is promoted, post the message and write it back to the user record!
  userRecord.modified = option.curDate;
  option.replace = userRecord;
  result = await dbUtil(db, option);

  // 3. update the city

  // log.info(result);
  return result;
}

async function updateUser(db, option) {
  option.type = "updateOne";
  let result = await dbUtil(db, option);
  log.info(result);
  return result;
}


module.exports = {
  find,
  insertTucao,
  updateUser
};
