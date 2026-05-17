import type { Category } from '@/src/shared/domain/category';
import { getCategories, getEquipment } from '../../infrastructure/queries';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function useBrowse() {
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: equipment = [], isPending } = useQuery({
    queryKey: ['equipment', categoryId],
    queryFn: () => getEquipment(categoryId != null ? { categoryId } : undefined),
  });

  function toggleCategory(category: Category) {
    setCategoryId((current) => (current === category.id ? undefined : category.id));
  }

  return { categories, categoryId, equipment, isPending, toggleCategory };
}
