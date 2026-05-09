import { Input } from '@/components/ui/input';
import { THEME } from '@/constants/theme';
import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

type PasswordInputProps = React.ComponentProps<typeof Input>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const { onChange, onChangeText, value, ...inputProps } = props;
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const passwordIconColor = THEME[scheme]['muted-foreground'];
  const handleChangeText =
    onChangeText ??
    ((text: string) => (onChange as ((nextValue: string) => void) | undefined)?.(text));

  return (
    <View className="relative w-full">
      <Input
        placeholder="••••••••"
        secureTextEntry={!showPassword}
        className={cn('pr-12', className)}
        value={typeof value === 'string' ? value : value == null ? '' : String(value)}
        onChangeText={handleChangeText}
        {...inputProps}
      />
      <Pressable
        onPress={() => setShowPassword((v) => !v)}
        className="absolute right-3 top-0 bottom-0 justify-center"
        accessibilityLabel="Przełącz widoczność hasła"
      >
        <Ionicons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color={passwordIconColor}
        />
      </Pressable>
    </View>
  );
}
