import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // link medicine to a user (elderly patient)

  name: { type: String, required: true },           // e.g. "Metformin"
  dosage: { type: String, required: true },         // e.g. "500mg"
  frequency: { type: String, required: true },      // e.g. "Twice daily"
  times: { type: [String], required: true },        // e.g. ["08:00", "20:00"]
  startDate: { type: Date, default: Date.now },     // when to start taking
  endDate: { type: Date },                          // optional: when to stop
  instructions: { type: String },                   // e.g. "Take after food"
}, { timestamps: true })

export default mongoose.model('Medicine', schema)
