import { EmptyStateRecipe, ErrorAlertRecipe, ScreenHeader, StartupSplashScreen } from '@/src/shared/ui';
import { useFavoritesList } from '../../application';
import { FAVORITES_SCREEN } from '../../constants';
import { Suspense } from 'react';
import { ScrollView, View } from 'react-native';
import { Card } from '../components/card';

export function FavoritesScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <FavoritesScreenContent />
    </Suspense>
  );
}

function FavoritesScreenContent() {
  const { items, isError, refetch, openEquipment } = useFavoritesList();

  if (isError) {
    return (
      <View className="flex-1 bg-background px-6 justify-center">
        <ErrorAlertRecipe
          title={FAVORITES_SCREEN.ERROR_TITLE}
          description={FAVORITES_SCREEN.ERROR_DESCRIPTION}
          retryLabel={FAVORITES_SCREEN.RETRY_LABEL}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        className="px-6 pt-6"
        title={FAVORITES_SCREEN.TITLE}
        description={FAVORITES_SCREEN.SUBTITLE}
      />

      {items.length === 0 ? (
        <View className="px-6 pt-4">
          <EmptyStateRecipe
            title={FAVORITES_SCREEN.EMPTY_TITLE}
            description={FAVORITES_SCREEN.EMPTY_DESCRIPTION}
          />
        </View>
      ) : (
        <View className="px-6 pt-2 gap-4">
          {items.map((item) => (
            <Card key={item.id} item={item} onPress={() => openEquipment(item.id)} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
