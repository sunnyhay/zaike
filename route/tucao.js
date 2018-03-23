const express = require("express");
const router = express.Router();

// middleware that is specific to this router
router.use(function (req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// define the home page route
router.get("/", function (req, res) {
  res.send("Tucao home page");
});

// define the about route
router.get("/:id", function (req, res) {
  console.info(req.params.id);
  res.send("Get ID: " + req.params.id);
});

module.exports = router;
