import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/utils/validation';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

