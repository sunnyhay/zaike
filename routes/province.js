
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("province-routes");
const dbUtil = require("../lib/db-util");
const api = require("../lib/api");
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
  const province_table = config.dev_env.db.province_table;
  const collection = db.collection(province_table);

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
  province entry has name, id, country, 介绍文字、介绍图片、联系方式和投诉方式、city 列表。
  */
  router.post("/", (req, res) => {
    let record = req.body;
    record = util.setRecordDate(record);
    log.info(record);

    const option = {
      curDate: record.modified,
      config: config,
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
