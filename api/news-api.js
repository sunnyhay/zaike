
// lib
const fs = require("fs");
const uuidv4 = require("uuid/v4");

// own lib
const logger = require("../lib/logger");
const log = logger.getLogger("news-api");
const dbUtil = require("../lib/db-util");

// add a news
async function insertNews(db, option) {
  option.record.id = uuidv4();
  const images = [];
  for(let i = 0; i < option.record.images.length; i++) {
    const image = {};
    const imageInfo = option.record.images[i];
    const imagePath = "./images/" + imageInfo.filename;
    const imageObj = fs.readFileSync(imagePath);
    // encode the file as a base64 string.
    const encImg = imageObj.toString("base64");
    image.img = Buffer(encImg, "base64");
    image.filename = imageInfo.filename;
    image.description = imageInfo.description;
    image.name = imageInfo.name;
    image.contentType = imageInfo.contentType;
    images.push(image);
  }
  option.record.images = images;
  let result = await dbUtil(db, option);
  const objectId = result.insertedId;
  log.info("New created news object id: " + objectId);
  return objectId;
}


module.exports = {
  insertNews
};
