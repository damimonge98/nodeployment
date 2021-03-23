const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
    default: ""
  },

  lastName: {
    type: String,
    default: ""
  },

  companyName: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    select: false //cuando se hace GET, no trae la contraseña por seguridad.
  },

  role: {
    type: String,
    enum: ['guest', 'student', 'instructor', 'company', 'banned'],
    default: 'guest'
  },

  currentModule: {
    type: Number,
    default: 0
  },

  avatar: {
    type: String
  },

  githubId: {
    type: String
  },

  googleId: {
    type: String
  },

  githubUsername: {
    type: String,
    default: ""
  },

  debt: {
    type: Number,
    default: 0
  },

  verifiedCompany: {
    type: Boolean,
    default: false
  },

  jobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleo',
  }],

  isSuperAdmin: {
    type: Boolean,
    default: false
  },

  removed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);
