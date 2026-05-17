import { Input } from '@/src/shared/ui/components/input';
import { Text } from '@/src/shared/ui/components/text';
import { SelectField, type SelectFieldOption } from './select-field';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { RENTAL_BOOKING_HORIZON_DAYS, RENTAL_MIN_DURATION_DAYS } from '../../constants';
import type { RentalSlot } from '../../domain/availability';
import { formatSlotLabel, slotInclusiveEndYmd } from '../../domain/dates';

type Props = {
  durationDays: number;
  dateFrom: string;
  availableSlots: RentalSlot[];
  onDurationChange: (days: number) => void;
  onDateFromChange: (ymd: string) => void;
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
};

function DurationDaysInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (days: number) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <Input
      className="h-12 bg-card"
      placeholder="1"
      keyboardType="number-pad"
      inputMode="numeric"
      editable={!disabled}
      value={text}
      onChangeText={(raw) => {
        const digits = raw.replace(/\D/g, '');
        setText(digits);
        if (digits === '') return;
        const parsed = parseInt(digits, 10);
        if (!Number.isNaN(parsed)) {
          onChange(Math.max(RENTAL_MIN_DURATION_DAYS, parsed));
        }
      }}
      onBlur={() => {
        const parsed = parseInt(text, 10);
        const next =
          !text || Number.isNaN(parsed) || parsed < RENTAL_MIN_DURATION_DAYS
            ? RENTAL_MIN_DURATION_DAYS
            : parsed;
        setText(String(next));
        onChange(next);
      }}
    />
  );
}

function slotOptions(slots: RentalSlot[]): SelectFieldOption[] {
  return slots.map((slot) => ({
    value: slot.dateFrom,
    label: formatSlotLabel(slot.dateFrom, slotInclusiveEndYmd(slot)),
  }));
}

export function RentalSlotSelect({
  durationDays,
  dateFrom,
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
        <Text className="text-foreground text-sm font-medium">Czas wypożyczenia (dni)</Text>
        <DurationDaysInput
          value={durationDays}
          onChange={onDurationChange}
          disabled={disabled}
        />
        <Text className="text-muted-foreground text-xs">
          Liczba całkowita, minimum {RENTAL_MIN_DURATION_DAYS} dzień.
        </Text>
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
