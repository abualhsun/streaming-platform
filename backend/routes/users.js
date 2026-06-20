const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// الحصول على ملف المستخدم
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'name profileImage')
      .populate('favoriteMovies', 'title posterImage')
      .populate('favoriteSeries', 'title posterImage');

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إرسال طلب صداقة
router.post('/:id/add-friend', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // التحقق من عدم وجود طلب صداقة مسبق
    const alreadyRequested = targetUser.friendRequests.some(
      request => request.from.toString() === req.user.id
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: 'تم إرسال طلب صداقة بالفعل' });
    }

    targetUser.friendRequests.push({ from: req.user.id });
    await targetUser.save();

    res.json({ message: 'تم إرسال طلب الصداقة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// قبول طلب صداقة
router.post('/accept-friend/:friendId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.friendId);

    if (!friend) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // إزالة الطلب من قائمة الطلبات
    user.friendRequests = user.friendRequests.filter(
      request => request.from.toString() !== req.params.friendId
    );

    // إضافة الصديق
    if (!user.friends.includes(req.params.friendId)) {
      user.friends.push(req.params.friendId);
    }
    if (!friend.friends.includes(req.user.id)) {
      friend.friends.push(req.user.id);
    }

    await user.save();
    await friend.save();

    res.json({ message: 'تم قبول طلب الصداقة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة فيلم للمفضلة
router.post('/favorites/movie/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favoriteMovies.includes(req.params.movieId)) {
      user.favoriteMovies.push(req.params.movieId);
      await user.save();
    }

    res.json({ message: 'تم إضافة الفيلم للمفضلة' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة مسلسل للمفضلة
router.post('/favorites/series/:seriesId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favoriteSeries.includes(req.params.seriesId)) {
      user.favoriteSeries.push(req.params.seriesId);
      await user.save();
    }

    res.json({ message: 'تم إضافة المسلسل للمفضلة' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تحديث ملف المستخدم
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, profileImage, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({
      message: 'تم تحديث الملف بنجاح',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
