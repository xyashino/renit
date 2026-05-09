import { FormInputSelect } from '@/components/forms/form-input-select';
import { FormInputItem } from '@/components/forms/form-input-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import type { EquipmentFormData } from '@/lib/schemas/equipment';
import type { Category } from '@/types';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<EquipmentFormData>;
  categories: Category[];
  isPending: boolean;
  onSubmit: () => void;
};

export function AddEquipmentForm({ form, categories, isPending, onSubmit }: Props) {
  return (
    <Form {...form}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Szczegóły sprzętu</CardTitle>
        </CardHeader>
        <CardContent className="gap-6">
          <FormField<EquipmentFormData, 'name'>
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormInputItem
                label="Nazwa sprzętu *"
                className="h-12 text-body-lg"
                placeholder="np. Wiertarka Bosch GSB 18V"
                {...field}
              />
            )}
          />

          <FormField<EquipmentFormData, 'categoryId'>
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormInputSelect
                label="Kategoria *"
                placeholder="Wybierz kategorię"
                selectedValue={field.value > 0 ? String(field.value) : undefined}
                options={categories.map((cat) => ({ value: String(cat.id), label: cat.label }))}
                onValueChange={(selectedValue) => field.onChange(Number(selectedValue || 0))}
              />
            )}
          />

          <FormField<EquipmentFormData, 'price'>
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormInputItem
                label="Cena / dzień *"
                placeholder="0.00"
                keyboardType="decimal-pad"
                {...field}
              />
            )}
          />

          <FormField<EquipmentFormData, 'deposit'>
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormInputItem
                label="Kaucja (opcjonalnie)"
                placeholder="0.00"
                keyboardType="decimal-pad"
                {...field}
              />
            )}
          />

          <FormField<EquipmentFormData, 'address'>
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormInputItem
                label="Adres odbioru *"
                placeholder="np. ul. Marszałkowska 1, Warszawa"
                className="h-12 text-body-lg"
                {...field}
              />
            )}
          />

          <FormField<EquipmentFormData, 'description'>
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormInputItem
                label="OPIS"
                className="min-h-32 py-3 text-body-lg"
                placeholder="Opisz stan, specyfikację i co jest w zestawie..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                {...field}
              />
            )}
          />

          <FormField<EquipmentFormData, 'imageUrl'>
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormInputItem
                label="URL zdjęcia (opcjonalnie)"
                placeholder="https://..."
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                {...field}
              />
            )}
          />

          <Button className="h-12" onPress={onSubmit} disabled={isPending}>
            <Text variant="small" className="text-primary-foreground tracking-wide font-semibold ml-1">
              Dodaj ogłoszenie
            </Text>
          </Button>
        </CardContent>
      </Card>
    </Form>
  );
}
