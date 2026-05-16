import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { Image as RNImage } from 'react-native';

const T = THEME.light;

type Props = {
  imageUrl?: string | null;
  iconSize?: number;
  imageClassName?: string;
};

export function Image({ imageUrl, iconSize = 56, imageClassName }: Props) {
  if (imageUrl) {
    return (
      <RNImage
        source={{ uri: imageUrl }}
        className={cn('w-full h-full', imageClassName)}
        resizeMode="cover"
      />
    );
  }

  return <MaterialIcons name="construction" size={iconSize} color={T['accent-foreground']} />;
}
