
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
  const tucaoId = result.insertedId;
  log.info("New created Tucao with _id: " + tucaoId);

  // 2. update user
  // 2.1 find the user
  const userId = option.record.userId;
  option.type = "find";
  option.query = { userId: userId };
  option.collection = option.userCol;
  result = await dbUtil(db, option);
  const userRecord = result[0];
  // 2.2 update the user
  option.type = "findOneAndReplace";
  option.criteria = { userId: userId };
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
  // 3.1 find the city
  const cityId = option.record.cityId;
  option.type = "find";
  option.query = { cityId: cityId };
  option.collection = option.cityCol;
  result = await dbUtil(db, option);
  const cityRecord = result[0];
  // 3.2 update the city
  option.type = "findOneAndReplace";
  option.criteria = { cityId: cityId };
  cityRecord.tucao[option.record.totalRating - 1]++;
  cityRecord.funTucao[option.record.ratings.fun - 1]++;
  cityRecord.eatTucao[option.record.ratings.eat - 1]++;
  cityRecord.lodgeTucao[option.record.ratings.lodge - 1]++;
  cityRecord.travelTucao[option.record.ratings.travel - 1]++;
  cityRecord.shoppingTucao[option.record.ratings.shopping - 1]++;
  cityRecord.otherTucao[option.record.ratings.other - 1]++;
  cityRecord.modified = option.curDate;
  option.replace = cityRecord;
  result = await dbUtil(db, option);

  // 4. if possible update the resort
  if (option.record.resortId !== null) {
    // 4.1 find the resort
    const resortId = option.record.resortId;
    option.type = "find";
    option.query = { resortId: resortId };
    option.collection = option.resortCol;
    result = await dbUtil(db, option);
    const resortRecord = result[0];
    // 4.2 update the resort
    option.type = "findOneAndReplace";
    option.criteria = { resortId: resortId };
    resortRecord.tucao[option.record.totalRating - 1]++;
    resortRecord.funTucao[option.record.ratings.fun - 1]++;
    resortRecord.eatTucao[option.record.ratings.eat - 1]++;
    resortRecord.lodgeTucao[option.record.ratings.lodge - 1]++;
    resortRecord.travelTucao[option.record.ratings.travel - 1]++;
    resortRecord.shoppingTucao[option.record.ratings.shopping - 1]++;
    resortRecord.otherTucao[option.record.ratings.other - 1]++;
    resortRecord.modified = option.curDate;
    option.replace = resortRecord;
    result = await dbUtil(db, option);
  }
  return tucaoId;
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
