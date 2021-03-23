const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  profesor: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default: "https://media-exp1.licdn.com/dms/image/C4E0BAQGy6GZmHb_SXA/company-logo_200_200/0/1603651276024?e=1619654400&v=beta&t=kRb_lMNqQF3oGVL9IrNYVxKdJf1qDW3FNTRdSeIu4zI"
  },
  duration: {
    type: String
  },
  lecture:
    { type: Schema.Types.ObjectId, ref: 'Lecture' }

});

module.exports = mongoose.model('Video', videoSchema);
