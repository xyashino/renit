import { FormInputItem } from '@/src/shared/ui';
import { Form, FormField } from '@/src/shared/ui/components/form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { ROUTES } from '@/src/shared/auth';
import { useSignIn } from '../../application/hooks/use-sign-in';
import { Branding } from '../components/branding';
import { CardShell } from '../components/card-shell';
import { SubmitButton } from '../components/submit-button';
import { SwitchLink } from '../components/switch-link';
import { FormPasswordItem } from '../recipes/form-password-item';

export function SignInScreen() {
  const { form, onSubmit, isPending } = useSignIn();

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
            href={ROUTES.SIGN_UP}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
