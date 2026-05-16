import { Text } from '@/src/shared/ui/components/text';
import { SelectField, type SelectFieldOption } from '@/src/shared/ui';
import { formatDate } from '@/src/shared/utils/date';
import { ActivityIndicator, View } from 'react-native';
import { RENTAL_BOOKING_HORIZON_DAYS } from '../../constants';
import type { RentalSlot } from '../../domain/availability';

type Props = {
  durationDays: number;
  dateFrom: string;
  durationOptions: SelectFieldOption[];
  availableSlots: RentalSlot[];
  onDurationChange: (days: number) => void;
  onDateFromChange: (ymd: string) => void;
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
};

function slotOptions(slots: RentalSlot[]): SelectFieldOption[] {
  return slots.map((slot) => {
    const lastDay = new Date(`${slot.dateTo}T00:00:00.000Z`);
    lastDay.setUTCDate(lastDay.getUTCDate() - 1);
    const lastYmd = lastDay.toISOString().split('T')[0]!;

    return {
      value: slot.dateFrom,
      label: `${formatDate(slot.dateFrom)} – ${formatDate(lastYmd)}`,
    };
  });
}

export function RentalSlotSelect({
  durationDays,
  dateFrom,
  durationOptions,
  availableSlots,
  onDurationChange,
  onDateFromChange,
  loading = false,
  error = false,
  disabled = false,
}: Props) {
  const terminOptions = slotOptions(availableSlots);

  if (loading) {
    return (
      <View className="rounded-xl border border-border bg-card min-h-24 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <Text className="text-destructive text-sm">
        Nie udało się załadować dostępnych terminów.
      </Text>
    );
  }

  return (
    <View className="gap-3">
      <View className="gap-1.5">
        <Text className="text-foreground text-sm font-medium">Czas wypożyczenia</Text>
        <SelectField
          placeholder="Wybierz liczbę dni"
          selectedValue={String(durationDays)}
          options={durationOptions}
          onValueChange={(value) => onDurationChange(Number(value))}
          disabled={disabled}
          triggerClassName="h-12 bg-card"
        />
      </View>

      <View className="gap-1.5">
        <Text className="text-foreground text-sm font-medium">Termin</Text>
        {terminOptions.length > 0 ? (
          <SelectField
            placeholder="Wybierz termin"
            selectedValue={dateFrom}
            options={terminOptions}
            onValueChange={onDateFromChange}
            disabled={disabled}
            triggerClassName="h-12 bg-card"
          />
        ) : (
          <Text className="text-muted-foreground text-sm">
            Brak wolnych terminów na najbliższe {RENTAL_BOOKING_HORIZON_DAYS} dni dla wybranego czasu
            wypożyczenia.
          </Text>
        )}
      </View>

      <Text className="text-muted-foreground text-xs">
        Pokazujemy dostępne terminy na najbliższy miesiąc.
      </Text>
    </View>
  );
}
