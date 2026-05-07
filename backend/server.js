const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const disasterRoutes = require('./src/routes/disasterRoutes');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const alertRoutes = require('./src/routes/alertRoutes');
const communityRoutes = require('./src/routes/communityRoutes');

const { setIo } = require('./src/services/ioService');   // new
const { runAlertEngine } = require('./src/services/alertService'); // new

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', credentials: true }
});

// Make io globally available via ioService
setIo(io);

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

// Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/disaster', disasterRoutes);
app.use('/api/community', communityRoutes);

// Static GeoJSON
const path = require('path');
app.use('/api/geojson', express.static(path.join(__dirname, 'data')));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  }
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Start alert engine ONLY after server is listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initial alert engine run
  runAlertEngine();
  // Schedule every 15 minutes
  const cron = require('node-cron');
  cron.schedule('*/15 * * * *', () => {
    runAlertEngine();
  });
});