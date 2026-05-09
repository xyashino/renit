import { NewRentalForm } from '@/components/forms/new-rental-form';
import { EquipmentImage } from '@/components/recipes/equipment-image';
import { ErrorAlertRecipe } from '@/components/recipes/error-alert';
import { NotFoundRecipe } from '@/components/recipes/not-found';
import { StartupSplashScreen } from '@/components/recipes/startup-splash-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { THEME } from '@/constants/theme';
import { useNewRental } from '@/lib/hooks/use-new-rental';
import { useProductDetail } from '@/lib/hooks/use-product-detail';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function ProductDetailScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <ProductDetailScreenContent />
    </Suspense>
  );
}

function ProductDetailScreenContent() {
  const { equipment, reviews, avgRating, isError, goBack } = useProductDetail();
  const { form, days, totalPrice, isPending, submit } = useNewRental();
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[scheme];

  if (isError) {
    return (
      <View className="flex-1 bg-background px-6 justify-center">
        <ErrorAlertRecipe
          title="Nie udało się załadować sprzętu"
          description="Wystąpił problem podczas pobierania danych."
          retryLabel="Wróć"
          onRetry={goBack}
        />
      </View>
    );
  }

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full h-56 bg-accent items-center justify-center">
          <EquipmentImage imageUrl={equipment.imageUrl} iconSize={72} imageClassName="absolute inset-0" />
          <Pressable
            className="absolute top-4 left-4 bg-card/95 border border-border w-10 h-10 items-center justify-center rounded-full"
            onPress={goBack}
          >
            <MaterialIcons name="arrow-back" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <View className="px-6 pt-6 gap-5">
          <View className="gap-2">
            <Text variant="h3" className="text-foreground" numberOfLines={2}>
              {displayEquipmentName}
            </Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-3xl font-bold text-primary">{equipment.pricePerDay} zł</Text>
              <Text variant="small" className="text-muted-foreground">/ Dzień</Text>
            </View>
          </View>

          <Card className="py-0">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-foreground">Szczegóły</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="px-4 pt-3 pb-4 gap-3">
              {equipment.description ? (
                <Text variant="default" className="text-foreground leading-6">
                  {equipment.description}
                </Text>
              ) : null}

              <View className="flex-row flex-wrap gap-2.5 mt-1">
                {equipment.address ? (
                  <View className="flex-row items-center gap-1 bg-muted rounded-md border border-border px-2 py-2">
                    <MaterialIcons name="location-on" size={14} color={colors.foreground} />
                    <Text variant="small" className="text-xs text-foreground">{equipment.address}</Text>
                  </View>
                ) : null}
                {equipment.deposit > 0 ? (
                  <View className="flex-row items-center gap-1 bg-muted rounded-md border border-border px-2 py-2">
                    <MaterialIcons name="security" size={14} color={colors.foreground} />
                    <Text variant="small" className="text-xs text-foreground">Kaucja: {equipment.deposit} zł</Text>
                  </View>
                ) : null}
                {equipment.category ? (
                  <View className="flex-row items-center gap-1 bg-muted rounded-md border border-border px-2 py-2">
                    <MaterialIcons name="category" size={14} color={colors.foreground} />
                    <Text variant="small" className="text-xs text-foreground">{equipment.category.label}</Text>
                  </View>
                ) : null}
                {avgRating != null ? (
                  <View className="flex-row items-center gap-1 bg-muted rounded-md border border-border px-2 py-2">
                    <MaterialIcons name="star" size={14} color={colors.primary} />
                    <Text variant="small" className="text-xs text-foreground">
                      {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'opinia' : 'opinii'})
                    </Text>
                  </View>
                ) : null}
              </View>
            </CardContent>
          </Card>

          {reviews.length > 0 && (
            <Card className="py-0">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-foreground">OPINIE ({reviews.length})</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="px-4 pt-3 pb-4 gap-4">
                {reviews.slice(0, 3).map((review) => (
                  <View key={review.id} className="gap-1">
                    <View className="flex-row items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialIcons
                          key={star}
                          name={star <= review.rating ? 'star' : 'star-outline'}
                          size={14}
                          color={colors.primary}
                        />
                      ))}
                    </View>
                    {review.comment ? (
                      <Text variant="small" className="text-foreground">{review.comment}</Text>
                    ) : null}
                  </View>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="py-0">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-foreground">REZERWACJA</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="px-4 pt-4 pb-4 gap-4">
              <NewRentalForm form={form} isPending={isPending} onSubmit={submit} />

              {days != null && totalPrice != null ? (
                <View className="rounded-xl border border-border bg-muted p-4 gap-2">
                  <Text className="text-foreground font-semibold">Podsumowanie</Text>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground text-sm">
                      {days} {days === 1 ? 'dzień' : 'dni'} × {equipment.pricePerDay} zł
                    </Text>
                    <Text className="text-foreground text-sm">{totalPrice} zł</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground text-sm">Kaucja</Text>
                    <Text className="text-foreground text-sm">{equipment.deposit} zł</Text>
                  </View>
                  <Separator />
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-foreground font-bold text-base">Razem</Text>
                    <Text className="text-primary font-bold text-xl">{totalPrice} zł</Text>
                  </View>
                </View>
              ) : null}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
