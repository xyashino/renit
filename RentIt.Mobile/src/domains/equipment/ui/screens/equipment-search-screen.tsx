import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { NotFoundRecipe, StartupSplashScreen } from '@/src/shared/ui';
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
      <View className="bg-card px-6 pt-12 pb-5 border-b border-border">
        <Text className="text-muted-foreground text-xs tracking-widest font-medium mb-1">
          Dzień dobry
        </Text>
        <Text className="text-foreground text-2xl font-bold">
          Co chcesz wypożyczyć?
        </Text>
      </View>


      <View className="pt-6 pb-2">
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
          <NotFoundRecipe
            className="mt-2"
            title="Brak sprzętu"
            description="Brak sprzętu spełniającego kryteria."
          />
        ) : null}
      </View>
    </ScrollView>
  );
}
