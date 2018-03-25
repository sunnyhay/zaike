
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("tucao");


function find(collection, query, cb) {
  collection.find(query).toArray(function (err, docs) {
    if (err) return cb(err, null);
    log.info(docs);
    cb(null, docs);
  });
}

function insertOne(collection, item, cb) {
  collection.insertOne(item, (err, r) => {
    if (err) return cb(err, null);
    log.info(r.result);
    cb(null, r);
  });
}

module.exports = function(db, option, callback) {
  const collection = option.collection;

  if (option.type === "find") {
    const query = option.query;
    return find(collection, query, callback);
  } else if (option.type === "insertOne") {
    const item = option.item;
    return insertOne(collection, item, callback);
  }

};
