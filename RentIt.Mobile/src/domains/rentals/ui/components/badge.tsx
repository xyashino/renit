import { Badge, badgeVariants } from '@/src/shared/ui/components/badge';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import type { RentalStatusKey } from '../../domain';
import { MaterialIcons } from '@expo/vector-icons';
import type { VariantProps } from 'class-variance-authority';
import { useColorScheme } from 'nativewind';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

const STATUS_CONFIG: Record<
  RentalStatusKey,
  {
    label: string;
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    variant: BadgeVariant;
    iconTone: 'primary' | 'muted';
  }
> = {
  pending: { label: 'Oczekujące', icon: 'schedule', variant: 'outline', iconTone: 'muted' },
  active: { label: 'Aktywne', icon: 'check-circle', variant: 'default', iconTone: 'primary' },
  completed: { label: 'Zakończone', icon: 'check-circle', variant: 'secondary', iconTone: 'primary' },
  cancelled: { label: 'Anulowane', icon: 'cancel', variant: 'outline', iconTone: 'muted' },
};

type Props = {
  status: RentalStatusKey;
  className?: string;
};

export function StatusBadge({ status, className }: Props) {
  const { colorScheme = 'light' } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const iconColor = cfg.iconTone === 'primary' ? colors.primary : colors['muted-foreground'];

  return (
    <Badge variant={cfg.variant} className={cn('shrink-0', className)}>
      <MaterialIcons name={cfg.icon} size={12} color={iconColor} />
      <Text>{cfg.label}</Text>
    </Badge>
  );
}
