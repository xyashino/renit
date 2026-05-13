import { Button } from '@/src/shared/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/components/form';
import { Input } from '@/src/shared/ui/components/input';
import { Text } from '@/src/shared/ui/components/text';
import { cn } from '@/src/shared/utils';
import type { NewRentalFormData } from '@/src/shared/application';
import { MaterialIcons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Pressable, View } from 'react-native';

type Props = {
  form: UseFormReturn<NewRentalFormData>;
  isPending: boolean;
  onSubmit: () => void;
};

export function NewRentalForm({ form, isPending, onSubmit }: Props) {
  const durationOptions = useMemo(() => [1, 2, 3, 5, 7, 14] as const, []);

  const openDatePicker = (currentValue: string, onChange: (value: string) => void) => {
    const fallbackDate = new Date();
    fallbackDate.setHours(0, 0, 0, 0);
    const parsed = currentValue ? new Date(`${currentValue}T00:00:00.000Z`) : fallbackDate;

    DateTimePickerAndroid.open({
      mode: 'date',
      value: isNaN(parsed.getTime()) ? fallbackDate : parsed,
      minimumDate: fallbackDate,
      onChange: (_, selectedDate) => {
        if (!selectedDate) return;
        onChange(selectedDate.toISOString().split('T')[0] ?? '');
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <View className="gap-5 mb-5">
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Data odbioru</FormLabel>
                <FormControl>
                  <Pressable
                    className="flex-row items-center bg-input border border-border rounded-xl px-4 h-12"
                    onPress={() => openDatePicker(value, onChange)}
                  >
                    <MaterialIcons name="calendar-today" size={18} color="#737373" />
                    <Text className={cn('ml-2', value ? 'text-foreground' : 'text-muted-foreground')}>
                      {value || 'Wybierz datę'}
                    </Text>
                  </Pressable>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationDays"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Czas wypożyczenia</FormLabel>
                <FormControl>
                  <View className="flex-row flex-wrap gap-2">
                    {durationOptions.map((option) => {
                      const selected = value === option;
                      return (
                        <Pressable
                          key={option}
                          onPress={() => onChange(option)}
                          className={cn(
                            'px-3 py-2 rounded-lg border',
                            selected ? 'bg-primary border-primary' : 'bg-card border-border'
                          )}
                        >
                          <Text className={cn(selected ? 'text-primary-foreground font-semibold' : 'text-foreground')}>
                            {option} dni
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormItem>
                <FormLabel>Adres odbioru</FormLabel>
                <FormControl asChild>
                  <Input
                    className="h-12"
                    placeholder="np. ul. Marszałkowska 1, Warszawa"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormItem>
                <FormLabel>Notatka (opcjonalnie)</FormLabel>
                <FormControl asChild>
                  <Input
                    className="min-h-20 py-3"
                    placeholder="Dodatkowe informacje dla właściciela..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </View>
      </Form>

      <Button className="h-14 rounded-xl" disabled={isPending} onPress={onSubmit}>
        <Text className="text-primary-foreground font-semibold">
          Potwierdź rezerwację
        </Text>
      </Button>
    </>
  );
}
