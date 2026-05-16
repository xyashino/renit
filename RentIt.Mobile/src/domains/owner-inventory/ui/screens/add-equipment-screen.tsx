import { useAddEquipment } from '../../application';
import { FormEquipment } from '../recipes/form-equipment';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export function AddEquipmentScreen() {
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
        <FormEquipment
          form={form}
          categories={categories}
          isPending={isPending}
          mode="add"
          onSubmit={submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
