
// lib
const dbClient = require("mongodb").MongoClient;

const logger = require("./logger");
const log = logger.getLogger("db");

// configuration
const dbConfig = require("../config/dev-env.json");
const host = dbConfig.host, port = dbConfig.port;


// Connection URL
const url = `mongodb://${host}:${port}`;

// Database Name
const dbName = dbConfig.db.name;

// target table
const review_table = dbConfig.db.review_table;

// Use connect method to connect to the server
exports.getDocs = function () {
  return new Promise(
    (resolve, reject) => {
      dbClient.connect(url, async (err, client) => {
        if (err) reject(err);
        else {
          log.info("Connected successfully to server");

          const db = client.db(dbName);

          // insertDocuments(db, result => {
          //   log.info(result);
          //   client.close();
          // });

          // const findPromise = findDocumentsAsync(db);
          // findPromise.then(docs => {
          //   log.info(docs);
          //   client.close();
          // }).catch(err => {
          //   log.error(err);
          //   client.close();
          // });

          const result = await findDocsAysnc(db, client);
          log.info("result: " + JSON.stringify(result));
          resolve(result);
        }

      });
    }
  );

};

// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection(review_table);
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     log.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// };

function findDocuments(db) {
  return new Promise((resolve, reject) => {
    // Get the documents collection
    const collection = db.collection(review_table);
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      if (err) reject(err);
      log.info("Found the following records");
      resolve(docs);
    });
  });
}

async function findDocsAysnc(db, client) {
  const docs = await findDocuments(db);
  log.info(docs);
  client.close();
  return docs;
}

