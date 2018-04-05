
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
  const city_table = config.dev_env.db.city_table;
  const province_table = config.dev_env.db.province_table;
  const resort_table = config.dev_env.db.resort_table;
  const comment_table = config.dev_env.db.comment_table;

  const tucaoCol = db.collection(tucao_table);
  const userCol = db.collection(user_table);
  const cityCol = db.collection(city_table);
  const provinceCol = db.collection(province_table);
  const resortCol = db.collection(resort_table);
  const commentCol = db.collection(comment_table);

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

  // find a specific tucao by _id
  router.get("/:id", (req, res) => {
    const option = {
      collection: tucaoCol,
      query: { _id: util.getObjectId(req.params.id) },
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
    const apiOption = {
      curDate: record.modified,
      config: config,
      collection: tucaoCol,
      userCol: userCol,
      cityCol: cityCol,
      provinceCol: provinceCol,
      resortCol: resortCol,
      record: record
    };

    api.insertTucao(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  // like the tucao
  router.put("/:id/like", (req, res) => {
    const apiOption = {
      id: req.params.id,
      curDate: new Date(),
      collection: tucaoCol
    };

    api.likeTucao(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  // comment the tucao
  /*
  留言entry有用户ID，用户昵称，回复类型：新闻或吐槽，新闻或者吐槽ID，正文，创建时间，修改时间，删除软标志。
   */
  router.post("/:id/comment", (req, res) => {
    let comment = req.body;
    comment = util.setRecordDate(comment);

    log.debug(comment);
    const apiOption = {
      id: req.params.id,
      curDate: comment.modified,
      collection: commentCol,
      tucaoCol: tucaoCol,
      record: comment
    };

    api.commentTucao(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
