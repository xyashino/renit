import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';

type SubmitButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function SubmitButton({ label, onPress, disabled = false }: SubmitButtonProps) {
  return (
    <Button size="lg" onPress={onPress} disabled={disabled}>
      <Text variant="small" className="text-primary-foreground font-semibold">
        {label}
      </Text>
    </Button>
  );
}
