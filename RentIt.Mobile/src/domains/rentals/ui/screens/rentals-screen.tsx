import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { cn } from '@/src/shared/utils';
import { ErrorAlertRecipe, StartupSplashScreen } from '@/src/shared/ui';
import { RENTAL_TABS, RENTALS_SCREEN, useMyRentals, type RentalTab } from '../../application';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { RentalCard } from '../components/rental-card';

const T = THEME.light;

export function RentalsScreen() {
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
        <Text className="text-foreground text-2xl font-bold">{RENTALS_SCREEN.TITLE}</Text>
        <Text className="text-muted-foreground text-sm mt-1">{RENTALS_SCREEN.SUBTITLE}</Text>
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
            title={RENTALS_SCREEN.ERROR_TITLE}
            description={RENTALS_SCREEN.ERROR_DESC}
            onRetry={() => refetch()}
          />
        ) : rentals.length === 0 ? (
          <View className="items-center py-12 gap-3">
            <View className="bg-accent rounded-full w-16 h-16 items-center justify-center">
              <MaterialIcons name="assignment" size={32} color={T['accent-foreground']} />
            </View>
            <Text className="text-foreground font-semibold text-base">{RENTALS_SCREEN.EMPTY_TITLE}</Text>
            <Text className="text-muted-foreground text-sm text-center">
              {activeTab === 'active'
                ? RENTALS_SCREEN.EMPTY_ACTIVE
                : activeTab === 'pending'
                  ? RENTALS_SCREEN.EMPTY_PENDING
                  : RENTALS_SCREEN.EMPTY_HISTORY}
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
