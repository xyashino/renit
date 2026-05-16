import { Text } from '@/src/shared/ui/components/text';
import { View } from 'react-native';

type BrandingProps = {
  subtitle: string;
};

export function Branding({ subtitle }: BrandingProps) {
  return (
    <View className="items-center gap-1">
      <Text variant="h2" className="text-foreground tracking-wide border-b-0 pb-0">
        RentIT
      </Text>
      <Text variant="small" className="text-muted-foreground tracking-wide">
        {subtitle}
      </Text>
    </View>
  );
}
