import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
  }),
});

// Product Schemas
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().int().nonnegative().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Id must be an integer"),
  }),
});

// Order Schemas
export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    ).min(1),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Id must be an integer"),
  }),
});

// Review Schemas
export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
    productId: z.number().int().positive(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Id must be an integer"),
  }),
});
