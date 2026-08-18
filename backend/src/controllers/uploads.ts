import { Request, Response, NextFunction } from 'express';
import { uploadFile as uploadFileService, getFile as getFileService } from '../services/storageService';
import { config } from '../config';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Upload file
 */
export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }
    
    const filePath = await uploadFileService(req.file);
    const filename = path.basename(filePath);
    
    res.status(201).json({
      message: 'File uploaded successfully',
      filename,
      url: `${config.backendUrl}/uploads/${filename}`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get file
 */
export const getFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filenameParam = req.params.filename;
    if (typeof filenameParam !== 'string') {
      res.status(400).json({ error: 'Invalid filename' });
      return;
    }
    const filename = filenameParam;
    
    const filePath = await getFileService(filename);
    
    // Check if file exists
    const fs = await import('fs');
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
