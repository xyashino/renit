import { FormInputItem } from '@/components/forms/form-input-item';
import { FormPasswordItem } from '@/components/forms/form-password-item';
import { Form, FormField } from '@/components/ui/form';
import { useSignIn } from '@authentication/application/hooks/use-sign-in';
import { SwitchLink } from '@authentication/ui/components/switch-link';
import { Branding } from '@authentication/ui/components/branding';
import { CardShell } from '@authentication/ui/components/card-shell';
import { SubmitButton } from '@authentication/ui/components/submit-button';
import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export function SignInScreen() {
  const router = useRouter();
  const { form, onSubmit, isPending } = useSignIn({
    onSuccess: () => router.replace('/(tabs)'),
    onError: (message) => Alert.alert('Blad logowania', message),
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
          <Branding subtitle="Witaj ponownie" />
          <CardShell>
            <Form {...form}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormInputItem
                    label="Adres e-mail"
                    placeholder="uzytkownik@example.com"
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
                render={({ field }) => (
                  <FormPasswordItem
                    label="Haslo"
                    {...field}
                  />
                )}
              />

              <SubmitButton label="Zaloguj sie" onPress={onSubmit} disabled={isPending} />
            </Form>
          </CardShell>
          <SwitchLink
            prompt="Nie masz konta?"
            cta="Zarejestruj sie"
            href="/(auth)/sign-up"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
