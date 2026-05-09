import { RentalCard } from '@/components/recipes/rental-card';
import { ErrorAlertRecipe } from '@/components/recipes/error-alert';
import { StartupSplashScreen } from '@/components/recipes/startup-splash-screen';
import { Text } from '@/components/ui/text';
import { THEME } from '@/constants/theme';
import { RENTAL_TABS, useMyRentals, type RentalTab } from '@/lib/hooks/use-my-rentals';
import { cn } from '@/lib/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const T = THEME.light;

export default function RentalsScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <RentalsScreenContent />
    </Suspense>
  );
}

function RentalsScreenContent() {
  const { activeTab, handleTabChange, rentals, isError, refetch } = useMyRentals();
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-card px-6 pt-6 pb-5 border-b border-border">
        <Text className="text-foreground text-2xl font-bold">Moje wypożyczenia</Text>
        <Text className="text-muted-foreground text-sm mt-1">
          Zarządzaj swoimi rezerwacjami sprzętu
        </Text>
      </View>

      <View className="flex-row mx-6 mt-5 mb-2 bg-card border border-border rounded-xl overflow-hidden">
        {RENTAL_TABS.map((tab, index) => (
          <Pressable
            key={tab.key}
            onPress={() => handleTabChange(tab.key as RentalTab)}
            className={cn(
              'flex-1 py-3 items-center justify-center',
              activeTab === tab.key ? 'bg-primary' : 'bg-card',
              index < RENTAL_TABS.length - 1 && 'border-r border-border'
            )}
          >
            <Text
              className={cn(
                'text-xs font-semibold tracking-wide',
                activeTab === tab.key ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>


      <View className="px-6 gap-4">
        {isError ? (
          <ErrorAlertRecipe
            title="Nie udalo sie zaladowac wypozyczen."
            description="Sprawdz polaczenie i sprobuj ponownie."
            onRetry={() => refetch()}
          />
        ) : rentals.length === 0 ? (
          <View className="items-center py-12 gap-3">
            <View className="bg-accent rounded-full w-16 h-16 items-center justify-center">
              <MaterialIcons name="assignment" size={32} color={T['accent-foreground']} />
            </View>
            <Text className="text-foreground font-semibold text-base">Brak wypożyczeń</Text>
            <Text className="text-muted-foreground text-sm text-center">
              {activeTab === 'active'
                ? 'Nie masz aktywnych wypożyczeń'
                : activeTab === 'pending'
                  ? 'Brak oczekujących rezerwacji'
                  : 'Twoja historia jest pusta'}
            </Text>
          </View>
        ) : (
          rentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              showReview={activeTab === 'history' && rental.status?.key === 'available'}
              onPress={() => router.push({ pathname: '/rental/[id]', params: { id: String(rental.id) } })}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
