
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMovements } from "@/lib/mock/movements";

export const RecentMovementsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ostatnie ruchy magazynowe</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {mockMovements.map((movement) => (
            <li key={movement.id} className="text-sm">
              <span>{`${movement.product_name}: ${movement.quantity > 0 ? '+' : ''}${movement.quantity} w ${movement.location_name} przez ${movement.user}`}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
