import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { toLocalYmd } from '@/src/shared/utils/date';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, TextInput, View } from 'react-native';
import { Text } from './text';

const T = THEME.light;

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minimumDate?: Date;
  icon?: keyof typeof MaterialIcons.glyphMap;
  className?: string;
};

function parseYmd(value: string, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function toUtcYmd(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

export function YmdDateField({
  value,
  onChange,
  placeholder,
  minimumDate,
  icon = 'calendar-today',
  className,
}: Props) {
  const [iosOpen, setIosOpen] = useState(false);
  const fallbackDate = minimumDate ?? new Date();
  const parsed = parseYmd(value, fallbackDate);
  const minYmd = minimumDate ? toLocalYmd(minimumDate) : undefined;

  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          'flex-row items-center bg-input border border-border rounded-xl px-4 h-12 overflow-hidden',
          className
        )}
      >
        <MaterialIcons name={icon} size={18} color={T['muted-foreground']} />
        <View className="relative ml-2 flex-1 justify-center">
          <TextInput
            // @ts-expect-error `type` is supported on web
            type="date"
            value={value}
            min={minYmd}
            onChangeText={onChange}
            className={cn(
              'w-full bg-transparent text-foreground text-base outline-none',
              !value && 'text-transparent'
            )}
          />
          {!value ? (
            <Text className="pointer-events-none absolute left-0 text-muted-foreground">{placeholder}</Text>
          ) : null}
        </View>
      </View>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <>
        <Pressable
          className={cn(
            'flex-row items-center bg-input border border-border rounded-xl px-4 h-12',
            className
          )}
          onPress={() => setIosOpen(true)}
        >
          <MaterialIcons name={icon} size={18} color={T['muted-foreground']} />
          <Text className={cn('ml-2', value ? 'text-foreground' : 'text-muted-foreground')}>
            {value || placeholder}
          </Text>
        </Pressable>
        <Modal transparent animationType="slide" visible={iosOpen} onRequestClose={() => setIosOpen(false)}>
          <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setIosOpen(false)}>
            <Pressable className="bg-background rounded-t-2xl p-4" onPress={(event) => event.stopPropagation()}>
              <DateTimePicker
                mode="date"
                display="spinner"
                value={parsed}
                minimumDate={minimumDate}
                onChange={(_, selectedDate) => {
                  if (!selectedDate) return;
                  onChange(toUtcYmd(selectedDate));
                }}
              />
              <Pressable className="mt-3 items-center rounded-xl bg-primary py-3" onPress={() => setIosOpen(false)}>
                <Text className="text-primary-foreground font-semibold">Gotowe</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <Pressable
      className={cn(
        'flex-row items-center bg-input border border-border rounded-xl px-4 h-12',
        className
      )}
      onPress={() => {
        DateTimePickerAndroid.open({
          mode: 'date',
          value: parsed,
          minimumDate,
          onChange: (_, selectedDate) => {
            if (!selectedDate) return;
            onChange(toUtcYmd(selectedDate));
          },
        });
      }}
    >
      <MaterialIcons name={icon} size={18} color={T['muted-foreground']} />
      <Text className={cn('ml-2', value ? 'text-foreground' : 'text-muted-foreground')}>
        {value || placeholder}
      </Text>
    </Pressable>
  );
}
