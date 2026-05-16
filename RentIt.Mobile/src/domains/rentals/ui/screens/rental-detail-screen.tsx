import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { ErrorAlertRecipe, StartupSplashScreen } from '@/src/shared/ui';
import { ScrollView, View } from 'react-native';
import { useRentalDetail } from '../../application';
import { RENTAL_DETAIL_SCREEN } from '../../constants';
import { RentalDetailContent } from '../recipes/rental-detail-content';

export function RentalDetailScreen() {
  const {
    rental,
    isError,
    isLoading,
    isPending,
    isOwner,
    days,
    totalPrice,
    statusMutation,
    confirmCancel,
    refetch,
    goBack,
  } = useRentalDetail();

  if (isLoading) {
    return <StartupSplashScreen />;
  }

  if (isError || !rental) {
    return (
      <View className="flex-1 bg-background justify-center px-4 gap-4">
        <ErrorAlertRecipe
          title={RENTAL_DETAIL_SCREEN.ERROR_TITLE}
          description={RENTAL_DETAIL_SCREEN.ERROR_DESC}
          retryLabel={RENTAL_DETAIL_SCREEN.RETRY_LABEL}
          onRetry={() => refetch()}
        />
        <Button variant="outline" onPress={goBack} className="self-start rounded-xl">
          <Text>{RENTAL_DETAIL_SCREEN.BACK_LABEL}</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="muted" className="px-4 pt-4 pb-3">
        {RENTAL_DETAIL_SCREEN.DESCRIPTION}
      </Text>
      <View className="px-4">
        <RentalDetailContent
          rental={rental}
          days={days}
          totalPrice={totalPrice}
          isOwner={isOwner}
          isPending={isPending}
          statusMutation={statusMutation}
          onCancel={confirmCancel}
        />
      </View>
    </ScrollView>
  );
}
