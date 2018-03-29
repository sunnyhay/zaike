
module.exports = function(app, dbs) {
  const db = dbs.dev;
  const tucaoRouter = require("./tucao")(db);
  const cityRouter = require("./city")(db);
  const provinceRouter = require("./province")(db);
  const resortRouter = require("./resort")(db);

  // add more middleware
  app.use("/tucao", tucaoRouter);
  app.use("/city", cityRouter);
  app.use("/province", provinceRouter);
  app.use("/resort", resortRouter);


  return app;
};
