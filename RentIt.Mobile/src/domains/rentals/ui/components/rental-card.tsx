import { Badge } from '@/src/shared/ui/components/badge';
import { Button } from '@/src/shared/ui/components/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/src/shared/ui/components/dialog';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { formatDate } from '@/src/shared/utils/date';
import { useCurrentUser } from '@/src/shared/auth/session';
import { createReview } from '@/src/shared/api/reviews';
import type { Rental } from '../../domain';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

const T = THEME.light;

const STATUS_CONFIG = {
  available: { label: 'Dostępny', icon: 'check-circle' as const, color: T.primary },
  rented: { label: 'Aktywne', icon: 'check-circle' as const, color: T.primary },
  unavailable: { label: 'Oczekujące', icon: 'schedule' as const, color: T['muted-foreground'] },
};

type Props = {
  rental: Rental;
  showReview: boolean;
  onPress: () => void;
};

export function RentalCard({ rental, showReview, onPress }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const user = useCurrentUser();
  const queryClient = useQueryClient();

  const statusName = rental.status?.key ?? 'unavailable';
  const cfg = STATUS_CONFIG[statusName as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.unavailable;

  const reviewMutation = useMutation({
    mutationFn: () =>
      createReview({
        rating,
        comment: comment.trim() || undefined,
        authorId: user!.userId,
        equipmentId: rental.equipmentId,
        rentalId: rental.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      setDialogOpen(false);
      setRating(0);
      setComment('');
      Alert.alert('Dziękujemy!', 'Twoja opinia została dodana.');
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  return (
    <>
      <Pressable onPress={onPress} className="bg-card rounded-xl overflow-hidden border border-border active:opacity-80">
        <View className="h-16 bg-accent items-center justify-center">
          <MaterialIcons name="construction" size={28} color={T['accent-foreground']} />
        </View>

        <View className="px-4 py-3 gap-3">
          <View className="flex-row items-start justify-between">
            <Text className="text-foreground font-semibold text-base flex-1 mr-2" numberOfLines={1}>
              {rental.equipment?.name ?? `Sprzęt #${rental.equipmentId}`}
            </Text>
            <Badge className="bg-card/90 border border-border rounded-full px-2.5 py-1 flex-row items-center gap-1">
              <MaterialIcons name={cfg.icon} size={12} color={cfg.color} />
              <Text className="text-foreground text-xs font-semibold">{cfg.label}</Text>
            </Badge>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="calendar-today" size={14} color={T['muted-foreground']} />
              <Text className="text-muted-foreground text-sm">
                {formatDate(rental.dateFrom)} – {formatDate(rental.dateTo)}
              </Text>
            </View>
            {rental.address ? (
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="place" size={14} color={T['muted-foreground']} />
                <Text className="text-muted-foreground text-sm">{rental.address}</Text>
              </View>
            ) : null}
          </View>

          {showReview && (
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl"
              onPress={(e) => { e.stopPropagation?.(); setDialogOpen(true); }}
            >
              <MaterialIcons name="star-outline" size={16} color={T.primary} />
              <Text className="text-primary font-semibold ml-1">Dodaj opinię</Text>
            </Button>
          )}
        </View>
      </Pressable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Oceń wypożyczenie</DialogTitle>
          </DialogHeader>

          <View className="gap-1">
            <Text className="text-foreground font-semibold text-sm" numberOfLines={1}>
              {rental.equipment?.name ?? `Sprzęt #${rental.equipmentId}`}
            </Text>
            <Text className="text-muted-foreground text-xs">
              {formatDate(rental.dateFrom)} – {formatDate(rental.dateTo)}
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs font-medium tracking-wide">Ocena</Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
                  <MaterialIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= rating ? T.primary : T['muted-foreground']}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs font-medium tracking-wide">Komentarz</Text>
            <TextInput
              className="bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm min-h-[80px]"
              placeholder="Opisz swoje doświadczenie..."
              placeholderTextColor={T['muted-foreground']}
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />
          </View>

          <DialogFooter>
            <Button variant="outline" className="flex-1 rounded-xl" onPress={() => setDialogOpen(false)}>
              <Text className="text-foreground">Anuluj</Text>
            </Button>
            <Button
              className="flex-1 rounded-xl"
              disabled={rating === 0 || reviewMutation.isPending}
              onPress={() => reviewMutation.mutate()}
            >
              <Text className="text-primary-foreground font-semibold">
                {reviewMutation.isPending ? 'Wysyłanie...' : 'Wyślij opinię'}
              </Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
