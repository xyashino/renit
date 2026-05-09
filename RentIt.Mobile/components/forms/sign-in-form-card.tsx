import { AuthCardShell } from '@/components/auth/auth-card-shell';
import { FormInputItem } from '@/components/forms/form-input-item';
import { FormPasswordItem } from '@/components/forms/form-password-item';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { useSignIn } from '@/lib/hooks/use-sign-in';


export function SignInFormCard() {
  const { form, onSubmit, isPending } = useSignIn();

  return (
    <AuthCardShell>
      <Form {...form}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInputItem
              label="Adres e-mail"
              placeholder="uzytkownik@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormPasswordItem
              label="Hasło"
              {...field}
            />
          )}
        />

        <Button size="lg" onPress={onSubmit} disabled={isPending}>
          <Text variant="small" className="text-primary-foreground font-semibold">
            Zaloguj się
          </Text>
        </Button>
      </Form>
    </AuthCardShell>
  );
}
