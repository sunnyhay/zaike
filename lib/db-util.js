
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("db-util");


function findAsync(collection, query) {
  return new Promise((resolve, reject) => {
    collection.find(query).toArray(function (err, docs) {
      if (err) reject(err);
      log.debug(docs);
      resolve(docs);
    });
  });
}

function insertOneAsync(collection, item) {
  return new Promise((resolve, reject) => {
    collection.insertOne(item, (err, r) => {
      if (err) reject(err);
      log.debug(r.result);
      resolve(r);
    });
  });
}


module.exports = async function (db, option) {
  const collection = option.collection;

  if (option.type === "find") {
    const query = option.query;
    const docs = await findAsync(collection, query);
    return docs;
  } else if (option.type === "insertOne") {
    const item = option.item;
    const r = insertOneAsync(collection, item);
    return r;
  }
};
