
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("news-routes");
const api = require("../api/common-api");
const newsApi = require("../api/news-api");
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
  const news_table = config.dev_env.db.news_table;
  const collection = db.collection(news_table);

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
  新闻entry有ID，简介，引用（来源地），正文，图片数组，城市数组，景区数组，点赞数，回复数组。
  */

  router.post("/", (req, res) => {
    let record = req.body;
    record = util.setRecordDate(record);
    log.info(record);

    const apiOption = {
      curDate: record.modified,
      collection: collection,
      record: record,
      type: "insertOne"
    };

    newsApi.insertNews(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
