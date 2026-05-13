import { Text } from '@/src/shared/ui/components/text';
import { cn } from '@/src/shared/utils';
import { EmptyStateRecipe, ErrorAlertRecipe, ScreenHeader, StartupSplashScreen } from '@/src/shared/ui';
import { RENTAL_TABS, RENTALS_SCREEN, useMyRentals, type RentalTab } from '../../application';
import { useRouter } from 'expo-router';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { RentalCard } from '../components/rental-card';

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
      <ScreenHeader
        className="px-6 pt-6"
        title={RENTALS_SCREEN.TITLE}
        description={RENTALS_SCREEN.SUBTITLE}
      />

      <View className="flex-row mx-6 mb-2 bg-card border border-border rounded-xl overflow-hidden">
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
          <EmptyStateRecipe
            title={RENTALS_SCREEN.EMPTY_TITLE}
            description={
              activeTab === 'active'
                ? RENTALS_SCREEN.EMPTY_ACTIVE
                : activeTab === 'pending'
                  ? RENTALS_SCREEN.EMPTY_PENDING
                  : RENTALS_SCREEN.EMPTY_HISTORY
            }
          />
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
