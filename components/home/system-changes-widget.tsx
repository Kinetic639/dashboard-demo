
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockActivityLog } from "@/lib/mock/activity-log";

export const SystemChangesWidget = () => {
  const systemChanges = mockActivityLog.filter(log => log.type === 'system');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zmiany w systemie</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {systemChanges.map((log) => (
            <li key={log.id} className="text-sm">
              <span>{`${log.action}: ${log.details} przez ${log.user}`}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
