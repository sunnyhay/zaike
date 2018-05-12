
// lib
const _ = require("underscore");

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

// 1. begin from province (model), next city and then resort
// 2. iterate each model, firstly check if the model already exists using its name.
// 3. if so give an alert; otherwise insert it.
// 4. for city and resort, update corresponding province and city
// 5. also insert the same object into cache
async function initModel(db, redisClient, apiOption) {
  const provinces = require("../model/province-model");
  _.each(provinces, async province => {
    const provinceName = province.provinceName;
    const option = { collection: apiOption.provinceCol };
    option.type = "find";
    option.query = { provinceName: provinceName };
    let result = await dbUtil(db, option);
    if (!Array.isArray(result) || !result.length) {
      // insert the province
      option.type = "insertOne";
      option.record = province;
      result = await dbUtil(db, option);
      log.info("Add new province: " + provinceName);
    } else {
      log.warn("Already have province: " + provinceName);
    }
    redisClient.hmset("province", provinceName, province.toString());
  });

  const cities = require("../model/city-model");
  async function recurAddCity(cities) {
    if (cities.length === 0) {
      return;
    }
    const city = cities.shift();
    const cityName = city.cityName;
    const option = { collection: apiOption.cityCol };
    option.type = "find";
    option.query = { cityName: cityName };
    let result = await dbUtil(db, option);
    if (!Array.isArray(result) || !result.length) {
      // insert the city
      option.type = "insertOne";
      option.record = city;
      result = await dbUtil(db, option);
      log.info("Add new city: " + cityName);
      // update the province
      // find the province
      const provinceId = city.provinceId;
      option.type = "find";
      option.query = { provinceId: provinceId };
      option.collection = apiOption.provinceCol;
      result = await dbUtil(db, option);
      const province = result[0];
      // update the province's cities array
      option.type = "findOneAndReplace";
      option.criteria = { provinceId: provinceId };
      province.cities.push(city);
      province.modified = new Date();
      option.replace = province;
      result = await dbUtil(db, option);
      log.info("Province " + province.provinceName + " adds a new city: " + cityName);
    } else {
      log.warn("Already have city: " + cityName);
    }
    redisClient.hmset("city", cityName, city.toString());
    recurAddCity(cities);
  }
  recurAddCity(cities);

  const resorts = require("../model/resort-model");
  async function recurAddResort(resorts) {
    if (resorts.length === 0) {
      return;
    }
    const resort = resorts.shift();
    const resortName = resort.resortName;
    const option = { collection: apiOption.resortCol };
    option.type = "find";
    option.query = { resortName: resortName };
    let result = await dbUtil(db, option);
    if (!Array.isArray(result) || !result.length) {
      // insert the resort
      option.type = "insertOne";
      option.record = resort;
      result = await dbUtil(db, option);
      log.info("Add new resort: " + resortName);
      // update the city
      // find the city
      const cityId = resort.cityId;
      option.type = "find";
      option.query = { cityId: cityId };
      option.collection = apiOption.cityCol;
      result = await dbUtil(db, option);
      const city = result[0];
      // update the city's resorts array
      option.type = "findOneAndReplace";
      option.criteria = { cityId: cityId };
      city.resorts.push(resort);
      city.modified = new Date();
      option.replace = city;
      result = await dbUtil(db, option);
      log.info("City " + city.cityName + " adds a new resort: " + resortName);
    } else {
      log.warn("Already have resort: " + resortName);
    }
    redisClient.hmset("resort", resortName, resort.toString());
    recurAddResort(resorts);
  }
  recurAddResort(resorts);

  return "Done with initialization of mdoels";
}


module.exports = {
  cleanup,
  initModel
};
