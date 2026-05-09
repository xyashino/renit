import { AddEquipmentForm } from '@/components/forms/add-equipment-form';
import { useAddEquipment } from '@/lib/hooks/use-add-equipment';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function AddEquipmentScreen() {
  const { form, categories, isPending, submit } = useAddEquipment();

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
        <AddEquipmentForm
          form={form}
          categories={categories}
          isPending={isPending}
          onSubmit={submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
