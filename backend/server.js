const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streaming-platform')
  .then(() => console.log('✅ MongoDB متصل'))
  .catch(err => console.log('❌ خطأ الاتصال:', err));

// Routes
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const seriesRoutes = require('./routes/series');
const usersRoutes = require('./routes/users');
const watchHistoryRoutes = require('./routes/watchHistory');

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/watch-history', watchHistoryRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server is running' });
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('👤 مستخدم جديد متصل:', socket.id);

  socket.on('disconnect', () => {
    console.log('👤 مستخدم قطع الاتصال:', socket.id);
  });

  socket.on('new-episode', (data) => {
    io.emit('notification', {
      message: `حلقة جديدة من ${data.seriesName}`,
      seriesId: data.seriesId
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});

module.exports = { app, io };
