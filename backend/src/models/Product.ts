export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[]; // Store as JSON array in PostgreSQL using text[] or jsonb
  description: string;
  materials: string;
  dimensions: string;
  care: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  createdAt: Date;
  updatedAt: Date;
}
