const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const jobSchema = new Schema({
  logo: {
    type: String,
    default:
      "https://media-exp1.licdn.com/dms/image/C4E0BAQGy6GZmHb_SXA/company-logo_200_200/0/1603651276024?e=1619654400&v=beta&t=kRb_lMNqQF3oGVL9IrNYVxKdJf1qDW3FNTRdSeIu4zI",
  },

  companyName: {
    type: String,
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  remote: {
    type: Boolean,
  },
  location: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
  },

  end: {
    type: String,
  },

  linkedIn: {
    type: String,
    required: true,
  },

  enterprise: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Empleo", jobSchema);
