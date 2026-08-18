import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  backendUrl: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
};
