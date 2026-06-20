const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    default: null
  },
  series: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
    default: null
  },
  episode: {
    episodeNumber: Number,
    seasonNumber: Number
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  watchedDuration: {
    type: Number, // بالثواني
    default: 0
  },
  totalDuration: {
    type: Number, // بالثواني
    required: true
  },
  isFinished: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
