import { findCategoryById, type Category } from '@/src/shared/domain/category';
import { getCategories, getEquipment } from '../../infrastructure/queries';
import { categoryParamSchema } from '../schemas/search';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useEquipmentSearchFilters() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string | string[] }>();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const parsedCategory = categoryParamSchema.safeParse(params.category).data;
  const selectedCategory = parsedCategory
    ? (findCategoryById(categories, parsedCategory) ?? null)
    : null;

  useEffect(() => {
    if (!parsedCategory || categories.length === 0) return;
    if (selectedCategory) return;

    router.setParams({ category: undefined });
  }, [parsedCategory, categories, selectedCategory, router]);

  return {
    selectedCategory,
    categories,
    toggleCategory: (category: Category) => {
      const nextCategoryId = selectedCategory?.id === category.id ? undefined : String(category.id);
      router.setParams({
        ...params,
        category: nextCategoryId,
      });
    },
  };
}

export function useEquipmentSearchList(selectedCategory: Category | null) {
  const equipmentQuery = useSuspenseQuery({
    queryKey: ['equipment', selectedCategory?.id],
    queryFn: () =>
      getEquipment({
        ...(selectedCategory && { categoryId: selectedCategory.id }),
      }),
  });

  return Array.isArray(equipmentQuery.data) ? equipmentQuery.data : [];
}
