import { Text } from '@/src/shared/ui/components/text';
import { cn } from '@/src/shared/utils';
import { EmptyStateRecipe } from '@/src/shared/ui/recipes/empty-state';
import { ScreenHeader } from '@/src/shared/ui/recipes/screen-header';
import { useBrowse } from '../../application/hooks/use-browse';
import { equipmentDetailHref } from '../../constants';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Card } from '../recipes/card';

export function BrowseScreen() {
  const router = useRouter();
  const { categories, categoryId, equipment, isPending, toggleCategory } = useBrowse();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        className="px-6 pt-6"
        title="Co chcesz wypożyczyć?"
        description="Przeglądaj dostępny sprzęt i wybierz kategorię."
      />

      <View className="pb-2 px-6">
        <Text className="text-foreground font-bold text-base mb-4">
          Kategorie
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {categories.map((cat) => {
            const active = categoryId === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat)}
                className={cn('items-center justify-center px-4 py-2.5 rounded-xl', active ? 'bg-primary' : 'bg-card border border-border')}
              >
                <Text
                  className={cn('text-xs font-semibold tracking-wide text-center', active ? 'text-primary-foreground' : 'text-muted-foreground')}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isPending ? (
        <View className="px-6 py-12 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <View className="gap-5 px-6">
          {equipment.map((item) => (
            <Card key={item.id} item={item} onPress={() => router.push(equipmentDetailHref(item.id))} />
          ))}
          {equipment.length === 0 ? (
            <EmptyStateRecipe
              className="mt-2"
              title="Brak sprzętu"
              description="Brak sprzętu spełniającego kryteria."
              icon="construction"
            />
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}
