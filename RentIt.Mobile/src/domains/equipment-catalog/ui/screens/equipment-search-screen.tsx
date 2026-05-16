import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { EmptyStateRecipe, ScreenHeader } from '@/src/shared/ui';
import { useEquipmentSearchFilters, useEquipmentSearchList } from '../../application';
import { BROWSE_SCREEN, equipmentDetailHref } from '../../constants';
import type { Category } from '@/src/shared/domain/category';
import { useRouter } from 'expo-router';
import { Suspense } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Card } from '../components/card';

const T = THEME.light;

export function EquipmentSearchScreen() {
  const { selectedCategory, toggleCategory, categories } = useEquipmentSearchFilters();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        className="px-6 pt-6"
        title={BROWSE_SCREEN.TITLE}
        description={BROWSE_SCREEN.SUBTITLE}
      />

      <View className="pb-2">
        <Text className="text-foreground font-bold text-base mb-4 px-6">
          {BROWSE_SCREEN.CATEGORIES_LABEL}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
        >
          {categories.map((cat) => {
            const active = selectedCategory?.id === cat.id;
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
        </ScrollView>
      </View>

      <Suspense fallback={<EquipmentSearchListLoading />}>
        <EquipmentSearchList selectedCategory={selectedCategory} />
      </Suspense>
    </ScrollView>
  );
}

function EquipmentSearchListLoading() {
  return (
    <View className="px-6 py-12 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}

function EquipmentSearchList({ selectedCategory }: { selectedCategory: Category | null }) {
  const equipment = useEquipmentSearchList(selectedCategory);
  const router = useRouter();

  return (
    <View className="gap-5 px-6">
      {equipment.map((item) => (
        <Card key={item.id} item={item} onPress={() => router.push(equipmentDetailHref(item.id))} />
      ))}
      {equipment.length === 0 ? (
        <EmptyStateRecipe
          className="mt-2"
          title={BROWSE_SCREEN.EMPTY_TITLE}
          description={BROWSE_SCREEN.EMPTY_DESCRIPTION}
          icon="construction"
        />
      ) : null}
    </View>
  );
}
