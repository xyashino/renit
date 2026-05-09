import { AuthBranding } from '@/components/auth/auth-branding';
import { AuthSwitchLink } from '@/components/auth/auth-switch-link';
import { SignInFormCard } from '@/components/forms/sign-in-form-card';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export default function SignInScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow items-center justify-center p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[500px] gap-6">
          <AuthBranding subtitle="Witaj ponownie" />
          <SignInFormCard />
          <AuthSwitchLink
            prompt="Nie masz konta?"
            cta="Zarejestruj się"
            href="/(auth)/sign-up"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
