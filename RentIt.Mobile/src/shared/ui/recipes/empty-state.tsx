import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { Text } from '../components/text';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

type EmptyStateRecipeProps = {
  title: string;
  description: string;
  icon?: IconName;
  className?: string;
};

const T = THEME.light;

export function EmptyStateRecipe({
  title,
  description,
  icon = 'assignment',
  className,
}: EmptyStateRecipeProps) {
  return (
    <View className={cn('items-center py-12 gap-3', className)}>
      <View className="bg-accent rounded-full w-16 h-16 items-center justify-center">
        <MaterialIcons name={icon} size={32} color={T['accent-foreground']} />
      </View>
      <Text className="text-foreground font-semibold text-base">{title}</Text>
      <Text className="text-muted-foreground text-sm text-center">{description}</Text>
    </View>
  );
}
