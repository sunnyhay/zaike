
function findAsync(collection, query) {
  return new Promise((resolve, reject) => {
    collection.find(query).toArray(function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
}

function insertOneAsync(collection, record) {
  return new Promise((resolve, reject) => {
    collection.insertOne(record, (err, r) => {
      if (err) reject(err);
      resolve(r);
    });
  });
}

function deleteOneAsync(collection, option) {
  return new Promise((resolve, reject) => {
    collection.deleteOne(option.criteria, (err, r) => {
      if (err) reject(err);
      resolve(r);
    });
  });
}

function deleteManyAsync(collection, option) {
  return new Promise((resolve, reject) => {
    collection.deleteOne(option.criteria, (err, r) => {
      if (err) reject(err);
      resolve(r);
    });
  });
}

function updateOneAsync(collection, option) {
  return new Promise((resolve, reject) => {
    const criteria = option.criteria;
    const update = option.update;
    collection.updateOne(criteria, update, (err, r) => {
      if (err) reject(err);
      resolve(r);
    });
  });
}

function updateManyAsync(collection, option) {
  return new Promise((resolve, reject) => {
    const criteria = option.criteria;
    const update = option.update;
    collection.updateOne(criteria, update, (err, r) => {
      if (err) reject(err);
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
  } else if (option.type === "deleteOne") {
    const r = deleteOneAsync(collection, option);
    return r;
  } else if (option.type === "deleteMany") {
    const r = deleteManyAsync(collection, option);
    return r;
  } else if (option.type === "updateOne") {
    const r = updateOneAsync(collection, option);
    return r;
  } else if (option.type === "updateMany") {
    const r = updateManyAsync(collection, option);
    return r;
  } else if (option.type === "findOneAndReplace") {
    const r = findOneAndReplaceAsync(collection, option);
    return r;
  }
};
