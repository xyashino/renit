import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardTitle } from '@/src/shared/ui/components/card';
import { Form, FormField } from '@/src/shared/ui/components/form';
import { Text } from '@/src/shared/ui/components/text';
import { FormInputItem } from '@/src/shared/ui';
import type { AccountType } from '@/src/domains/authentication/domain/account-type';
import type { ProfileFormData } from '../../application/schemas/profile';
import { AccountTypeInfo } from '../components/account-type-info';
import type { UseFormReturn } from 'react-hook-form';
import { View } from 'react-native';

const inputClassName = 'bg-card';

type Props = {
  form: UseFormReturn<ProfileFormData>;
  accountType: AccountType | null | undefined;
  isPending: boolean;
  onSubmit: () => void;
};

export function ProfileForm({ form, accountType, isPending, onSubmit }: Props) {
  return (
    <View className="gap-3">
      <Card className="py-0">
        <CardContent className="px-3 py-3">
          <AccountTypeInfo accountType={accountType} />
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="px-3 py-3 gap-3">
          <CardTitle>Dane osobowe</CardTitle>

          <Form {...form}>
            <View className="gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormInputItem
                    label="Imię"
                    placeholder="Jan"
                    autoCapitalize="words"
                    className={inputClassName}
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormInputItem
                    label="Nazwisko"
                    placeholder="Kowalski"
                    autoCapitalize="words"
                    className={inputClassName}
                    {...field}
                  />
                )}
              />

              <Button className="h-12 rounded-xl" onPress={onSubmit} disabled={isPending}>
                <Text variant="small" className="text-primary-foreground font-semibold">
                  Zapisz zmiany
                </Text>
              </Button>
            </View>
          </Form>
        </CardContent>
      </Card>
    </View>
  );
}
