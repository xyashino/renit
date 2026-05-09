import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SearchX } from 'lucide-react-native';

type NotFoundRecipeProps = {
  title?: string;
  description: string;
  className?: string;
};

export function NotFoundRecipe({
  title = 'Brak wyników',
  description,
  className,
}: NotFoundRecipeProps) {
  return (
    <Alert icon={SearchX} className={className}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
