const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: [{
    type: String
  }],
  releaseDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // بالدقائق
  },
  posterImage: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  videoUrl: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  director: {
    type: String
  },
  cast: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  isNew: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);
