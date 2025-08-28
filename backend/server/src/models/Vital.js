const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  heartRate: Number,
  spo2: Number,
  temperature: Number
}, { timestamps: true })
module.exports = mongoose.model('Vital', schema)
