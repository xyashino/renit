import { EquipmentImage } from '@/components/recipes/equipment-image';
import { NotFoundRecipe } from '@/components/recipes/not-found';
import { StartupSplashScreen } from '@/components/recipes/startup-splash-screen';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { THEME } from '@/constants/theme';
import { useMyEquipment } from '@/lib/hooks/use-my-equipment';
import type { Equipment } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Suspense } from 'react';
import { ScrollView, View } from 'react-native';

const T = THEME.light;

type GearStatus = 'available' | 'rented' | 'unavailable';

const STATUS_STYLES: Record<GearStatus, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
  available: { variant: 'default', label: 'Dostępny' },
  rented: { variant: 'secondary', label: 'Wypożyczony' },
  unavailable: { variant: 'destructive', label: 'Niedostępny' },
};

export default function EquipmentScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <EquipmentScreenContent />
    </Suspense>
  );
}

function EquipmentScreenContent() {
  const { myEquipment, confirmDelete } = useMyEquipment();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <View className="flex-row items-center justify-between">
            <Text variant="h3" className="text-foreground font-extrabold tracking-tight">
              Mój sprzęt
            </Text>
            <Button className="rounded-md" onPress={() => router.push('/equipment/add')}>
              <Text variant="small" className="text-primary-foreground">Dodaj</Text>
            </Button>
          </View>
          <Text variant="muted" className="mt-2">Zarządzaj swoimi ogłoszeniami.</Text>
        </View>

        {myEquipment.length === 0 ? (
          <NotFoundRecipe
            title="Brak sprzętu"
            description="Dodaj swój pierwszy sprzęt, aby zacząć zarabiać."
          />
        ) : (
          <View className="gap-5">
            {myEquipment.map((item) => (
              <EquipmentListCard
                key={item.id}
                item={item}
                onEdit={() => router.push(`/equipment/edit?id=${item.id}`)}
                onViewRentals={() => router.push(`/equipment/rentals?id=${item.id}`)}
                onDelete={() => confirmDelete(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

type EquipmentListCardProps = {
  item: Equipment;
  onEdit: () => void;
  onViewRentals: () => void;
  onDelete: () => void;
};

function EquipmentListCard({ item, onEdit, onViewRentals, onDelete }: EquipmentListCardProps) {
  const statusName = (item.status?.key ?? 'available') as GearStatus;
  const status = STATUS_STYLES[statusName] ?? STATUS_STYLES.available;

  return (
    <Card className="overflow-hidden py-0">
      <View className="h-44 border-b border-border bg-accent items-center justify-center">
        <EquipmentImage imageUrl={item.imageUrl} imageClassName="absolute inset-0" />
        <Badge
          variant={status.variant}
          className="absolute top-2 left-2 border border-border px-2 py-1 rounded-sm"
        >
          <Text variant="small" className="text-xs">{status.label}</Text>
        </Badge>
        <View className="absolute bottom-0 left-0 right-0 h-16 bg-black/30 items-start justify-end p-3">
          <Text variant="large" className="font-bold text-white" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>

      <CardContent className="px-4 pb-2 pt-4">
        <View className="flex-row gap-6">
          <View>
            <Text variant="small" className="text-muted-foreground text-xs">Stawka dzienna</Text>
            <Text variant="small" className="text-foreground font-bold mt-0.5">{item.pricePerDay} zł/dzień</Text>
          </View>
          {item.deposit > 0 && (
            <View>
              <Text variant="small" className="text-muted-foreground text-xs">Kaucja</Text>
              <Text variant="small" className="text-foreground font-bold mt-0.5">{item.deposit} zł</Text>
            </View>
          )}
          {item.address ? (
            <View>
              <Text variant="small" className="text-muted-foreground text-xs">Adres</Text>
              <Text variant="small" className="text-foreground font-bold mt-0.5">{item.address}</Text>
            </View>
          ) : null}
        </View>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t-0">
        <View className="w-full gap-2">
          <Separator />
          <View className="flex-row gap-2 pt-1">
            <Button variant="outline" className="flex-1" size="sm" onPress={onEdit}>
              <MaterialIcons name="edit" size={16} color={T.foreground} />
              <Text variant="small" className="ml-1">Edytuj</Text>
            </Button>
            <Button variant="outline" className="flex-1" size="sm" onPress={onViewRentals}>
              <MaterialIcons name="list-alt" size={16} color={T.foreground} />
              <Text variant="small" className="ml-1">Rezerwacje</Text>
            </Button>
            <Button variant="destructive" size="sm" onPress={onDelete}>
              <MaterialIcons name="delete" size={16} color="#fff" />
            </Button>
          </View>
        </View>
      </CardFooter>
    </Card>
  );
}
