
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("city-routes");
const dbUtil = require("../lib/db-util");
const api = require("../lib/api");

// configuration
const config = require("../config/config.json");
// target table
const city_table = config.dev_env.db.city_table;

module.exports = function (db) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   log.log("Time: ", Date.now());
  //   next();
  // });
  const collection = db.collection(city_table);

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
  城市entry有名称、id, 所属省市、总体差评数组（长度5，index从0到4分别对应1分到5分），各项分类差评数组（类似总体差评）、介绍文字、
  介绍图片、联系方式和投诉方式、标签组、经纬度, 景区列表。
  */

  router.post("/", (req, res) => {
    const record = req.body;
    record.created = new Date();
    record.modified = new Date();
    log.info(record);

    const option = {
      collection: collection,
      item: record,
      type: "insertOne"
    };

    dbUtil(db, option).then(result => {
      res.send(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
