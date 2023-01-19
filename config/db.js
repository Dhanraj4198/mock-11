const mongoose = require("mongoose");

require("dotenv").config();

const connection = mongoose.connect(
  "mongodb+srv://jagtapdhanraj:jagtapdhanraj@cluster0.ceu0jbc.mongodb.net/mock11?retryWrites=true&w=majority"
);

module.exports = { connection };
