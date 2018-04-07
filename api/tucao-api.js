
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("tucao-api");
const dbUtil = require("../lib/db-util");
const util = require("../lib/util");

// given a tucao, need to do the following jobs
// 1. add it into tucao table;
// 2. add it to the user's tucao array, increment tucaoNum and if tucaoNum reaches the next level, increase the user's level. update modified time.
// 3. update city's tucao and other minor-tucao arrays, update modified time.
// 4. if resort is not null, update resort's tucao and other minor-tucao arrays, update modified time.
// 5. return the tucao's _id to sender (android app)
async function insertTucao(db, option) {
  const config = option.config;

  // 1. insert tucao
  option.type = "insertOne";
  let result = await dbUtil(db, option);
  const objectId = result.insertedId;
  log.info("New created tucao object id: " + objectId);

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
  // 5. return object id of this tucao. actually do not use the this
  return objectId;
}

// given a tucaoId, need to do the following jobs
// 1. read it from tucao table and delete it;
// 2. remove it out of the user's tucao array, no action against tucaoNum and the user's level. update modified time.
// 3. update city's tucao and other minor-tucao arrays, update modified time.
// 4. if resort is not null, update resort's tucao and other minor-tucao arrays, update modified time.
// 5. return the tucao's _id to sender (android app)
async function deleteTucao(db, option) {
  // 1. read the tucao and delete it from tucao table
  // 1.1 get the tucao
  const tucaoId = option.tucaoId;
  option.type = "find";
  option.query = { tucaoId: tucaoId };
  let result = await dbUtil(db, option);
  const tucaoRecord = result[0];
  // 1.2 delete it
  option.type = "deleteOne";
  option.criteria = { tucaoId: tucaoId };
  result = await dbUtil(db, option);

  // 2. update user
  // 2.1 find the user
  const userId = tucaoRecord.userId;
  option.type = "find";
  option.query = { userId: userId };
  option.collection = option.userCol;
  result = await dbUtil(db, option);
  const userRecord = result[0];
  // 2.2 update the user
  option.type = "findOneAndReplace";
  option.criteria = { userId: userId };
  userRecord.tucao = util.removeArrElem(userRecord.tucao, "tucaoId", tucaoId);
  userRecord.modified = option.curDate;
  option.replace = userRecord;
  result = await dbUtil(db, option);

  // 3. update the city
  // 3.1 find the city
  const cityId = tucaoRecord.cityId;
  option.type = "find";
  option.query = { cityId: cityId };
  option.collection = option.cityCol;
  result = await dbUtil(db, option);
  const cityRecord = result[0];
  // 3.2 update the city
  option.type = "findOneAndReplace";
  option.criteria = { cityId: cityId };
  cityRecord.tucao[tucaoRecord.totalRating - 1]--;
  cityRecord.funTucao[tucaoRecord.ratings.fun - 1]--;
  cityRecord.eatTucao[tucaoRecord.ratings.eat - 1]--;
  cityRecord.lodgeTucao[tucaoRecord.ratings.lodge - 1]--;
  cityRecord.travelTucao[tucaoRecord.ratings.travel - 1]--;
  cityRecord.shoppingTucao[tucaoRecord.ratings.shopping - 1]--;
  cityRecord.otherTucao[tucaoRecord.ratings.other - 1]--;
  cityRecord.modified = option.curDate;
  option.replace = cityRecord;
  result = await dbUtil(db, option);

  // 4. if possible update the resort
  if (tucaoRecord.resortId !== null) {
    // 4.1 find the resort
    const resortId = tucaoRecord.resortId;
    option.type = "find";
    option.query = { resortId: resortId };
    option.collection = option.resortCol;
    result = await dbUtil(db, option);
    const resortRecord = result[0];
    // 4.2 update the resort
    option.type = "findOneAndReplace";
    option.criteria = { resortId: resortId };
    resortRecord.tucao[tucaoRecord.totalRating - 1]--;
    resortRecord.funTucao[tucaoRecord.ratings.fun - 1]--;
    resortRecord.eatTucao[tucaoRecord.ratings.eat - 1]--;
    resortRecord.lodgeTucao[tucaoRecord.ratings.lodge - 1]--;
    resortRecord.travelTucao[tucaoRecord.ratings.travel - 1]--;
    resortRecord.shoppingTucao[tucaoRecord.ratings.shopping - 1]--;
    resortRecord.otherTucao[tucaoRecord.ratings.other - 1]--;
    resortRecord.modified = option.curDate;
    option.replace = resortRecord;
    result = await dbUtil(db, option);
  }
  // 5. return this tucao id
  return tucaoId;
}

// given a comment, need to do the following jobs
// 1. add it into comment table;
// 2. add it to the tucao's comments array, update modified time.
// 3. return the comment's _id to sender (android app)
async function commentTucao(db, option) {
  // 1. insert the comment
  option.type = "insertOne";
  let result = await dbUtil(db, option);
  const commentId = result.insertedId;
  log.info("New created comment object id: " + commentId);

  // 2. update the corresponding tucao
  // 2.1 find the tucao
  const tucaoId = option.tucaoId;
  option.type = "find";
  option.query = { tucaoId: tucaoId };
  option.collection = option.tucaoCol;
  result = await dbUtil(db, option);
  const tucaoRecord = result[0];
  // 2.2 push the comment into this tucao
  option.type = "findOneAndReplace";
  option.criteria = { tucaoId: tucaoId };
  tucaoRecord.comments.push(option.record);
  tucaoRecord.modified = option.curDate;
  option.replace = tucaoRecord;
  result = await dbUtil(db, option);
  // 3. return object id of this comment
  return commentId;
}

// increment like for a given tucao
// 1. find the tucao
// 2. update the tucao by incrementing its like
async function likeTucao(db, option) {
  // 1. find the tucao
  const tucaoId = option.tucaoId;
  option.type = "find";
  option.query = { tucaoId: tucaoId };
  option.collection = option.collection;
  let result = await dbUtil(db, option);
  const tucaoRecord = result[0];
  // 2. increment the like for this tucao
  option.type = "findOneAndReplace";
  option.criteria = { tucaoId: tucaoId };
  tucaoRecord.like++;
  tucaoRecord.modified = option.curDate;
  option.replace = tucaoRecord;
  result = await dbUtil(db, option);
  return result;
}



module.exports = {
  insertTucao,
  deleteTucao,
  likeTucao,
  commentTucao
};
