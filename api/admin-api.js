
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("admin-api");
const dbUtil = require("../lib/db-util");

// clean up some tables
async function cleanup(db, option) {
  const emptyRates = [0, 0, 0, 0, 0];
  // 1. remove all comments
  option.collection = option.commentCol;
  option.criteria = {};
  option.type = "deleteMany";
  let result = await dbUtil(db, option);
  log.info("Clean up all comments!");

  // 2. remove all tucao
  option.collection = option.tucaoCol;
  option.type = "deleteMany";
  result = await dbUtil(db, option);
  log.info("Clean up all tucao!");

  // 3. clean all the tucao in city table
  option.collection = option.cityCol;
  option.type = "updateMany";
  option.update = {
    $set: {
      tucao: emptyRates,
      funTucao: emptyRates,
      eatTucao: emptyRates,
      lodgeTucao: emptyRates,
      travelTucao: emptyRates,
      shoppingTucao: emptyRates,
      otherTucao: emptyRates
    }
  };
  result = await dbUtil(db, option);
  log.info("Clean up all cities!");

  // 4. clean all the tucao in resort table
  option.collection = option.resortCol;
  option.type = "updateMany";
  option.update = {
    $set: {
      tucao: emptyRates,
      funTucao: emptyRates,
      eatTucao: emptyRates,
      lodgeTucao: emptyRates,
      travelTucao: emptyRates,
      shoppingTucao: emptyRates,
      otherTucao: emptyRates
    }
  };
  result = await dbUtil(db, option);
  log.info("Clean up all resorts!");

  // 5. clean all the tucao in user table
  option.collection = option.userCol;
  option.type = "updateMany";
  option.update = {
    $set: {
      tucaoNum: 0, tucao: [], userLevel: {
        "level": 0,
        "name": "布衣",
        "medal": "灰铅"
      }
    }
  };
  result = await dbUtil(db, option);
  log.info("Clean up all resorts!");

  return result;
}


module.exports = {
  cleanup
};
