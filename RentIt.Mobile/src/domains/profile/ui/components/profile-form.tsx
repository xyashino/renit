import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/components/card';
import { Form, FormField } from '@/src/shared/ui/components/form';
import { Separator } from '@/src/shared/ui/components/separator';
import { Text } from '@/src/shared/ui/components/text';
import { useLogout } from '@/src/shared/auth/session';
import { FormInputItem } from '@/src/shared/ui';
import { useProfileForm } from '../../application/hooks/use-profile-form';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

export function ProfileForm() {
  const { logout } = useLogout();
  const router = useRouter();
  const { form, onSubmit, isPending } = useProfileForm();

  async function handleLogout() {
    await logout();
    Alert.alert('Wylogowano');
    router.replace('/(auth)/sign-in');
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Dane osobowe</CardTitle>
      </CardHeader>
      <CardContent className="gap-6">
        <Form {...form}>
          <View className="flex-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormInputItem
                  label="Imię"
                  placeholder="Jan"
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
                  label="Nazwisko"
                  placeholder="Kowalski"
                  autoCapitalize="words"
                  {...field}
                />
              )}
            />
          </View>

          <Button
            className="h-12 mt-2"
            onPress={onSubmit}
            disabled={isPending}
          >
            <Text variant="small" className="text-primary-foreground font-semibold">
              Zapisz zmiany
            </Text>
          </Button>
        </Form>

        <Separator />

        <Button variant="destructive" className="h-12" onPress={handleLogout}>
          <Text variant="small" className="text-destructive-foreground tracking-widest font-semibold">
            Wyloguj
          </Text>
        </Button>
      </CardContent>
    </Card>
  );
}
