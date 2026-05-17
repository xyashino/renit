import { useFavoriteToggle } from '../../favorites/application/hooks/use-favorite-toggle';
import { useEquipmentDetail } from './use-equipment-detail';

export function useProductDetail() {
  const { equipment, equipmentId, isError, goBack } = useEquipmentDetail();
  const { isFavorite, toggleFavorite, isFavoritePending } = useFavoriteToggle(equipmentId);

  return {
    equipment,
    isFavorite,
    toggleFavorite,
    isFavoritePending,
    isError,
    goBack,
  };
}
