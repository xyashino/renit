import { StartupSplashScreen } from '@/src/shared/ui';
import { useEditEquipment } from '../../application';
import { EditEquipmentForm } from '../recipes';
import { Suspense } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export function EditEquipmentScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <EditEquipmentScreenContent />
    </Suspense>
  );
}

function EditEquipmentScreenContent() {
  const { form, categories, isPending, submit } = useEditEquipment();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <EditEquipmentForm
          form={form}
          categories={categories}
          isPending={isPending}
          onSubmit={submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
