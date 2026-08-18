import { config } from '../config';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

/**
 * Storage abstraction layer
 * Designed for easy replacement with AWS S3, Cloudflare R2, or other providers
 */
export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = config.uploadDir;
    // Ensure upload directory exists
    const { promises: fs } = require('fs');
    fs.mkdir(this.uploadDir, { recursive: true }).catch(console.error);
  }

  /**
   * Upload a file
   * @param file - Multer file object
   * @returns Promise resolving to the file path
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Generate unique filename with UUID to avoid collisions
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);
    
    // Move file to destination
    const { promises: fs } = require('fs');
    await fs.rename(file.path, filePath);
    
    return filePath;
  }

  /**
   * Get file path by filename
   * @param filename - The filename to retrieve
   * @returns Promise resolving to the absolute file path
   */
  async getFile(filename: string): Promise<string> {
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.startsWith('/')) {
      throw new Error('Invalid filename');
    }
    
    const filePath = path.join(this.uploadDir, filename);
    
    // Check if file exists
    const { promises: fs } = require('fs');
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error('File not found');
    }
    
    return filePath;
  }

  /**
   * Delete a file
   * @param filename - The filename to delete
   * @returns Promise resolving to boolean indicating success
   */
  async deleteFile(filename: string): Promise<boolean> {
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.startsWith('/')) {
      throw new Error('Invalid filename');
    }
    
    const filePath = path.join(this.uploadDir, filename);
    
    // Check if file exists and delete it
    const { promises: fs } = require('fs');
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// For backward compatibility, also export as named functions
export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  return storageService.uploadFile(file);
};

export const getFile = async (filename: string): Promise<string> => {
  return storageService.getFile(filename);
};

export const deleteFile = async (filename: string): Promise<boolean> => {
  return storageService.deleteFile(filename);
};
