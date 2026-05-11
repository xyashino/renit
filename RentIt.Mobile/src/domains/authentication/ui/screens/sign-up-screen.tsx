import { FormInputItem } from '@/components/forms/form-input-item';
import { PasswordInput } from '@/components/forms/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSignUp } from '@authentication/application/hooks/use-sign-up';
import { ROUTES, SIGN_UP_SCREEN } from '@authentication/constants';
import { Branding } from '@authentication/ui/components/branding';
import { CardShell } from '@authentication/ui/components/card-shell';
import { SubmitButton } from '@authentication/ui/components/submit-button';
import { SwitchLink } from '@authentication/ui/components/switch-link';
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
          <Branding subtitle={SIGN_UP_SCREEN.BRANDING_SUBTITLE} />
          <CardShell>
            <Form {...form}>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormInputItem
                        label={SIGN_UP_SCREEN.FIRST_NAME_LABEL}
                        placeholder={SIGN_UP_SCREEN.FIRST_NAME_PLACEHOLDER}
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
                        label={SIGN_UP_SCREEN.LAST_NAME_LABEL}
                        placeholder={SIGN_UP_SCREEN.LAST_NAME_PLACEHOLDER}
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
                    label={SIGN_UP_SCREEN.EMAIL_LABEL}
                    placeholder={SIGN_UP_SCREEN.EMAIL_PLACEHOLDER}
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
                    <FormLabel>{SIGN_UP_SCREEN.PASSWORD_LABEL}</FormLabel>
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
                    <FormLabel>{SIGN_UP_SCREEN.CONFIRM_PASSWORD_LABEL}</FormLabel>
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

              <SubmitButton label={SIGN_UP_SCREEN.SUBMIT_LABEL} onPress={onSubmit} disabled={isPending} />
            </Form>
          </CardShell>
          <SwitchLink
            prompt={SIGN_UP_SCREEN.SWITCH_PROMPT}
            cta={SIGN_UP_SCREEN.SWITCH_CTA}
            href={ROUTES.SIGN_IN}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
