
// lib
const redis = require("redis");
const redisClient = redis.createClient();

// own lib
const logger = require("./logger");
const log = logger.getLogger("redis");


redisClient.on("connect", () => {
  log.info("Redis server connected!");
});

redisClient.on("error", function (err) {
  log.error("Redis error below!");
  log.error(err);
});

function init() {
  // TODO: initialize all the cache objects, e.g. initialize a total number of tucao
  return redisClient;
}

module.exports = {
  init
};
