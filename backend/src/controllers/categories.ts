import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import {
  createCategory as createCategoryService,
  getCategoryById as getCategoryByIdService,
  getCategories as getCategoriesService,
  getCategoriesWithFilters,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService
} from '../services/categoryService';
import { z } from 'zod';

// Validation schemas
const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  image: z.string().optional(),
  available: z.boolean().optional(),
  orderNumber: z.number().int().min(0).optional(),
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Get all categories with optional filtering
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query;

    let categories: Category[];
    if (query.available !== undefined) {
      const available = query.available === 'true';
      categories = await getCategoriesWithFilters({ available });
    } else {
      categories = await getCategoriesService();
    }

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
    if (!UUID_RE.test(id)) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
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

    const serviceData = {
      name: validatedData.name,
      image: validatedData.image ?? '',
      available: validatedData.available ?? true,
      orderNumber: validatedData.orderNumber ?? 0,
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
    if (!UUID_RE.test(id)) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Validate request body (partial updates allowed)
    const validatedData = categorySchema.partial().parse(req.body);

    const serviceData: any = {};
    if (validatedData.name !== undefined) serviceData.name = validatedData.name;
    if (validatedData.image !== undefined) serviceData.image = validatedData.image;
    if (validatedData.available !== undefined) serviceData.available = validatedData.available;
    if (validatedData.orderNumber !== undefined) serviceData.orderNumber = validatedData.orderNumber;
    if (Object.keys(serviceData).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

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
    if (!UUID_RE.test(id)) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
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