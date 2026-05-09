import { useAuth } from '@/context/auth';
import { deleteEquipment, getEquipment } from '@/services/equipment';
import type { Equipment } from '@/types';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

export function useMyEquipment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: allEquipment = [] } = useSuspenseQuery({
    queryKey: ['equipment'],
    queryFn: () => getEquipment(),
  });

  const myEquipment = allEquipment.filter((e) => e.userId === user?.userId);

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
