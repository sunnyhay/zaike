
module.exports = function (app, dbs, redisClient) {
  const db = dbs.dev;
  const config = app.get("globalConfig");
  const option = {
    db,
    redisClient,
    config
  };
  const tucaoRouter = require("./tucao")(option);
  const cityRouter = require("./city")(option);
  const provinceRouter = require("./province")(option);
  const resortRouter = require("./resort")(option);
  const userRouter = require("./user")(option);
  const adminRouter = require("./admin")(option);
  const newsRouter = require("./news")(option);
  const imageRouter = require("./image")(option);
  const cacheRouter = require("./cache")(option);

  // add more middleware
  app.use("/tucao", tucaoRouter);
  app.use("/city", cityRouter);
  app.use("/province", provinceRouter);
  app.use("/resort", resortRouter);
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);
  app.use("/news", newsRouter);
  app.use("/image", imageRouter);
  app.use("/cache", cacheRouter);

  return app;
};
