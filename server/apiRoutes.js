const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Photo = require('./models/Photo');
const Rating = require('./models/Rating');
const authMiddleware = require('./middleware/auth');
const upload = require('./utils/upload');

const router = express.Router();

// Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, gender, age } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, gender, age, points: 0 });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'mysecretkey', { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email, name, gender, age, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, 'mysecretkey', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email, name: user.name, gender: user.gender, age: user.age, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password Reset Request (simplified, without email sending)
router.post('/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    res.json({ message: 'Reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password Reset
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload Photo
router.post('/photos/upload', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const photo = new Photo({
      userId: req.user.id,
      url: req.file.path,
      isActive: false,
    });
    await photo.save();
    res.status(201).json({ photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Photo Active Status
router.put('/photos/:id/toggle-active', authMiddleware, async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    const user = await User.findById(req.user.id);
    if (!photo.isActive && user.points <= 0) {
      return res.status(400).json({ error: 'Not enough points to activate photo' });
    }
    photo.isActive = !photo.isActive;
    await photo.save();
    res.json({ photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Photos for Rating with Filters
router.get('/photos/rate', authMiddleware, async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const user = await User.findById(req.user.id);
    const ratedPhotoIds = await Rating.find({ userId: req.user.id }).distinct('photoId');
    const filters = {
      isActive: true,
      userId: { $ne: req.user.id },
      _id: { $nin: ratedPhotoIds },
    };
    if (gender) filters['userId.gender'] = gender;
    if (minAge || maxAge) {
      filters['userId.age'] = {};
      if (minAge) filters['userId.age'].$gte = Number(minAge);
      if (maxAge) filters['userId.age'].$lte = Number(maxAge);
    }
    const photos = await Photo.aggregate([
      { $match: filters },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { url: 1, userId: 1, 'user.name': 1, 'user.age': 1, 'user.gender': 1 } },
    ]);
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate Photo
router.post('/photos/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    const photo = await Photo.findById(req.params.id);
    if (!photo || !photo.isActive) {
      return res.status(404).json({ error: 'Photo not found or inactive' });
    }
    if (photo.userId.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot rate own photo' });
    }
    const existingRating = await Rating.findOne({ photoId: req.params.id, userId: req.user.id });
    if (existingRating) {
      return res.status(400).json({ error: 'Photo already rated' });
    }
    const newRating = new Rating({
      photoId: req.params.id,
      userId: req.user.id,
      rating: Number(rating),
    });
    await newRating.save();
    const photoOwner = await User.findById(photo.userId);
    photoOwner.points -= 1;
    await photoOwner.save();
    const rater = await User.findById(req.user.id);
    rater.points += 1;
    await rater.save();
    res.status(201).json({ rating: newRating, points: rater.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Statistics
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    const userPhotos = await Photo.find({ userId: req.user.id });
    const photoIds = userPhotos.map(p => p._id);
    const ratings = await Rating.find({ photoId: { $in: photoIds } });
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0;
    const user = await User.findById(req.user.id);
    res.json({
      points: user.points,
      totalPhotos: userPhotos.length,
      activePhotos: userPhotos.filter(p => p.isActive).length,
      totalRatings,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
