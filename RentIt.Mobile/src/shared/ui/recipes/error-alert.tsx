import { Alert, AlertDescription, AlertTitle } from '@/src/shared/ui/components/alert';
import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { AlertCircleIcon } from 'lucide-react-native';

type ErrorAlertRecipeProps = {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorAlertRecipe({
  title = 'Wystapil blad.',
  description = 'Nie udalo sie zaladowac danych. Sprobuj ponownie.',
  retryLabel = 'Sprobuj ponownie',
  onRetry,
}: ErrorAlertRecipeProps) {
  return (
    <Alert variant="destructive" icon={AlertCircleIcon}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <Button size="sm" onPress={onRetry} className="ml-6 mt-1 self-start">
        <Text variant="small" className="text-primary-foreground">
          {retryLabel}
        </Text>
      </Button>
    </Alert>
  );
}
