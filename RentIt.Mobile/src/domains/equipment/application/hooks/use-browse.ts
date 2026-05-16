import type { Category } from '@/src/shared/domain/category';
import { getCategories, getEquipment } from '../../infrastructure/queries';
import { categoryParamSchema } from '../schemas/search';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';

export function useBrowse() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string | string[] }>();
  const categoryId = categoryParamSchema.safeParse(params.category).data;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: equipment = [], isPending } = useQuery({
    queryKey: ['equipment', categoryId],
    queryFn: () => getEquipment(categoryId != null ? { categoryId } : undefined),
  });

  function toggleCategory(category: Category) {
    router.setParams({
      ...params,
      category: categoryId === category.id ? undefined : String(category.id),
    });
  }

  return { categories, categoryId, equipment, isPending, toggleCategory };
}
