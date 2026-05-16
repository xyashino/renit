import { Badge } from '@/src/shared/ui/components/badge';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import type { AccountType } from '@/src/domains/authentication/domain/account-type';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { PROFILE_ACCOUNT_TYPE } from '../../constants';

type Props = {
  accountType: AccountType | null | undefined;
};

export function AccountTypeInfo({ accountType }: Props) {
  const { colorScheme = 'light' } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  if (!accountType) return null;

  const copy = PROFILE_ACCOUNT_TYPE[accountType];
  const iconName = accountType === 'owner' ? 'storefront' : 'person';

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name={iconName} size={20} color={colors.primary} />
        <Badge variant="secondary">
          <Text>{copy.badge}</Text>
        </Badge>
      </View>
      <Text variant="small" className="text-muted-foreground leading-5">
        {copy.description}
      </Text>
      <Text variant="small" className="text-muted-foreground text-xs">
        {PROFILE_ACCOUNT_TYPE.HINT}
      </Text>
    </View>
  );
}
