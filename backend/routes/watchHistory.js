const express = require('express');
const WatchHistory = require('../models/WatchHistory');
const auth = require('../middleware/auth');

const router = express.Router();

// الحصول على سجل المشاهدات
router.get('/', auth, async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user.id })
      .populate('movie', 'title posterImage')
      .populate('series', 'title posterImage')
      .sort({ watchedAt: -1 })
      .limit(20);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة مشاهدة جديدة
router.post('/add', auth, async (req, res) => {
  try {
    const { movie, series, episode, watchedDuration, totalDuration } = req.body;

    const watchRecord = new WatchHistory({
      user: req.user.id,
      movie,
      series,
      episode,
      watchedDuration,
      totalDuration,
      isFinished: (watchedDuration / totalDuration) > 0.9 // إذا شاهد 90% من المحتوى
    });

    await watchRecord.save();

    res.status(201).json({
      message: 'تم تسجيل المشاهدة',
      watchRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تحديث سجل المشاهدة
router.put('/:id', auth, async (req, res) => {
  try {
    const { watchedDuration, totalDuration } = req.body;

    const watchRecord = await WatchHistory.findByIdAndUpdate(
      req.params.id,
      {
        watchedDuration,
        isFinished: (watchedDuration / totalDuration) > 0.9
      },
      { new: true }
    );

    if (!watchRecord) {
      return res.status(404).json({ message: 'السجل غير موجود' });
    }

    res.json({
      message: 'تم تحديث السجل',
      watchRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
