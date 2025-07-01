
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockQuickActions } from "@/lib/mock/quick-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const QuickActionsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Szybkie akcje</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {mockQuickActions.map((action) => (
          <Button asChild key={action.id} variant="outline">
            <Link href={action.href}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
