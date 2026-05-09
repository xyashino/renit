import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

type CardShellProps = {
  children: ReactNode;
};

export function CardShell({ children }: CardShellProps) {
  return (
    <Card className="py-0 gap-0">
      <CardContent className="p-6 gap-6 flex flex-col">{children}</CardContent>
    </Card>
  );
}
