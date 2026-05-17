import { ScreenHeader } from '@/src/shared/ui/recipes/screen-header';
import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { useProfile } from '../../application/hooks/use-profile';
import { ProfileForm } from '../recipes/profile-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export function ProfileScreen() {
  const { form, onSubmit, isPending, accountType, onLogout } = useProfile();

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
          title="Profil"
          description="Twoje dane i ustawienia konta."
        />
        <View className="px-4 gap-3">
          <ProfileForm
            form={form}
            accountType={accountType}
            onSubmit={onSubmit}
            isPending={isPending}
          />

          <Button variant="destructive" className="h-12 rounded-xl" onPress={onLogout}>
            <Text variant="small" className="text-destructive-foreground font-semibold">
              Wyloguj
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
