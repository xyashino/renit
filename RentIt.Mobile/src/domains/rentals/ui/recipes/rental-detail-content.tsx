import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardTitle } from '@/src/shared/ui/components/card';
import { EquipmentImage } from '@/src/shared/ui/equipment';
import { Text } from '@/src/shared/ui/components/text';
import { formatDate } from '../../domain/dates';
import type { UseMutationResult } from '@tanstack/react-query';
import { View } from 'react-native';
import type { Rental, RentalStatusKey } from '../../domain';
import { RENTAL_DETAIL_SCREEN } from '../../constants';
import { PickupLocation } from '../components/pickup-location';

function daysLabel(count: number): string {
  if (count === 1) return RENTAL_DETAIL_SCREEN.DAYS_SUFFIX.one;
  return RENTAL_DETAIL_SCREEN.DAYS_SUFFIX.few;
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View className="flex-row justify-between items-center gap-3">
      <Text variant="small" className="text-muted-foreground">
        {label}
      </Text>
      <Text variant="small" className="text-foreground font-semibold text-right flex-1">
        {value}
      </Text>
    </View>
  );
}

type Props = {
  rental: Rental;
  days: number;
  totalPrice: number;
  isOwner: boolean;
  isPending: boolean;
  statusMutation: UseMutationResult<unknown, Error, RentalStatusKey, unknown>;
  onCancel: () => void;
};

export function RentalDetailContent({
  rental,
  days,
  totalPrice,
  isOwner,
  isPending,
  statusMutation,
  onCancel,
}: Props) {
  const equipmentName = rental.equipment?.name?.trim() ?? `Sprzęt #${rental.equipmentId}`;
  const pricePerDay = rental.equipment?.pricePerDay ?? 0;
  const deposit = rental.equipment?.deposit ?? 0;
  const dateFormat = { day: 'numeric' as const, month: 'long' as const, year: 'numeric' as const };

  return (
    <View className="gap-3">
      <Card className="py-0 overflow-hidden">
        <View className="h-36 bg-accent items-center justify-center overflow-hidden">
          <EquipmentImage
            imageUrl={rental.equipment?.imageUrl}
            imageClassName="absolute inset-0"
            iconSize={32}
          />
        </View>
        <CardContent className="px-3 py-3 gap-2">
          <CardTitle>{RENTAL_DETAIL_SCREEN.EQUIPMENT_SECTION}</CardTitle>
          <Text className="text-foreground font-semibold" numberOfLines={2}>
            {equipmentName}
          </Text>
        </CardContent>
      </Card>

      {rental.address ? <PickupLocation address={rental.address} /> : null}

      <Card className="py-0">
        <CardContent className="px-3 py-3 gap-3">
          <CardTitle>{RENTAL_DETAIL_SCREEN.DATES_SECTION}</CardTitle>
          <DetailRow
            label={RENTAL_DETAIL_SCREEN.FROM_LABEL}
            value={formatDate(rental.dateFrom, dateFormat)}
          />
          <DetailRow
            label={RENTAL_DETAIL_SCREEN.TO_LABEL}
            value={formatDate(rental.dateTo, dateFormat)}
          />
          <DetailRow
            label={`${days} ${daysLabel(days)} × ${pricePerDay} zł`}
            value={`${totalPrice} zł`}
          />
          {deposit > 0 ? (
            <DetailRow
              label={RENTAL_DETAIL_SCREEN.DEPOSIT_LABEL}
              value={`${deposit} zł`}
            />
          ) : null}
          <DetailRow label={RENTAL_DETAIL_SCREEN.TOTAL_LABEL} value={`${totalPrice} zł`} />
        </CardContent>
      </Card>

      {rental.notes ? (
        <Card className="py-0">
          <CardContent className="px-3 py-3 gap-2">
            <CardTitle>{RENTAL_DETAIL_SCREEN.NOTES_SECTION}</CardTitle>
            <Text className="text-foreground leading-6">{rental.notes}</Text>
          </CardContent>
        </Card>
      ) : null}

      {isOwner && isPending ? (
        <Card className="py-0">
          <CardContent className="px-3 py-3 gap-3">
            <CardTitle>{RENTAL_DETAIL_SCREEN.OWNER_ACTIONS_SECTION}</CardTitle>
            <Button
              className="h-12 rounded-xl"
              onPress={() => statusMutation.mutate('active')}
              disabled={statusMutation.isPending}
            >
              <Text variant="small" className="text-primary-foreground font-semibold">
                {RENTAL_DETAIL_SCREEN.CONFIRM_RENTAL}
              </Text>
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl"
              onPress={() => statusMutation.mutate('completed')}
              disabled={statusMutation.isPending}
            >
              <Text variant="small" className="text-foreground font-semibold">
                {RENTAL_DETAIL_SCREEN.MARK_COMPLETED}
              </Text>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isOwner && isPending ? (
        <Button
          variant="destructive"
          className="h-12 rounded-xl"
          onPress={onCancel}
          disabled={statusMutation.isPending}
        >
          <Text variant="small" className="text-destructive-foreground font-semibold">
            {statusMutation.isPending
              ? RENTAL_DETAIL_SCREEN.CANCELLING
              : RENTAL_DETAIL_SCREEN.CANCEL_RENTAL}
          </Text>
        </Button>
      ) : null}
    </View>
  );
}
