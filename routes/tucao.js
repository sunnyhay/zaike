
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("tucao-routes");
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
  const tucao_table = config.dev_env.db.tucao_table;
  const user_table = config.dev_env.db.user_table;


  const tucaoCol = db.collection(tucao_table);
  const userCol = db.collection(user_table);

  // find all tucao
  router.get("/", (req, res) => {
    // Find some documents
    const option = {
      collection: tucaoCol,
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
  add a new tucao
  吐槽entry有ID，用户ID，用户昵称，城市ID，城市名称，景区ID，景区名称，总体宰客评分，吃住行购物其他这五方面的分数，
  正文，点赞数目，回复留言数组包含所有针对该吐槽的留言，创建时间，修改时间，删除软标志，重要等级（人工设置辅助）
  */
  router.post("/", (req, res) => {
    let record = req.body;
    record = util.setRecordDate(record);

    log.debug(record);
    const option = {
      curDate: record.modified,
      config: config,
      collection: tucaoCol,
      userCol: userCol,
      record: record
    };

    api.insertTucao(db, option).then(result => {
      res.send(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
