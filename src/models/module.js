const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  //relacion con el schema lecture
  lectures: [{
    type: Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  description: {
    type: String,
  },
  order: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Module', moduleSchema);
