
module.exports = function (app, dbs) {
  const db = dbs.dev;
  const config = app.get("globalConfig");
  const option = {
    db: db,
    config: config
  };
  const tucaoRouter = require("./tucao")(option);
  const cityRouter = require("./city")(option);
  const provinceRouter = require("./province")(option);
  const resortRouter = require("./resort")(option);
  const userRouter = require("./user")(option);
  const adminRouter = require("./admin")(option);

  // add more middleware
  app.use("/tucao", tucaoRouter);
  app.use("/city", cityRouter);
  app.use("/province", provinceRouter);
  app.use("/resort", resortRouter);
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);

  return app;
};
