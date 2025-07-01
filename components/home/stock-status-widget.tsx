
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStockAlerts } from "@/lib/mock/stock-alerts";
import { StockAlert } from "@/lib/types/home";
import { Badge } from "@/components/ui/badge";

const getStatusVariant = (status: StockAlert["status"]) => {
  switch (status) {
    case "low_stock":
      return "destructive";
    case "out_of_stock":
      return "destructive";
    case "recently_stocked":
      return "default";
    default:
      return "secondary";
  }
};

export const StockStatusWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status zapasów</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {mockStockAlerts.map((alert) => (
            <li key={alert.id} className="flex justify-between items-center">
              <span>{alert.name}</span>
              <Badge variant={getStatusVariant(alert.status)}>
                {alert.status === "low_stock" && `Niski stan (${alert.current_stock})`}
                {alert.status === "out_of_stock" && "Brak na stanie"}
                {alert.status === "recently_stocked" && "Ostatnio uzupełnione"}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
