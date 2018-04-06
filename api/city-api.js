
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("city-api");
const dbUtil = require("../lib/db-util");

// given a city, need to do the following jobs
// 1. add it into city table;
// 2. add it to the province's cities array, update modified time.
async function insertCity(db, option) {
  // 1. insert city
  option.type = "insertOne";
  let result = await dbUtil(db, option);
  const cityId = option.record.cityId;
  log.info("New created city id: " + cityId);

  // 2. update the province
  // 2.1 find the province
  const provinceId = option.record.provinceId;
  option.type = "find";
  option.query = { provinceId: provinceId };
  option.collection = option.provinceCol;
  result = await dbUtil(db, option);
  const province = result[0];
  // 2.2 update the province's cities array
  option.type = "findOneAndReplace";
  option.criteria = { provinceId: provinceId };
  province.cities.push(option.record);
  province.modified = option.curDate;
  option.replace = province;
  result = await dbUtil(db, option);

  return cityId;
}


module.exports = {
  insertCity
};
