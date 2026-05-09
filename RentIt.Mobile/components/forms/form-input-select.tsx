import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FormInputSelectOption = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  placeholder: string;
  value?: FormInputSelectOption;
  selectedValue?: string;
  options: FormInputSelectOption[];
  onValueChange: (value: string) => void;
};

export function FormInputSelect({
  label,
  placeholder,
  value,
  selectedValue,
  options,
  onValueChange,
}: Props) {
  const resolvedValue = value ?? options.find((option) => option.value === selectedValue);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select
        value={resolvedValue}
        onValueChange={(option) => {
          const selectedValue = typeof option === 'string' ? option : option?.value;
          onValueChange(selectedValue ?? '');
        }}
      >
        <FormControl asChild>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} label={option.label} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
