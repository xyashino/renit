import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
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
