import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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
