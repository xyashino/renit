import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { EmptyStateRecipe, ScreenHeader, StartupSplashScreen } from '@/src/shared/ui';
import { useEquipmentSearch } from '../../application';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { EquipmentCard } from '../components/equipment-card';

const T = THEME.light;

export function EquipmentSearchScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <EquipmentSearchScreenContent />
    </Suspense>
  );
}

function EquipmentSearchScreenContent() {
  const {
    selectedCategory, toggleCategory,
    categories,
    equipment,
  } = useEquipmentSearch();
  const router = useRouter();

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

      <View className="pb-2">
        <Text className="text-foreground font-bold text-base mb-4 px-6">Kategorie</Text>
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
                className={cn('items-center justify-center px-5 pt-4 pb-3 rounded-xl gap-2 min-w-[80px]', active ? 'bg-primary' : 'bg-card border border-border')}
              >
                <MaterialIcons
                  name={cat.icon}
                  size={24}
                  color={active ? T['primary-foreground'] : T['muted-foreground']}
                />
                <Text
                  className={cn('text-xs font-semibold tracking-wide', active ? 'text-primary-foreground' : 'text-muted-foreground')}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="gap-3 px-6">
        {equipment.map((item) => (
          <EquipmentCard key={item.id} item={item} onPress={() => router.push(`/equipment/${item.id}`)} />
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
    </ScrollView>
  );
}
