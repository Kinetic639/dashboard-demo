
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTasks } from "@/lib/mock/tasks";
import { Calendar } from "@/components/ui/calendar";

export const TasksAndRemindersWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zadania i przypomnienia</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="multiple"
          selected={mockTasks.map(task => new Date(task.due_date))}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};
