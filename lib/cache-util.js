
// own lib
const util = require("./util");

// configuration
const config = require("../config/config.json");

function findAsync(redisClient, key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) reject(err);
      resolve(val);
    });
  });
}

function findHashAsync(redisClient, key) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(key, (err, val) => {
      if (err) reject(err);
      resolve(val);
    });
  });
}

module.exports = async function (redisClient, key) {
  const cacheObjs = config.dev_env.cache.table;
  let result;
  if (util.containsInArray(cacheObjs, key)) {
    result = await findHashAsync(redisClient, key);
  } else {
    result = await findAsync(redisClient, key);
  }
  return result;
};
