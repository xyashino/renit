import { useAuth } from '@/src/shared/auth';
import type { Equipment } from '@/src/shared/domain/equipment';
import { deleteEquipment } from '../../infrastructure/commands';
import { getMyEquipment } from '../../infrastructure/queries';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

export function useMyEquipment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ownerId = user?.userId;

  const { data: myEquipment = [] } = useSuspenseQuery({
    queryKey: ['equipment', 'mine', ownerId],
    queryFn: () => {
      if (ownerId == null) throw new Error('Nie jesteś zalogowany');
      return getMyEquipment();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      Alert.alert('Usunięto', 'Sprzęt został usunięty.');
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  function confirmDelete(item: Equipment) {
    Alert.alert('Usuń sprzęt', `Czy na pewno chcesz usunąć "${item.name}"?`, [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Usuń', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
    ]);
  }

  return { myEquipment, confirmDelete };
}
