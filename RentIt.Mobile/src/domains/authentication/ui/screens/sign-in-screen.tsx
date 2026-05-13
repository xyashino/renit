import { Form, FormField } from '@/src/shared/ui/components/form';
import { FormInputItem } from '@/src/shared/ui';
import { useSignIn } from '../../application/hooks/use-sign-in';
import { ROUTES, SIGN_IN_SCREEN } from '../../constants';
import { Branding } from '../components/branding';
import { CardShell } from '../components/card-shell';
import { SubmitButton } from '../components/submit-button';
import { SwitchLink } from '../components/switch-link';
import { FormPasswordItem } from '../recipes';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

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
          <Branding subtitle={SIGN_IN_SCREEN.BRANDING_SUBTITLE} />
          <CardShell>
            <Form {...form}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormInputItem
                    label={SIGN_IN_SCREEN.EMAIL_LABEL}
                    placeholder={SIGN_IN_SCREEN.EMAIL_PLACEHOLDER}
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
                    label={SIGN_IN_SCREEN.PASSWORD_LABEL}
                    {...field}
                  />
                )}
              />

              <SubmitButton label={SIGN_IN_SCREEN.SUBMIT_LABEL} onPress={onSubmit} disabled={isPending} />
            </Form>
          </CardShell>
          <SwitchLink
            prompt={SIGN_IN_SCREEN.SWITCH_PROMPT}
            cta={SIGN_IN_SCREEN.SWITCH_CTA}
            href={ROUTES.SIGN_UP}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
