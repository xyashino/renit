import { FormControl, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/components/form';
import { Textarea } from '@/src/shared/ui/components/textarea';
import { ComponentProps } from 'react';

type Props = {
  label: string;
} & ComponentProps<typeof Textarea>;

export function FormTextareaItem(props: Props) {
  const { label, onChange, onChangeText, value, ...textareaProps } = props;

  const handleChangeText =
    onChangeText ??
    ((text: string) => (onChange as ((nextValue: string) => void) | undefined)?.(text));

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl asChild>
        <Textarea
          value={typeof value === 'string' ? value : value == null ? '' : String(value)}
          onChangeText={handleChangeText}
          {...textareaProps}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
