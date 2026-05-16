import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/components/form';
import { Text } from '@/src/shared/ui/components/text';
import { FormInputItem } from '@/src/shared/ui';
import { ROUTES } from '@/src/shared/auth/constants';
import { useSignUp } from '../../application/hooks/use-sign-up';
import { AccountTypePicker } from '../components/account-type-picker';
import { Branding } from '../components/branding';
import { CardShell } from '../components/card-shell';
import { PasswordInput } from '../components/password-input';
import { SubmitButton } from '../components/submit-button';
import { SwitchLink } from '../components/switch-link';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export function SignUpScreen() {
  const { form, onSubmit, isPending } = useSignUp();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="items-center p-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[500px] self-center gap-6">
          <Branding subtitle="Utworz konto" />
          <CardShell>
            <Form {...form}>
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ konta</FormLabel>
                    <FormControl>
                      <AccountTypePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <Text variant="small" className="text-muted-foreground">
                      Typ konta nie moze byc zmieniony po rejestracji
                    </Text>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormInputItem
                        label="Imie"
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
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormItem>
                    <FormLabel>Haslo</FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormItem>
                    <FormLabel>Potwierdz haslo</FormLabel>
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

              <SubmitButton label="Utworz konto" onPress={onSubmit} disabled={isPending} />
            </Form>
          </CardShell>
          <SwitchLink
            prompt="Masz juz konto?"
            cta="Zaloguj sie"
            href={ROUTES.SIGN_IN}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
