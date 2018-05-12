
// lib
const express = require("express");
const router = express.Router();

// own lib
const cacheApi = require("../api/cache-api");


module.exports = function (option) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   log.log("Time: ", Date.now());
  //   next();
  // });
  const redisClient = option.redisClient;

  router.get("/", (req, res) => {
    const option = {
      redisClient
    };
    cacheApi.getAllCachedObj(option, (err, result) => {
      if (err)
        res.send(err);
      res.send(result);
    });
  });

  router.get("/:key", (req, res) => {
    const option = {
      redisClient,
      key: req.params.key
    };
    cacheApi.getCachedObj(option, (err, result) => {
      if (err)
        res.send(err);
      res.send(result);
    });
  });

  return router;
};
