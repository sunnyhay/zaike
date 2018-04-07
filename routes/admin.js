
// lib
const express = require("express");
const router = express.Router();

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("admin-routes");
const adminApi = require("../api/admin-api");


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
  const resort_table = config.dev_env.db.resort_table;
  const comment_table = config.dev_env.db.comment_table;

  const tucaoCol = db.collection(tucao_table);
  const userCol = db.collection(user_table);
  const cityCol = db.collection(city_table);
  const resortCol = db.collection(resort_table);
  const commentCol = db.collection(comment_table);

  router.get("/", (req, res) => {
    res.send("You are in the admin page!");
  });

  /*
  clean up city, resort, user, tucao and comment tables
  1. all tucao and comments are removed;
  2. user, city and resort tables are cleaned up by removing relevant tucao and ratings
  */

  router.get("/cleanup", (req, res) => {
    const apiOption = {
      tucaoCol: tucaoCol,
      userCol: userCol,
      cityCol: cityCol,
      resortCol: resortCol,
      commentCol: commentCol,
      type: "cleanup"
    };
    log.info("Now clean up all the tables under admin account!");

    adminApi.cleanup(db, apiOption).then(result => {
      res.json(result);
    }).catch(err => {
      res.send(err);
    });
  });

  return router;
};
