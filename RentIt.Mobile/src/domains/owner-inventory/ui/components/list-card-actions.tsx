import { Button } from '@/src/shared/ui/components/button';
import { CardFooter } from '@/src/shared/ui/components/card';
import { THEME } from '@/src/shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const T = THEME.light;

type Props = {
  onEdit: () => void;
  onViewRentals: () => void;
  onManageAvailability: () => void;
  onDelete: () => void;
};

export function ListCardActions({
  onEdit,
  onViewRentals,
  onManageAvailability,
  onDelete,
}: Props) {
  return (
    <CardFooter className="w-full gap-2 px-4 py-3 border-t-0">
      <Button variant="outline" className="flex-1" size="sm" onPress={onEdit} accessibilityLabel="Edytuj">
        <MaterialIcons name="edit" size={16} color={T.foreground} />
      </Button>
      <Button variant="outline" className="flex-1" size="sm" onPress={onViewRentals} accessibilityLabel="Rezerwacje">
        <MaterialIcons name="list-alt" size={16} color={T.foreground} />
      </Button>
      <Button variant="outline" className="flex-1" size="sm" onPress={onManageAvailability} accessibilityLabel="Blokady">
        <MaterialIcons name="event-busy" size={16} color={T.foreground} />
      </Button>
      <Button variant="destructive" className="flex-1" size="sm" onPress={onDelete} accessibilityLabel="Usuń">
        <MaterialIcons name="delete" size={16} color={T['destructive-foreground']} />
      </Button>
    </CardFooter>
  );
}
