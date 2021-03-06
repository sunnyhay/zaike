
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("user-routes");
const dbUtil = require("../lib/db-util");
const api = require("../api/common-api");
const userApi = require("../api/user-api");
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
  const user_table = config.dev_env.db.user_table;
  const userCol = db.collection(user_table);

  router.get("/", (req, res) => {
    // Find some documents
    const option = {
      collection: userCol,
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
   add a new user
  用户的entry含一个关注景区或城市的数组，由一个全局的常量来控制最多关注的数量比如5个，
  也含有一个吐槽的数组，昵称，用户名，注册邮件，吐槽数量和等级。
  */

  router.post("/", (req, res) => {
    let record = req.body;
    record = util.setRecordDate(record);

    const apiOption = {
      curDate: record.modified,
      config: config,
      collection: userCol,
      record: record,
      type: "insertOne"
    };

    userApi.insertUser(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  // update a user
  router.post("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    log.info("Updating User: " + id);

    const option = {
      collection: userCol,
      criteria: {
        id: id
      },
      update: {
        $set: {
          tucaoNum: 0
        }
      },
      type: "updateOne"
    };
    log.info(option);

    dbUtil(db, option).then(result => {
      res.send(result);
    }).catch(err => {
      res.send(err);
    });
  });

  // update a user's interest array
  router.post("/:id/interest", (req, res) => {
    let record = req.body;
    record = util.setRecordDate(record);
    const userId = req.params.id;
    log.info("Updating User Interest: " + userId);

    const apiOption = {
      curDate: record.modified,
      collection: userCol,
      userId: userId,
      record: record,
      type: "updateInterest"
    };

    userApi.updateInterest(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
