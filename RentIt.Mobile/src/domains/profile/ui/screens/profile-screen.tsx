import { ProfileForm } from '../components/profile-form';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export function ProfileScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
