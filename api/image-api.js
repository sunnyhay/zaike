
// lib
const fs = require("fs");
const uuidv4 = require("uuid/v4");

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("image-api");
const dbUtil = require("../lib/db-util");

// add an image
async function insertImage(db, option) {
  const imagePath = "./images/" + option.record.filename;
  const imageObj = fs.readFileSync(imagePath);
  // encode the file as a base64 string.
  const encImg = imageObj.toString("base64");
  option.record.id = uuidv4();
  option.record.img = Buffer(encImg, "base64");
  let result = await dbUtil(db, option);
  const newsId = result.insertedId;
  log.info("New created news object id: " + newsId);
  return newsId;
}


module.exports = {
  insertImage
};
