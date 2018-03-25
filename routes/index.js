
module.exports = function(app, dbs) {
  const db = dbs.dev;
  const tucaoRouter = require("./tucao")(db);

  // add more middleware
  app.use("/tucao", tucaoRouter);

  return app;
};
