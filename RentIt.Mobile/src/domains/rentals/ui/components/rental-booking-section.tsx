import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/components/card';
import { Separator } from '@/src/shared/ui/components/separator';
import { Text } from '@/src/shared/ui/components/text';
import { useNewRental } from '../../application/hooks/use-new-rental';
import { NewRentalForm } from './new-rental-form';
import { View } from 'react-native';

type Props = {
  equipmentId: number;
  pricePerDay: number;
  deposit: number;
};

export function RentalBookingSection({ equipmentId, pricePerDay, deposit }: Props) {
  const { form, days, totalPrice, isPending, submit } = useNewRental({
    equipmentId,
    pricePerDay,
  });

  return (
    <Card className="py-0">
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-foreground">REZERWACJA</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="px-4 pt-4 pb-4 gap-4">
        <NewRentalForm form={form} isPending={isPending} onSubmit={submit} />

        {days != null && totalPrice != null ? (
          <View className="rounded-xl border border-border bg-muted p-4 gap-2">
            <Text className="text-foreground font-semibold">Podsumowanie</Text>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">
                {days} {days === 1 ? 'dzień' : 'dni'} × {pricePerDay} zł
              </Text>
              <Text className="text-foreground text-sm">{totalPrice} zł</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">Kaucja</Text>
              <Text className="text-foreground text-sm">{deposit} zł</Text>
            </View>
            <Separator />
            <View className="flex-row justify-between mt-1">
              <Text className="text-foreground font-bold text-base">Razem</Text>
              <Text className="text-primary font-bold text-xl">{totalPrice} zł</Text>
            </View>
          </View>
        ) : null}
      </CardContent>
    </Card>
  );
}
