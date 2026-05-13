import { Button, type ButtonProps } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { cn } from '@/src/shared/utils';
import { View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: ButtonProps['onPress'];
  className?: string;
  titleNumberOfLines?: number;
};

export function ScreenHeader({
  title,
  description,
  actionLabel,
  onActionPress,
  className,
  titleNumberOfLines,
}: ScreenHeaderProps) {
  return (
    <View className={cn('mb-8', className)}>
      <View className="flex-row items-center justify-between">
        <Text
          variant="h3"
          className="text-foreground font-extrabold tracking-tight flex-1 pr-3"
          numberOfLines={titleNumberOfLines}
        >
          {title}
        </Text>
        {actionLabel && onActionPress ? (
          <Button className="rounded-md" onPress={onActionPress}>
            <Text variant="small" className="text-primary-foreground">
              {actionLabel}
            </Text>
          </Button>
        ) : null}
      </View>
      {description ? (
        <Text variant="muted" className="mt-2">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
