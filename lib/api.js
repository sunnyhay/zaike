
// own lib
const dbUtil = require("./db-util");

async function find(db, option) {
  const result = await dbUtil(db, option);
  return result;
}

// given a tucao, need to do the following jobs
// 1. add it into tucao table;
// 2. add it to the user's tucao array, increment tucaoNum and if tucaoNum reaches the next leve, increase the user's level. update modified time.
// 3. update city's tucao and other minor-tucao arrays, update modified time.
// 4. if resort is not null, update resort's tucao and other minor-tucao arrays, update modified time.
async function insertTucao(db, option) {
  option.type = "insertOne";
  const result = await dbUtil(db, option);
  return result;
}


module.exports = {
  find,
  insertTucao
};
