import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Link, type Href } from 'expo-router';
import { View } from 'react-native';

type SwitchLinkProps = {
  prompt: string;
  cta: string;
  href: Href;
};

export function SwitchLink({ prompt, cta, href }: SwitchLinkProps) {
  return (
    <View className="items-center gap-4">
      <Separator />
      <Text variant="small" className="text-muted-foreground">
        {prompt}{' '}
        <Link href={href} asChild>
          <Text variant="small" className="text-foreground font-semibold">
            {cta}
          </Text>
        </Link>
      </Text>
    </View>
  );
}
