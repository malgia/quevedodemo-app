const mongoose = require('mongoose');

const motorcycleSchema = new mongoose.Schema({
  plateid: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  expiredate: {
    type: String,
    trim: true,
  },
  passengers: {
    type: Number,
    trim: true,
  },
});

module.exports = mongoose.model('Motorcycle', motorcycleSchema);
