var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Match", matchSchema);
