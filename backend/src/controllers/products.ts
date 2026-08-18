import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { 
  createProduct as createProductService, 
  getProductBySlug as getProductBySlugService, 
  getProducts as getProductsService, 
  updateProduct as updateProductService, 
  deleteProduct as deleteProductService 
} from '../services/productService';
import { z } from 'zod';

// Validation schemas
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url('Invalid URL')).optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  care: z.string().optional(),
  availability: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
  featured: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  slug: z.string().min(1, 'Slug is required')
});

/**
 * Get all products
 */
export const getProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await getProductsService();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by slug (URL parameter)
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const param = req.params.slug;
    const slug = Array.isArray(param) ? param[0] : param;
    const product = await getProductBySlugService(slug);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validatedData = productSchema.parse(req.body);
    
    // Convert to service format with proper defaults for undefined fields
    const serviceData = {
      name: validatedData.name,
      slug: validatedData.slug,
      category: validatedData.category,
      price: validatedData.price,
      images: Array.isArray(validatedData.images) ? validatedData.images : [],
      description: validatedData.description ?? '',
      materials: validatedData.materials ?? '',
      dimensions: validatedData.dimensions ?? '',
      care: validatedData.care ?? '',
      availability: validatedData.availability ?? 'in_stock',
      featured: validatedData.featured ?? false,
      newArrival: validatedData.newArrival ?? false,
      bestseller: validatedData.bestseller ?? false
    };
    
    const product = await createProductService(serviceData);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    next(error);
  }
};

/**
 * Update product
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const param = req.params.slug;
    const slug = Array.isArray(param) ? param[0] : param;
    
    // Validate request body (partial updates allowed)
    const validatedData = productSchema.partial().parse(req.body);
    
    // Convert to service format, only include fields that were provided
    const serviceData: any = {};
    if (validatedData.name !== undefined) serviceData.name = validatedData.name;
    if (validatedData.slug !== undefined) serviceData.slug = validatedData.slug;
    if (validatedData.category !== undefined) serviceData.category = validatedData.category;
    if (validatedData.price !== undefined) serviceData.price = validatedData.price;
    if (validatedData.images !== undefined) serviceData.images = Array.isArray(validatedData.images) ? validatedData.images : [];
    if (validatedData.description !== undefined) serviceData.description = validatedData.description;
    if (validatedData.materials !== undefined) serviceData.materials = validatedData.materials;
    if (validatedData.dimensions !== undefined) serviceData.dimensions = validatedData.dimensions;
    if (validatedData.care !== undefined) serviceData.care = validatedData.care;
    if (validatedData.availability !== undefined) serviceData.availability = validatedData.availability;
    if (validatedData.featured !== undefined) serviceData.featured = validatedData.featured;
    if (validatedData.newArrival !== undefined) serviceData.newArrival = validatedData.newArrival;
    if (validatedData.bestseller !== undefined) serviceData.bestseller = validatedData.bestseller;
    
    const product = await updateProductService(slug, serviceData);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    next(error);
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const param = req.params.slug;
    const slug = Array.isArray(param) ? param[0] : param;
    const deleted = await deleteProductService(slug);
    if (!deleted) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
