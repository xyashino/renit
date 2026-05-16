import { Text } from '@/src/shared/ui/components/text';
import { cn } from '@/src/shared/utils';
import { EmptyStateRecipe, ErrorAlertRecipe, ScreenHeader, StartupSplashScreen } from '@/src/shared/ui';
import { RENTAL_TABS, useRentalsList, type RentalTab } from '../../application';
import {
  RENTALS_SCREEN_CLIENT,
  RENTALS_SCREEN_OWNER,
  rentalDetailHref,
} from '../../constants';
import { useRouter } from 'expo-router';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Card } from '../components/card';

export function RentalsScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <RentalsScreenContent />
    </Suspense>
  );
}

function RentalsScreenContent() {
  const { activeTab, handleTabChange, rentals, isError, refetch, isOwner } = useRentalsList();
  const router = useRouter();
  const copy = isOwner ? RENTALS_SCREEN_OWNER : RENTALS_SCREEN_CLIENT;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader className="px-6 pt-6" title={copy.title} description={copy.subtitle} />

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
            title={copy.errorTitle}
            description={copy.errorDesc}
            onRetry={() => refetch()}
          />
        ) : rentals.length === 0 ? (
          <EmptyStateRecipe
            title={copy.emptyTitle}
            description={
              activeTab === 'active'
                ? copy.emptyActive
                : activeTab === 'pending'
                  ? copy.emptyPending
                  : copy.emptyHistory
            }
          />
        ) : (
          rentals.map((rental) => (
            <Card
              key={rental.id}
              rental={rental}
              onPress={() => router.push(rentalDetailHref(rental.id, isOwner))}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
