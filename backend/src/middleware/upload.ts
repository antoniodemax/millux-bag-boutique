import multer from 'multer';
import { Request } from 'express';
import { config } from '../config';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req: Request, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter - only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
