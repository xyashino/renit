import { z } from 'zod';

export const categoryParamSchema = z.preprocess(
  (value) => (Array.isArray(value) ? value[0] : value),
  z.coerce.number().int().positive().optional()
);
