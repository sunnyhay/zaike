
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("resort-api");
const dbUtil = require("../lib/db-util");

// given a resort, need to do the following jobs
// 1. add it into resort table;
// 2. add it to the city's resorts array, update modified time.
async function insertResort(db, option) {
  // 1. insert resort
  option.type = "insertOne";
  let result = await dbUtil(db, option);
  const resortId = option.record.resortId;
  log.info("New created resort id: " + resortId);

  // 2. update the city
  // 2.1 find the city
  const cityId = option.record.cityId;
  option.type = "find";
  option.query = { cityId: cityId };
  option.collection = option.cityCol;
  result = await dbUtil(db, option);
  const city = result[0];
  // 2.2 update the city's resorts array
  option.type = "findOneAndReplace";
  option.criteria = { cityId: cityId };
  city.resorts.push(option.record);
  city.modified = option.curDate;
  option.replace = city;
  result = await dbUtil(db, option);

  return resortId;
}


module.exports = {
  insertResort
};
