const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const lib = require("./lib/db");


app.get("/", function (req, res) {
  res.send("Hello Jerry Sun");
  console.log("Cookies: ", req.cookies);

});

// This responds a POST request for the homepage
app.post("/", function (req, res) {
  console.log("Got a POST request for the homepage");
  res.send("Hello POST");
});

// This responds a DELETE request for the /del_user page.
app.delete("/del_user", function (req, res) {
  console.log("Got a DELETE request for /del_user");
  res.send("Hello DELETE");
});

// This responds a GET request for the /list_user page.
app.get("/list_user", function (req, res) {
  console.log("Got a GET request for /list_user");
  res.send("Page Listing");
});

// This responds a GET request for the /getDocs page.
app.get("/getDocs", function (req, res) {
  console.log("Got a GET request for /getDocs");
  lib.getDocs().then(result => {
    console.info("final result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  }).catch(e => {
    console.error(e);
    res.send(e);
  });
});

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get("/ab*cd", function(req, res) {
  console.log("Got a GET request for /ab*cd");
  res.send("Page Pattern Match");
});

let server = app.listen(8081, function () {

  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
