import { PasswordInput } from '@/components/forms/password-input';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ComponentProps } from 'react';

type Props = {
  label: string;
} & ComponentProps<typeof PasswordInput>;

export function FormPasswordItem(props: Props) {
  const { label, onChange, onChangeText, value, ...inputProps } = props;

  const handleChangeText =
    onChangeText ??
    ((text: string) => (onChange as ((nextValue: string) => void) | undefined)?.(text));

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl asChild>
        <PasswordInput
          value={typeof value === 'string' ? value : value == null ? '' : String(value)}
          onChangeText={handleChangeText}
          {...inputProps}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
