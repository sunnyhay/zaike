
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("image-routes");
const api = require("../api/common-api");
const imageApi = require("../api/image-api");
const util = require("../lib/util");


module.exports = function (option) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   log.log("Time: ", Date.now());
  //   next();
  // });
  const db = option.db;
  const config = option.config;
  const imageInfo = option.imageInfo;
  // target table
  const image_table = config.dev_env.db.image_table;
  const collection = db.collection(image_table);

  router.get("/:id", (req, res) => {
    const id = req.params.id;
    // Find some documents
    const option = {
      collection: collection,
      query: { id: id },
      type: "find"
    };
    api.find(db, option).then(result => {
      log.info(imageInfo);
      res.setHeader("content-type", result[0].contentType);
      res.send(result[0].img.buffer);
    }).catch(err => {
      res.send(err);
    });
  });

  /*
  图片统一存在一个image表中，entry包括ID，名称，简介，file location and content type (image/jpeg)。
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

    imageApi.insertImage(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
