import { Card, CardContent } from '@/src/shared/ui/components/card';
import type { Equipment } from '@/src/shared/domain/equipment';
import { EquipmentCardDetails, EquipmentCardHeader } from '@/src/shared/ui/equipment';
import { ListCardActions } from './list-card-actions';

type Props = {
  item: Equipment;
  onEdit: () => void;
  onViewRentals: () => void;
  onManageAvailability: () => void;
  onDelete: () => void;
};

export function ListCard({
  item,
  onEdit,
  onViewRentals,
  onManageAvailability,
  onDelete,
}: Props) {
  return (
    <Card className="w-full overflow-hidden py-0">
      <EquipmentCardHeader item={item} />
      <CardContent className="px-4 pb-2 pt-4">
        <EquipmentCardDetails item={item} />
      </CardContent>
      <ListCardActions
        onEdit={onEdit}
        onViewRentals={onViewRentals}
        onManageAvailability={onManageAvailability}
        onDelete={onDelete}
      />
    </Card>
  );
}
