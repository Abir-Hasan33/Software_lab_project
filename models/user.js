const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/algo");

let userSchema = mongoose.Schema({
   name : String,
   password : String,
   email : String,
    username : String,
});

module.exports = mongoose.model("user", userSchema);
