
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("resort-routes");
const dbUtil = require("../lib/db-util");
const api = require("../lib/api");

// configuration
const config = require("../config/config.json");
// target table
const resort_table = config.dev_env.db.resort_table;

module.exports = function (db) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   log.log("Time: ", Date.now());
  //   next();
  // });
  const collection = db.collection(resort_table);

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
