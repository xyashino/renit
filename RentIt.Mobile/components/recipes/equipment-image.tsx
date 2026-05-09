import { THEME } from '@/constants/theme';
import { cn } from '@/lib/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';

const T = THEME.light;

type Props = {
  imageUrl?: string | null;
  iconSize?: number;
  imageClassName?: string;
};

export function EquipmentImage({ imageUrl, iconSize = 56, imageClassName }: Props) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        className={cn('w-full h-full', imageClassName)}
        resizeMode="cover"
      />
    );
  }

  return <MaterialIcons name="construction" size={iconSize} color={T['accent-foreground']} />;
}
