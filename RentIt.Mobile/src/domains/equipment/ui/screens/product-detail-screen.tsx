import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardTitle } from '@/src/shared/ui/components/card';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { ErrorAlertRecipe } from '@/src/shared/ui/recipes/error-alert';
import { StartupSplashScreen } from '@/src/shared/ui/screens/startup-splash-screen';
import { NotFoundRecipe } from '../recipes/not-found';
import { BookingSection } from '@/src/domains/rentals';
import { useProductDetail } from '../../application/hooks/use-product-detail';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { formatCategoryLabels } from '@/src/shared/domain/category';
import { EquipmentImage } from '@/src/shared/ui/equipment';

export function ProductDetailScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <ProductDetailScreenContent />
    </Suspense>
  );
}

function ProductDetailScreenContent() {
  const {
    equipment,
    isFavorite,
    isFavoritePending,
    toggleFavorite,
    goBack,
  } = useProductDetail();
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[scheme];

  if (!equipment) {
    return (
      <View className="flex-1 bg-background px-6 justify-center gap-4">
        <NotFoundRecipe
          title="Nie znaleziono sprzętu"
          description="Ta oferta może już nie istnieć albo została ukryta."
        />
        <Button variant="outline" onPress={goBack} className="self-start">
          <Text>Wróć</Text>
        </Button>
      </View>
    );
  }

  const equipmentName = equipment.name?.trim();
  const displayEquipmentName = equipmentName ? equipmentName.toUpperCase() : 'SPRZET';

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 h-14 border-b border-border bg-card">
        <Pressable onPress={goBack} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-foreground font-bold text-lg flex-1" numberOfLines={1}>
          Szczegóły sprzętu
        </Text>
        <Pressable onPress={toggleFavorite} disabled={isFavoritePending} hitSlop={8}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={isFavorite ? colors.primary : colors.foreground}
          />
        </Pressable>
      </View>

      <ScrollView
        className="px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="rounded-xl overflow-hidden h-40 bg-accent mb-3 mt-3">
          <EquipmentImage
            imageUrl={equipment.imageUrl}
            iconSize={72}
            imageClassName="absolute inset-0"
          />
        </View>

        <View className="mb-3 gap-1">
          <Text variant="h3" className="text-foreground" numberOfLines={2}>
            {displayEquipmentName}
          </Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-3xl font-bold text-primary">{equipment.pricePerDay} zł</Text>
            <Text variant="small" className="text-muted-foreground">
              / dzień
            </Text>
          </View>
        </View>

        <Card className="py-0 mb-3">
          <CardContent className="px-3 py-3 gap-2">
            <CardTitle className="text-foreground">Szczegóły</CardTitle>
            {equipment.description ? (
              <Text variant="default" className="text-foreground leading-6">
                {equipment.description}
              </Text>
            ) : null}

            <View className="flex-row flex-wrap gap-x-4 gap-y-2">
              {equipment.deposit > 0 ? (
                <View className="flex-row items-center gap-1.5">
                  <MaterialIcons name="security" size={16} color={colors['muted-foreground']} />
                  <Text variant="small" className="text-muted-foreground">
                    Kaucja: {equipment.deposit} zł
                  </Text>
                </View>
              ) : null}
              {equipment.categories?.length ? (
                <Text variant="small" className="text-muted-foreground">
                  {formatCategoryLabels(equipment.categories)}
                </Text>
              ) : null}
            </View>
          </CardContent>
        </Card>

        <BookingSection
          equipmentId={equipment.id}
          pricePerDay={equipment.pricePerDay}
          deposit={equipment.deposit}
          pickupAddress={equipment.address}
        />
      </ScrollView>
    </View>
  );
}
