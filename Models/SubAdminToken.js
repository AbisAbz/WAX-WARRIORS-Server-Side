const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subAdminTokenSchema = new Schema({
  subAdminId: {
    type: Schema.Types.ObjectId,
    ref: "SubAdmin",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },

});

const Token = mongoose.model("Propowntoken", subAdminTokenSchema);

module.exports = Token;