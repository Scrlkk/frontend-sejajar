import { z } from 'zod';

export const emailSchema = z.string().email('Email tidak valid');

export const passwordSchema = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .max(128, 'Password maksimal 128 karakter')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Harus mengandung huruf besar, huruf kecil, angka, dan simbol (@$!%*?&)'
  );

export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});
