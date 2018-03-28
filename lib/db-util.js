
// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("tucao");


// function find(collection, query, cb) {
//   collection.find(query).toArray(function (err, docs) {
//     if (err) return cb(err, null);
//     log.info(docs);
//     cb(null, docs);
//   });
// }

function findAsync(collection, query) {
  return new Promise((resolve, reject) => {
    collection.find(query).toArray(function (err, docs) {
      if (err) reject(err);
      log.debug(docs);
      resolve(docs);
    });
  });
}


// function insertOne(collection, item, cb) {
//   collection.insertOne(item, (err, r) => {
//     if (err) return cb(err, null);
//     log.info(r.result);
//     cb(null, r);
//   });
// }

function insertOneAsync(collection, item) {
  return new Promise((resolve, reject) => {
    collection.insertOne(item, (err, r) => {
      if (err) reject(err);
      log.debug(r.result);
      resolve(r);
    });
  });
}

module.exports = async function(db, option) {
  const collection = option.collection;

  if (option.type === "find") {
    const query = option.query;
    // return find(collection, query, callback);
    // findAsync(collection, query).then(docs => {
    //   callback(null, docs);
    // }).catch(err => {
    //   callback(err, null);
    // });
    const docs = await findAsync(collection, query);
    return docs;
  } else if (option.type === "insertOne") {
    const item = option.item;
    // return insertOne(collection, item, callback);
    const r = insertOneAsync(collection, item);
    return r;
  }
};
