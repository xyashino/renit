import { getCategories } from '../../infrastructure/queries';
import { useQuery } from '@tanstack/react-query';

export function useCategories() {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return { categories };
}
