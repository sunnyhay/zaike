
// TODO: initialize all the cache objects
function init(redisClient) {
  redisClient.set("tucaoNum", 0);
}

module.exports = {
  init
};
