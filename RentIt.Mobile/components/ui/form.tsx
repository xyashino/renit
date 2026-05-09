import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import * as React from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { View } from 'react-native';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.ComponentProps<typeof View>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View className={cn('gap-2', className)} {...props} />
    </FormItemContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext?.name) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error } = useFormField();

  return (
    <Label
      className={cn('text-xs tracking-wide text-foreground', error && 'text-destructive', className)}
      {...props}
    />
  );
}

function FormControl({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof View> & {
  asChild?: boolean;
}) {
  const { error } = useFormField();
  const Component = asChild ? Slot : View;

  return <Component className={cn(error && 'border-destructive', className)} {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text variant="small" className={cn('text-muted-foreground', className)} {...props} />;
}

function FormMessage({ className, children, ...props }: React.ComponentProps<typeof Text>) {
  const { error } = useFormField();
  const body = error ? String(error.message ?? '') : children;

  if (!body) {
    return null;
  }

  return (
    <Text variant="small" className={cn('text-destructive', className)} {...props}>
      {body}
    </Text>
  );
}

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField };
