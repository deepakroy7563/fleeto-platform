import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import bikeRoutes from './routes/bikeRoutes.js';
import partRoutes from './routes/partRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/error.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Static folder for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room based on user ID (for dealers)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  // Special room for admins
  socket.on('join_admin', () => {
    socket.join('admin_room');
    console.log('An admin joined the admin room');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Fleeto API is running...');
});

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
