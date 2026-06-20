# 🚀 Streaming Platform Backend

خادم API لمنصة المشاهدة

## 📋 المتطلبات

- Node.js (v14 أو أعلى)
- MongoDB
- npm أو yarn

## ⚙️ التثبيت

```bash
cd backend
npm install
```

## 🔧 إعداد البيئة

1. أنشئ ملف `.env` من `.env.example`:

```bash
cp .env.example .env
```

2. عدّل `.env` بقيمك:

```
MONGODB_URI=mongodb://localhost:27017/streaming-platform
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## ▶️ تشغيل الخادم

### وضع التطوير:
```bash
npm run dev
```

### وضع الإنتاج:
```bash
npm start
```

الخادم سيعمل على `http://localhost:5000`

## 📚 API Endpoints

### المصادقة
- `POST /api/auth/register` - تسجيل حساب جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم (محمي)

### الأفلام
- `GET /api/movies` - الحصول على جميع الأفلام
- `GET /api/movies/:id` - الحصول على فيلم واحد
- `POST /api/movies` - إضافة فيلم جديد (محمي)
- `PUT /api/movies/:id` - تحديث فيلم (محمي)
- `DELETE /api/movies/:id` - حذف فيلم (محمي)

### المسلسلات
- `GET /api/series` - الحصول على جميع المسلسلات
- `GET /api/series/:id` - الحصول على مسلسل واحد
- `POST /api/series` - إضافة مسلسل (محمي)
- `POST /api/series/:id/episodes` - إضافة حلقة (محمي)
- `PUT /api/series/:id` - تحديث مسلسل (محمي)
- `DELETE /api/series/:id` - حذف مسلسل (محمي)

### المستخدمون
- `GET /api/users/:id` - الحصول على ملف مستخدم
- `POST /api/users/:id/add-friend` - إرسال طلب صداقة (محمي)
- `POST /api/users/accept-friend/:friendId` - قبول طلب صداقة (محمي)
- `POST /api/users/favorites/movie/:movieId` - إضافة فيلم للمفضلة (محمي)
- `POST /api/users/favorites/series/:seriesId` - إضافة مسلسل للمفضلة (محمي)
- `PUT /api/users/profile` - تحديث الملف الشخصي (محمي)

### سجل المشاهدات
- `GET /api/watch-history` - الحصول على سجل المشاهدات (محمي)
- `POST /api/watch-history/add` - إضافة مشاهدة (محمي)
- `PUT /api/watch-history/:id` - تحديث سجل المشاهدة (محمي)

## 🔐 المصادقة

استخدم Bearer Token في رؤوس الطلب:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📦 هيكل المشروع

```
backend/
├── models/           # نماذج Mongoose
├─�� routes/           # Routes الـ API
├── middleware/       # Middleware مخصص
├── server.js         # نقطة الدخول
├── .env.example      # مثال على متغيرات البيئة
└── package.json
```

## 🛠️ التكنولوجيا المستخدمة

- **Express.js** - إطار عمل الويب
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT** - المصادقة
- **Socket.io** - الاتصالات الفورية
- **bcryptjs** - تشفير كلمات المرور

## 📝 الترخيص

MIT
