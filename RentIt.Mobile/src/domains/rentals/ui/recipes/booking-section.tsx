import { Button } from '@/src/shared/ui/components/button';
import { Form, FormField } from '@/src/shared/ui/components/form';
import { Separator } from '@/src/shared/ui/components/separator';
import { Text } from '@/src/shared/ui/components/text';
import { FormTextareaItem } from '@/src/shared/ui';
import { useNewRental } from '../../application/hooks/use-new-rental';
import { PickupLocation } from '../components/pickup-location';
import { RentalSlotSelect } from '../components/rental-slot-select';
import { View } from 'react-native';

type Props = {
  equipmentId: number;
  pricePerDay: number;
  deposit: number;
  pickupAddress: string;
};

export function BookingSection({
  equipmentId,
  pricePerDay,
  deposit,
  pickupAddress,
}: Props) {
  const {
    form,
    days,
    totalPrice,
    availableSlots,
    durationOptions,
    slotsLoading,
    slotsError,
    canSubmit,
    isPending,
    submit,
  } = useNewRental({ equipmentId, pricePerDay, pickupAddress });

  const dateFrom = form.watch('dateFrom');
  const durationDays = form.watch('durationDays');

  return (
    <View className="gap-3">
      <Text className="text-foreground font-bold text-base">Rezerwacja</Text>
      <PickupLocation address={pickupAddress} />

      <RentalSlotSelect
        durationDays={durationDays}
        dateFrom={dateFrom}
        durationOptions={durationOptions}
        availableSlots={availableSlots}
        onDurationChange={(value) =>
          form.setValue('durationDays', value, { shouldValidate: true })
        }
        onDateFromChange={(value) => form.setValue('dateFrom', value, { shouldValidate: true })}
        loading={slotsLoading}
        error={slotsError}
        disabled={slotsLoading || isPending}
      />

      <Form {...form}>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormTextareaItem
              label="Notatka (opcjonalnie)"
              className="min-h-20 bg-card"
              placeholder="Dodatkowe informacje dla właściciela..."
              numberOfLines={3}
              {...field}
            />
          )}
        />
      </Form>

      {days != null && totalPrice != null ? (
        <View className="rounded-xl border border-border bg-card p-4 gap-2">
          <Text className="text-foreground font-semibold">Podsumowanie</Text>
          <View className="flex-row justify-between">
            <Text className="text-muted-foreground text-sm">
              {days} {days === 1 ? 'dzień' : 'dni'} × {pricePerDay} zł
            </Text>
            <Text className="text-foreground text-sm">{totalPrice} zł</Text>
          </View>
          {deposit > 0 ? (
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">Kaucja (przy odbiorze)</Text>
              <Text className="text-foreground text-sm">{deposit} zł</Text>
            </View>
          ) : null}
          <Separator />
          <View className="flex-row justify-between mt-1">
            <Text className="text-foreground font-bold text-base">Do zapłaty</Text>
            <Text className="text-primary font-bold text-xl">{totalPrice} zł</Text>
          </View>
        </View>
      ) : null}

      <Button
        className="h-14 rounded-xl"
        disabled={!canSubmit || isPending}
        onPress={submit}
      >
        <Text className="text-primary-foreground font-semibold">
          {isPending ? 'Wysyłanie…' : 'Potwierdź rezerwację'}
        </Text>
      </Button>
    </View>
  );
}
