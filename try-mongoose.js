// getting-started.js
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.info("connected!");
  var kittySchema = mongoose.Schema({
    name: String
  });
  // NOTE: methods must be added to the schema before compiling it with mongoose.model()
  kittySchema.methods.speak = function () {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  };

  var Kitten = mongoose.model("Kitten", kittySchema);
  var silence = new Kitten({ name: "Silence" });
  silence.save(function (err, silence) {
    if (err) return console.error(err);
    silence.speak();
    console.log(silence.name); // 'Silence'
    silence.speak();
    db.close();
  });

});
