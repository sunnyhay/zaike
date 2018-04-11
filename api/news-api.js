
// lib
const fs = require("fs");

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("news-api");
const dbUtil = require("../lib/db-util");

// add a news
async function insertNews(db, option) {
  // TODO: use separated image table and load it when the server is started!
  const imagePath = "./jerry.JPG";


  const imageObj = fs.readFileSync(imagePath);
  // encode the file as a base64 string.
  const encImg = imageObj.toString("base64");
  option.type = "insertOne";
  option.record.description = "image of Jerry";
  option.record.contentType = "image/jpeg";
  option.record.img = Buffer(encImg, "base64");
  let result = await dbUtil(db, option);
  const newsId = result.insertedId;
  log.info("New created news object id: " + newsId);
  return newsId;
}


module.exports = {
  insertNews
};
