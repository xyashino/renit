import { FormControl, FormItem, FormMessage } from '@/src/shared/ui/components/form';
import { CategoryMultiSelect } from '../components/category-multi-select';
import type { Category } from '@/src/shared/domain/category';

type Props = {
  label?: string;
  options: Category[];
  value: number[];
  onChange: (categoryIds: number[]) => void;
  disabled?: boolean;
};

export function FormCategoryItem({ label, options, value, onChange, disabled }: Props) {
  return (
    <FormItem>
      <FormControl>
        <CategoryMultiSelect
          label={label}
          options={options}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
