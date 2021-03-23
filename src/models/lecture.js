const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUkdqSs3prGXU-OwcoePW6v7jLnoJ5TXv8zQ&usqp=CAU'
  },
  description: String,
  video: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }],
  urlLecture: {
    type: String
  },
  modulo: {
    type: Schema.Types.ObjectId,
    ref: 'Module'
  },
  moduloName: {
    type: String,
  }
});

module.exports = mongoose.model('Lecture', lectureSchema);
