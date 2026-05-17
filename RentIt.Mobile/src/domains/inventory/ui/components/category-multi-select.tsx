import { Badge } from '@/src/shared/ui/components/badge';
import { Text } from '@/src/shared/ui/components/text';
import type { Category } from '@/src/shared/domain/category';
import { Pressable, View } from 'react-native';

type Props = {
  label?: string;
  options: Category[];
  value: number[];
  onChange: (categoryIds: number[]) => void;
  disabled?: boolean;
};

export function CategoryMultiSelect({
  label = 'Kategorie',
  options,
  value,
  onChange,
  disabled = false,
}: Props) {
  function toggleCategory(categoryId: number) {
    if (disabled) return;
    if (value.includes(categoryId)) {
      onChange(value.filter((id) => id !== categoryId));
      return;
    }
    onChange([...value, categoryId]);
  }

  if (options.length === 0) {
    return (
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        <Text variant="small" className="text-muted-foreground">
          Brak dostępnych kategorii.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Text variant="small" className="text-muted-foreground">
        Wybierz jedną lub więcej kategorii.
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((category) => {
          const selected = value.includes(category.id);
          return (
            <Badge key={category.id} variant={selected ? 'default' : 'outline'} asChild>
              <Pressable
                onPress={() => toggleCategory(category.id)}
                disabled={disabled}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected, disabled }}
              >
                <Text>{category.label}</Text>
              </Pressable>
            </Badge>
          );
        })}
      </View>
    </View>
  );
}
