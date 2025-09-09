const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
  sender: String,
  getter: String,
  content: String,
  room: String,
  date: String
});

exports.MessageSchema = MessageSchema