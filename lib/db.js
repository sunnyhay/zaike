
// lib
const db_client = require("mongodb").MongoClient;

// configuration
const runtime_config = require("../config/dev-env.json");
const host = runtime_config.host, port = runtime_config.port;


// Connection URL
const url = `mongodb://${host}:${port}`;

// Database Name
const dbName = runtime_config.db.name;

// target table
const review_table = runtime_config.db.review_table;

// Use connect method to connect to the server
db_client.connect(url, (err, client) => {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // insertDocuments(db, result => {
  //   console.info(result);
  //   client.close();
  // });

  // const findPromise = findDocumentsAsync(db);
  // findPromise.then(docs => {
  //   console.info(docs);
  //   client.close();
  // }).catch(err => {
  //   console.error(err);
  //   client.close();
  // });

  findDocsAysnc(db, client);
});

// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection(review_table);
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     console.log("Inserted 3 documents into the collection");
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
      console.log("Found the following records");
      resolve(docs);
    });
  });
}

async function findDocsAysnc(db, client) {
  const docs = await findDocuments(db);
  console.info(docs);
  client.close();
}

