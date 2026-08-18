import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { 
  createCategory as createCategoryService, 
  getCategoryById as getCategoryByIdService, 
  getCategories as getCategoriesService, 
  updateCategory as updateCategoryService, 
  deleteCategory as deleteCategoryService 
} from '../services/categoryService';
import { z } from 'zod';

// Validation schemas
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required')
});

/**
 * Get all categories
 */
export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await getCategoriesService();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const param = req.params.id;
    const id = Array.isArray(param) ? param[0] : param;
    const category = await getCategoryByIdService(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new category
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validatedData = categorySchema.parse(req.body);
    
    // Map to service format (service expects different fields)
    const serviceData = {
      name: validatedData.name,
      image: '', // Default image since not in schema
      available: true, // Default availability
      orderNumber: 0 // Default order
    };
    
    const category = await createCategoryService(serviceData);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    next(error);
  }
};

/**
 * Update category
 */
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const param = req.params.id;
    const id = Array.isArray(param) ? param[0] : param;
    
    // Validate request body (partial updates allowed)
    const validatedData = categorySchema.partial().parse(req.body);
    
    // Map to service format
    const serviceData: any = {};
    if (validatedData.name !== undefined) serviceData.name = validatedData.name;
    if (validatedData.description !== undefined) serviceData.description = validatedData.description;
    // Note: image, available, orderNumber not in update schema for now
    
    const category = await updateCategoryService(id, serviceData);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    next(error);
  }
};

/**
 * Delete category
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const param = req.params.id;
    const id = Array.isArray(param) ? param[0] : param;
    const deleted = await deleteCategoryService(id);
    if (!deleted) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
