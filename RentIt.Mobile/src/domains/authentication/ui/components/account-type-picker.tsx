import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { ACCOUNT_TYPE_PICKER_OPTIONS, type AccountType } from '../../constants';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

type AccountTypePickerProps = {
  value: AccountType | undefined;
  onChange: (value: AccountType) => void;
  disabled?: boolean;
};

export function AccountTypePicker({ value, onChange, disabled }: AccountTypePickerProps) {
  const colors = THEME.light;

  return (
    <View className="gap-2">
      <View className="flex-row gap-3">
        {ACCOUNT_TYPE_PICKER_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: !!disabled }}
              className={cn(
                'flex-1 rounded-xl border p-4 gap-2',
                selected ? 'border-primary bg-primary/10' : 'border-border bg-card',
                disabled && 'opacity-50'
              )}
            >
              <MaterialIcons
                name={option.icon}
                size={22}
                color={selected ? colors.primary : colors['muted-foreground']}
              />
              <Text className={cn('font-semibold', selected ? 'text-primary' : 'text-foreground')}>
                {option.title}
              </Text>
              <Text variant="small" className="text-muted-foreground leading-5">
                {option.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
