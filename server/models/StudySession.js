const mongoose = require('mongoose');
const StudySchema = new mongoose.Schema({
  topic: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pomodoroMinutes: { type: Number, default: 25 },
  maxParticipants: Number
},{ timestamps: true });
module.exports = mongoose.model('StudySession', StudySchema);
