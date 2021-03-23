const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enterpriseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  password: {
    type: String,
    select: false, //cuando se hace GET, no trae la contraseña por seguridad.
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  verified:{
    type: Boolean,
    default: false
  },
  empleos: [{
    type: Schema.Types.ObjectId,
    ref: 'Empleo'
  }]
});

module.exports = mongoose.model("Empresa", enterpriseSchema);
