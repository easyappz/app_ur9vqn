const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', PhotoSchema);
