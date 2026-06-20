const express = require('express');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// الحصول على جميع الأفلام
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

    const movies = await Movie.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
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

// الحصول على فيلم واحد
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'الفيلم غير موجود' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة فيلم جديد (للمسؤولين فقط)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, genre, releaseDate, duration, posterImage, videoUrl, director, cast } = req.body;

    const movie = new Movie({
      title,
      description,
      genre,
      releaseDate,
      duration,
      posterImage,
      videoUrl,
      director,
      cast,
      isNew: true
    });

    await movie.save();

    res.status(201).json({
      message: 'تم إضافة الفيلم بنجاح',
      movie
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تحديث فيلم
router.put('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'الفيلم غير موجود' });
    }

    res.json({
      message: 'تم تحديث الفيلم بنجاح',
      movie
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// حذف فيلم
router.delete('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'الفيلم غير موجود' });
    }

    res.json({ message: 'تم حذف الفيلم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
