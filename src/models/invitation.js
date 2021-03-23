const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },

  githubUsername: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Invitation', invitationSchema);
