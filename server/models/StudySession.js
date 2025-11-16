// models/StudySession.js
const mongoose = require('mongoose');
const StudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: String,
  duration: Number, // minutes
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  completedAt: { type: Date, default: Date.now }, // ⬅ REQUIRED
  maxParticipants: Number
},{ timestamps: true });

module.exports = mongoose.model('StudySession', StudySchema);
