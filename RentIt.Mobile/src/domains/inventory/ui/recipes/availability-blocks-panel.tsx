import { useAvailabilityBlocks } from '../../application/hooks/use-availability-blocks';
import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/components/card';
import { Input } from '@/src/shared/ui/components/input';
import { Separator } from '@/src/shared/ui/components/separator';
import { Text } from '@/src/shared/ui/components/text';
import { YmdDateField } from '@/src/shared/ui/components/ymd-date-field';
import { formatDate, startOfToday } from '@/src/shared/utils/date';
import { EmptyStateRecipe, ScreenHeader } from '@/src/shared/ui';
import { ScrollView, View } from 'react-native';

type Props = {
  equipmentId: number;
};

export function AvailabilityBlocksPanel({ equipmentId }: Props) {
  const {
    equipment,
    blocks,
    editingId,
    form,
    setForm,
    saveMutation,
    editBlock,
    confirmDelete,
    cancelEdit,
  } = useAvailabilityBlocks(equipmentId);

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 80 }}>
      <ScreenHeader
        className="mb-6"
        title="Blokady dostępności"
        description={equipment?.name ?? 'Sprzęt'}
        titleNumberOfLines={1}
      />

      <Card className="py-0 mb-5">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle>{editingId ? 'Edytuj blokadę' : 'Nowa blokada'}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="px-4 pt-4 pb-4 gap-3">
          <YmdDateField
            value={form.dateFrom}
            onChange={(dateFrom) => setForm((prev) => ({ ...prev, dateFrom }))}
            placeholder="Data od"
            minimumDate={editingId ? undefined : startOfToday()}
            icon="calendar-today"
          />
          <YmdDateField
            value={form.dateTo}
            onChange={(dateTo) => setForm((prev) => ({ ...prev, dateTo }))}
            placeholder="Data do"
            minimumDate={editingId ? undefined : startOfToday()}
            icon="event"
          />
          <Input
            placeholder="Powód, np. serwis"
            value={form.reason}
            onChangeText={(reason) => setForm((prev) => ({ ...prev, reason }))}
          />
          <View className="flex-row gap-2">
            <Button className="flex-1" disabled={saveMutation.isPending} onPress={() => saveMutation.mutate()}>
              <Text className="text-primary-foreground">
                {editingId ? 'Zapisz blokadę' : 'Dodaj blokadę'}
              </Text>
            </Button>
            {editingId ? (
              <Button
                variant="outline"
                onPress={cancelEdit}
              >
                <Text>Anuluj</Text>
              </Button>
            ) : null}
          </View>
        </CardContent>
      </Card>

      {blocks.length === 0 ? (
        <EmptyStateRecipe
          className="py-10"
          title="Brak blokad"
          description="Dodaj terminy, w których sprzęt nie może być rezerwowany."
        />
      ) : (
        <View className="gap-3">
          {blocks.map((block) => (
            <Card key={block.id} className="py-0">
              <CardContent className="px-4 py-4 gap-3">
                <View>
                  <Text className="text-foreground font-semibold">
                    {formatDate(block.dateFrom)} - {formatDate(block.dateTo)}
                  </Text>
                  {block.reason ? (
                    <Text variant="small" className="text-muted-foreground mt-1">
                      {block.reason}
                    </Text>
                  ) : null}
                </View>
                <View className="flex-row gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onPress={() => editBlock(block)}>
                    <Text variant="small">Edytuj</Text>
                  </Button>
                  <Button variant="destructive" size="sm" onPress={() => confirmDelete(block)}>
                    <Text variant="small" className="text-destructive-foreground">
                      Usuń
                    </Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
