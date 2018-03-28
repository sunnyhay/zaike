
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("tucao");
const dbUtil = require("../lib/db-util");
const api = require("../lib/api");

// configuration
const config = require("../config/config.json");
// target table
const tucao_table = config.dev_env.db.tucao_table;

module.exports = function (db) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   log.log("Time: ", Date.now());
  //   next();
  // });
  const collection = db.collection(tucao_table);

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
  吐槽entry有ID，用户ID，用户昵称，城市ID，城市名称，景区ID，景区名称，总体宰客评分，吃住行购物其他这五方面的分数，
  正文，点赞数目，回复留言数组包含所有针对该吐槽的留言，创建时间，修改时间，删除软标志，重要等级（人工设置辅助）
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
    // dbUtil(db, option, (err, result) => {
    //   if (err) res.send(err);
    //   res.send(result);
    // });
    dbUtil(db, option).then(result => {
      res.send(result);
    }).catch(err => {
      res.send(err);
    });
  });

  router.get("/:id", function (req, res) {
    log.info(req.params.id);
    res.send("Get ID: " + req.params.id);
  });

  return router;
};
