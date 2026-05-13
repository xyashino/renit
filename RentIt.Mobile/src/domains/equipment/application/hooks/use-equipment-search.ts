import { CATEGORIES, type Category } from '../../domain';
import { getEquipment } from '../../infrastructure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { z } from 'zod';

export function useEquipmentSearch() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string | string[] }>();

  const categoryParamSchema = z.preprocess(
    (value) => (Array.isArray(value) ? value[0] : value),
    z.coerce.number().int().positive().optional()
  );

  const parsedCategory = categoryParamSchema.safeParse(params.category).data;
  const selectedCategory = parsedCategory ? CATEGORIES.find((category) => category.id === parsedCategory) : null;

  const equipmentQuery = useSuspenseQuery({
    queryKey: ['equipment', selectedCategory?.id],
    queryFn: () =>
      getEquipment({
        ...(selectedCategory && { categoryId: selectedCategory.id }),
      }),
  });

  return {
    selectedCategory,
    toggleCategory: (category: Category) => {
      const nextCategoryId = selectedCategory?.id === category.id ? undefined : String(category.id);
      router.setParams({
        ...params,
        category: nextCategoryId,
      });
    },
    categories: CATEGORIES,
    equipment: Array.isArray(equipmentQuery.data) ? equipmentQuery.data : [],
  };
}
