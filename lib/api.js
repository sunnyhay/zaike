
// own lib
const dbUtil = require("./db-util");

async function find(db, option) {
  const result = await dbUtil(db, option);
  return result;
}

module.exports = {
  find
};
