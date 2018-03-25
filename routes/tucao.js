
// lib
const express = require("express");
const router = express.Router();

// configuration
const config = require("../config/config.json");
// target table
const tucao_table = config.dev_env.db.tucao_table;

module.exports = function(db) {
  // middleware that is specific to this router
  // router.use(function (req, res, next) {
  //   console.log("Time: ", Date.now());
  //   next();
  // });

  router.get("/", function (req, res) {
    const collection = db.collection(tucao_table);
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
      console.info("Found the following records");
      console.info(docs);
      res.send(docs);
    });
  });

  router.get("/:id", function (req, res) {
    console.info(req.params.id);
    res.send("Get ID: " + req.params.id);
  });

  return router;
};
