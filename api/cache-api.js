
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("cache-api");
const cacheUtil = require("../lib/cache-util");

// get all cache objects
function getAllCachedObj(option, cb) {
  const redisClient = option.redisClient;

  redisClient.keys("*", async function (err, keys) {
    if (err) {
      log.error(err);
      return cb(err, null);
    }
    const result = {};
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result[key] = await cacheUtil(redisClient, key);
    }
    cb(null, result);
  });
}

// get a specific cache object
async function getCachedObj(option, cb) {
  const redisClient = option.redisClient;
  const key = option.key;
  cb(await cacheUtil(redisClient, key));
}

module.exports = {
  getAllCachedObj,
  getCachedObj
};
