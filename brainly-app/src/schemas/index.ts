import { z } from 'zod';

export const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
});

export const signInSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const contentTypeEnum = z.enum(['youtube', 'twitter', 'article', 'document', 'link']);

export const addContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  link: z.string().url('Link must be a valid URL'),
  type: contentTypeEnum,
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const editContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  link: z.string().url('Link must be a valid URL').optional(),
  type: contentTypeEnum.optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const addTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name too long'),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type AddContentFormValues = z.infer<typeof addContentSchema>;
export type EditContentFormValues = z.infer<typeof editContentSchema>;
export type AddTagFormValues = z.infer<typeof addTagSchema>;
