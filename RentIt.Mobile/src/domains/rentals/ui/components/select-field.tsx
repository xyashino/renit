import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui/components/select';
import { cn } from '@/src/shared/utils';

export type SelectFieldOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  placeholder: string;
  value?: SelectFieldOption;
  selectedValue?: string;
  options: SelectFieldOption[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  triggerClassName?: string;
};

export function SelectField({
  placeholder,
  value,
  selectedValue,
  options,
  onValueChange,
  disabled = false,
  triggerClassName,
}: SelectFieldProps) {
  const resolvedValue = value ?? options.find((option) => option.value === selectedValue);

  return (
    <Select
      value={resolvedValue}
      onValueChange={(option) => {
        const next = typeof option === 'string' ? option : option?.value;
        onValueChange(next ?? '');
      }}
      disabled={disabled}
    >
      <SelectTrigger className={cn('w-full', triggerClassName)} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} label={option.label} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
