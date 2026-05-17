import { EmptyStateRecipe } from '@/src/shared/ui/recipes/empty-state';
import { ScreenHeader } from '@/src/shared/ui/recipes/screen-header';
import { StartupSplashScreen } from '@/src/shared/ui/screens/startup-splash-screen';
import { Suspense } from 'react';
import { ScrollView, View } from 'react-native';
import { useFavorites } from '../../favorites/application/hooks/use-favorites';
import { equipmentDetailHref } from '../../constants';
import { useRouter } from 'expo-router';
import { Card } from '../recipes/card';

export function FavoritesScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <FavoritesScreenContent />
    </Suspense>
  );
}

function FavoritesScreenContent() {
  const router = useRouter();
  const { favorites } = useFavorites();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        className="px-6 pt-6"
        title="Ulubione"
        description="Zapisane oferty sprzętu."
      />

      {favorites.length === 0 ? (
        <View className="px-6 pt-4">
          <EmptyStateRecipe
            title="Brak ulubionych"
            description="Dodaj sprzęt do ulubionych na stronie szczegółów oferty."
          />
        </View>
      ) : (
        <View className="px-6 pt-2 gap-4">
          {favorites.map((item) => (
            <Card
              key={item.id}
              item={item}
              onPress={() => router.push(equipmentDetailHref(item.id))}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
