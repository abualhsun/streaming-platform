const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true
  },
  seasonNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // بالدقائق
    required: true
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  isNew: {
    type: Boolean,
    default: false
  }
});

const seriesSchema = new mongoose.Schema({
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
  posterImage: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
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
  totalSeasons: {
    type: Number,
    default: 1
  },
  episodes: [episodeSchema],
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

module.exports = mongoose.model('Series', seriesSchema);
