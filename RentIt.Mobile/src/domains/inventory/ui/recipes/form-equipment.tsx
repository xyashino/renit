import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/components/card';
import { Form, FormField } from '@/src/shared/ui/components/form';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { FormInputItem } from '@/src/shared/ui/recipes/form-input-item';
import { FormTextareaItem } from '@/src/shared/ui/recipes/form-textarea-item';
import type { Category } from '@/src/shared/domain/category';
import type { EquipmentFormData } from '../../application/schemas/forms';
import { FormCategoryItem } from './form-category-item';
import { MaterialIcons } from '@expo/vector-icons';
import type { UseFormReturn } from 'react-hook-form';

const T = THEME.light;

type Props = {
  form: UseFormReturn<EquipmentFormData>;
  categories: Category[];
  isPending: boolean;
  mode: 'add' | 'edit';
  onSubmit: () => void;
};

export function FormEquipment({ form, categories, isPending, mode, onSubmit }: Props) {
  const isAdd = mode === 'add';

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
                label={isAdd ? 'Nazwa sprzętu *' : 'Nazwa'}
                className={isAdd ? 'h-12 text-body-lg' : undefined}
                placeholder={isAdd ? 'np. Wiertarka Bosch GSB 18V' : 'np. MacBook Pro 16'}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="categoryIds"
            render={({ field }) => (
              <FormCategoryItem
                options={categories}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormInputItem
                label={isAdd ? 'Cena / dzień *' : 'Cena za dzień (zł)'}
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
                label={isAdd ? 'Kaucja (opcjonalnie)' : 'Kaucja (zł)'}
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
                label="Adres odbioru *"
                placeholder="ul. Przykładowa 1, 00-001 Warszawa"
                autoCapitalize="words"
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormTextareaItem
                label={isAdd ? 'OPIS' : 'Opis'}
                className={isAdd ? 'min-h-32 text-body-lg' : 'min-h-28'}
                placeholder={
                  isAdd
                    ? 'Opisz stan, specyfikację i co jest w zestawie...'
                    : 'Opisz stan i specyfikację...'
                }
                numberOfLines={isAdd ? 5 : 4}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormInputItem
                label={isAdd ? 'URL zdjęcia (opcjonalnie)' : 'URL zdjęcia'}
                placeholder="https://..."
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                {...field}
              />
            )}
          />

          <Button className="h-12" onPress={onSubmit} disabled={isPending}>
            {isAdd ? (
              <Text variant="small" className="text-primary-foreground tracking-wide font-semibold ml-1">
                Dodaj ogłoszenie
              </Text>
            ) : (
              <>
                <MaterialIcons name="save" size={20} color={T['primary-foreground']} />
                <Text className="text-primary-foreground font-semibold ml-2">Zapisz</Text>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </Form>
  );
}
