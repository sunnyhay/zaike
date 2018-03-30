
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("user-routes");
const dbUtil = require("../lib/db-util");
const api = require("../lib/api");

// configuration
const config = require("../config/config.json");
// target table
const user_table = config.dev_env.db.user_table;

module.exports = function (db) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   log.log("Time: ", Date.now());
  //   next();
  // });
  const collection = db.collection(user_table);

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
  用户的entry含一个关注景区或城市的数组，由一个全局的常量来控制最多关注的数量比如5个，
  也含有一个吐槽的数组，昵称，用户名，注册邮件，吐槽数量和等级。
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
