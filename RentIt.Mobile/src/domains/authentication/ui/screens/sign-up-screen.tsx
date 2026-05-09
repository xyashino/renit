import { FormInputItem } from '@/components/forms/form-input-item';
import { PasswordInput } from '@/components/forms/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSignUp } from '@authentication/application/hooks/use-sign-up';
import { Branding } from '@authentication/ui/components/branding';
import { CardShell } from '@authentication/ui/components/card-shell';
import { SubmitButton } from '@authentication/ui/components/submit-button';
import { SwitchLink } from '@authentication/ui/components/switch-link';
import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export function SignUpScreen() {
  const router = useRouter();
  const { form, onSubmit, isPending } = useSignUp({
    onSuccess: () => router.replace('/(tabs)'),
    onError: (message) => Alert.alert('Blad rejestracji', message),
  });

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
            href="/(auth)/sign-in"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
