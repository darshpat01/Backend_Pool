var mongoose = require("mongoose");
var User = require("./user");
var Schema = mongoose.Schema;

var poolSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Pool", poolSchema);
