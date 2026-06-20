const express = require('express');
const Series = require('../models/Series');
const auth = require('../middleware/auth');

const router = express.Router();

// الحصول على جميع المسلسلات
router.get('/', async (req, res) => {
  try {
    const { genre, sort, page = 1, limit = 20 } = req.query;

    let query = {};
    if (genre) {
      query.genre = genre;
    }

    const skip = (page - 1) * limit;
    let sortBy = { createdAt: -1 };
    if (sort === 'rating') {
      sortBy = { rating: -1 };
    } else if (sort === 'views') {
      sortBy = { views: -1 };
    }

    const series = await Series.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    const total = await Series.countDocuments(query);

    res.json({
      series,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الحصول على مسلسل واحد
router.get('/:id', async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!series) {
      return res.status(404).json({ message: 'المسلسل غير موجود' });
    }

    res.json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة مسلسل جديد
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, genre, posterImage, director, cast, episodes } = req.body;

    const series = new Series({
      title,
      description,
      genre,
      posterImage,
      director,
      cast,
      episodes: episodes || [],
      isNew: true
    });

    await series.save();

    res.status(201).json({
      message: 'تم إضافة المسلسل بنجاح',
      series
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة حلقة جديدة
router.post('/:id/episodes', auth, async (req, res) => {
  try {
    const { episodeNumber, seasonNumber, title, description, videoUrl, duration } = req.body;

    const series = await Series.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          episodes: {
            episodeNumber,
            seasonNumber,
            title,
            description,
            videoUrl,
            duration,
            isNew: true
          }
        }
      },
      { new: true }
    );

    if (!series) {
      return res.status(404).json({ message: 'المسلسل غير موجود' });
    }

    res.json({
      message: 'تم إضافة الحلقة بنجاح',
      series
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تحديث مسلسل
router.put('/:id', auth, async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!series) {
      return res.status(404).json({ message: 'المسلسل غير موجود' });
    }

    res.json({
      message: 'تم تحديث المسلسل بنجاح',
      series
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// حذف مسلسل
router.delete('/:id', auth, async (req, res) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);

    if (!series) {
      return res.status(404).json({ message: 'المسلسل غير موجود' });
    }

    res.json({ message: 'تم حذف المسلسل بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
