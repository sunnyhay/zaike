
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("resort-routes");
const api = require("../api/common-api");
const resortApi = require("../api/resort-api");
const util = require("../lib/util");


module.exports = function (option) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   log.log("Time: ", Date.now());
  //   next();
  // });
  const db = option.db;
  const config = option.config;
  // target table
  const resort_table = config.dev_env.db.resort_table;
  const city_table = config.dev_env.db.city_table;

  const collection = db.collection(resort_table);
  const cityCol = db.collection(city_table);

  router.get("/", (req, res) => {
    // Find some documents
    const option = {
      collection: collection,
      query: {},
      type: "find"
    };
    api.find(db, option).then(result => {
      res.send(result);
    }).catch(err => {
      res.send(err);
    });
  });

  /*
  景区entry有名称、所属城市或省市、总体差评数组（长度5，index从0到4分别对应1分到5分），各项分类差评数组（类似总体差评）、介绍文字、
  介绍图片、联系方式和投诉方式、标签组、经纬度等。
城市entry有类似景区entry的属性，区别在于有一个景区列表。
  */
  router.post("/", (req, res) => {
    let record = req.body;
    record = util.setRecordDate(record);
    log.info(record);

    const apiOption = {
      curDate: record.modified,
      collection: collection,
      cityCol: cityCol,
      record: record,
      type: "insertOne"
    };

    resortApi.insertResort(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
