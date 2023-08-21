const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Other fields you want to store for each user
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
