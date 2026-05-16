import { ScreenHeader } from '@/src/shared/ui';
import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { PROFILE_SCREEN, ROUTES } from '../../constants';
import { useAccountType, useLogout } from '@/src/shared/auth/session';
import { useRouter } from 'expo-router';
import { useProfileForm } from '../../application/hooks/use-profile-form';
import { ProfileForm } from '../recipes/profile-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export function ProfileScreen() {
  const accountType = useAccountType();
  const { logout } = useLogout();
  const router = useRouter();
  const { form, onSubmit, isPending } = useProfileForm();

  async function handleLogout() {
    await logout();
    router.replace(ROUTES.SIGN_IN);
    Alert.alert(PROFILE_SCREEN.LOGOUT_ALERT);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          className="px-4 pt-4 mb-3"
          title={PROFILE_SCREEN.TITLE}
          description={PROFILE_SCREEN.DESCRIPTION}
        />
        <View className="px-4 gap-3">
          <ProfileForm
            form={form}
            accountType={accountType}
            onSubmit={onSubmit}
            isPending={isPending}
          />

          <Button variant="destructive" className="h-12 rounded-xl" onPress={handleLogout}>
            <Text variant="small" className="text-destructive-foreground font-semibold">
              {PROFILE_SCREEN.LOGOUT_LABEL}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
