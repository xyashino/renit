import { AuthCardShell } from '@/components/auth/auth-card-shell';
import { PasswordInput } from '@/components/auth/password-input';
import { FormInputItem } from '@/components/forms/form-input-item';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { useSignUp } from '@/lib/hooks/use-sign-up';
import { View } from 'react-native';

export function SignUpFormCard() {
  const { form, onSubmit, isPending } = useSignUp();

  return (
    <AuthCardShell>
      <Form {...form}>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormInputItem
                  label="Imię"
                  placeholder="Jan"
                  autoCapitalize="words"
                  {...field}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormInputItem
                  label="Nazwisko"
                  placeholder="Kowalski"
                  autoCapitalize="words"
                  {...field}
                />
              )}
            />
          </View>
        </View>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInputItem
              label="Adres e-mail"
              placeholder="jan@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormInputItem
              label="Adres"
              placeholder="ul. Przykładowa 1, Warszawa"
              autoCapitalize="words"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl asChild>
                <PasswordInput
                  autoComplete="new-password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button size="lg" onPress={onSubmit} disabled={isPending}>
          <Text variant="small" className="text-primary-foreground font-semibold">
            Utwórz konto
          </Text>
        </Button>
      </Form>
    </AuthCardShell>
  );
}
