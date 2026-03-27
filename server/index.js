import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import freelancerRoutes from './routes/freelancerRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  'http://localhost:5173,https://freelancer-lilac-eight.vercel.app,https://freelancer-role.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const requestCounts = new Map();

const isAllowedVercelPreview = (origin) => {
  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

const createRateLimiter = ({ windowMs, maxRequests }) => (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now - entry.start > windowMs) {
    requestCounts.set(key, { count: 1, start: now });
    return next();
  }

  if (entry.count >= maxRequests) {
    return res.status(429).json({ message: 'Too many requests, please try again later' });
  }

  entry.count += 1;
  return next();
};

app.use(securityHeaders);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || isAllowedVercelPreview(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));
app.use('/auth', createRateLimiter({ windowMs: 1000 * 60 * 15, maxRequests: 40 }));
app.use('/ai', createRateLimiter({ windowMs: 1000 * 60 * 5, maxRequests: 20 }));


// Attach Routes
app.use('/auth', authRoutes);
app.use('/freelancer', freelancerRoutes);
app.use('/project', projectRoutes);
app.use('/application', applicationRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/ai', aiRoutes);

const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.log(`DB connection error: ${err}`));
