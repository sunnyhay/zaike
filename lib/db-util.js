
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

function insertOneAsync(collection, record) {
  return new Promise((resolve, reject) => {
    collection.insertOne(record, (err, r) => {
      if (err) reject(err);
      // log.debug(r.result);
      resolve(r);
    });
  });
}

function updateOneAsync(collection, option) {
  return new Promise((resolve, reject) => {
    const criteria = option.criteria;
    const update = option.update;
    // log.info("--------debug--------");
    collection.updateOne(criteria, update, (err, r) => {
      if (err) reject(err);
      // log.debug(r.result);
      resolve(r);
    });
  });
}

function findOneAndReplaceAsync(collection, option) {
  return new Promise((resolve, reject) => {
    const criteria = option.criteria;
    const replace = option.replace;
    collection.findOneAndReplace(criteria, replace, (err, r) => {
      if (err) reject(err);
      // log.debug(r.result);
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
    const record = option.record;
    const r = insertOneAsync(collection, record);
    return r;
  } else if (option.type === "updateOne") {
    const r = updateOneAsync(collection, option);
    return r;
  } else if (option.type === "findOneAndReplace") {
    const r = findOneAndReplaceAsync(collection, option);
    return r;
  }
};
