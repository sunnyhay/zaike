
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://sunnyhay:sh771919@zaike-4lo9s.mongodb.net/zaike";

MongoClient.connect(uri, function (err, client) {
  if (err) {
    return console.error(err);
  }
  const collection = client.db("zaike").collection("city");
  collection.find({}).toArray(function (err, docs) {
    if (err) return console.error(err);
    console.info(docs);
  });
  // perform actions on the collection object
  client.close();
});
