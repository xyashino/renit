import { z } from 'zod';

export function parseApiArray<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  fallbackMessage: string
): z.infer<T>[] {
  const result = z.array(schema).safeParse(data ?? []);
  if (!result.success) {
    throw new Error(fallbackMessage);
  }
  return result.data;
}

export function parseApiItem<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  fallbackMessage: string
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(fallbackMessage);
  }
  return result.data;
}
