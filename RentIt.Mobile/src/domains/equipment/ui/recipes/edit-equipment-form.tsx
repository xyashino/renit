import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/components/card';
import { Form, FormField } from '@/src/shared/ui/components/form';
import { Text } from '@/src/shared/ui/components/text';
import { FormInputItem, FormInputSelect } from '@/src/shared/ui';
import type { EquipmentFormData } from '../../application';
import type { Category } from '../../domain';
import { MaterialIcons } from '@expo/vector-icons';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<EquipmentFormData>;
  categories: Category[];
  isPending: boolean;
  onSubmit: () => void;
};

export function EditEquipmentForm({ form, categories, isPending, onSubmit }: Props) {
  return (
    <Form {...form}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Szczegóły sprzętu</CardTitle>
        </CardHeader>
        <CardContent className="gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormInputItem
                label="Nazwa"
                placeholder="np. MacBook Pro 16"
                {...field}
              />
            )}
          />

          <FormField
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

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormInputItem
                label="Cena za dzień (zł)"
                placeholder="0.00"
                keyboardType="decimal-pad"
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormInputItem
                label="Kaucja (zł)"
                placeholder="0.00"
                keyboardType="decimal-pad"
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormInputItem
                label="Adres odbioru"
                placeholder="np. ul. Marszałkowska 1, Warszawa"
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormInputItem
                label="Opis"
                className="min-h-28 py-3"
                placeholder="Opisz stan i specyfikację..."
                multiline
                numberOfLines={4}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormInputItem
                label="URL zdjęcia"
                placeholder="https://..."
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                {...field}
              />
            )}
          />

          <Button className="h-12" onPress={onSubmit} disabled={isPending}>
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text className="text-primary-foreground font-semibold ml-2">
              Zapisz
            </Text>
          </Button>
        </CardContent>
      </Card>
    </Form>
  );
}
