// make user schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  pool: {
    type: Schema.Types.ObjectId,
    ref: "Pool",
  },
});

module.exports = mongoose.model("User", userSchema);
