import { EditEquipmentForm } from '@/components/forms/edit-equipment-form';
import { StartupSplashScreen } from '@/components/recipes/startup-splash-screen';
import { useEditEquipment } from '@/lib/hooks/use-edit-equipment';
import { Suspense } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function EquipmentEditScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <EquipmentEditScreenContent />
    </Suspense>
  );
}

function EquipmentEditScreenContent() {
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
