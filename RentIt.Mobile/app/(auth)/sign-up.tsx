import { AuthBranding } from '@/components/auth/auth-branding';
import { AuthSwitchLink } from '@/components/auth/auth-switch-link';
import { SignUpFormCard } from '@/components/forms/sign-up-form-card';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export default function SignUpScreen() {
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
          <AuthBranding subtitle="Utwórz konto" />
          <SignUpFormCard />
          <AuthSwitchLink
            prompt="Masz już konto?"
            cta="Zaloguj się"
            href="/(auth)/sign-in"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
