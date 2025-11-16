const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: { type: String, required:true },
  description: String,
  date: { type: Date, required:true },
  venue: String,
  location: { lat: Number, lng: Number },
  capacity: Number,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true });
module.exports = mongoose.model('Event', EventSchema);
