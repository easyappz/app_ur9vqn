const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  ratedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rating', RatingSchema);
