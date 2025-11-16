const mongoose = require('mongoose');
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  available: { type: Boolean, default: true },
  pickupLocation: String,
  images: [String],
  category: String
},{ timestamps: true });
module.exports = mongoose.model('Resource', ResourceSchema);
