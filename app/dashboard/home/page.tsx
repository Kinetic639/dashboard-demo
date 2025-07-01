
import { StockStatusWidget } from "@/components/home/stock-status-widget";
import { RecentMovementsWidget } from "@/components/home/recent-movements-widget";
import { TasksAndRemindersWidget } from "@/components/home/tasks-and-reminders-widget";
import { SystemChangesWidget } from "@/components/home/system-changes-widget";
import { QuickActionsWidget } from "@/components/home/quick-actions-widget";
import { UserNotesWidget } from "@/components/home/user-notes-widget";

export default function HomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full">
        <QuickActionsWidget />
      </div>
      <div className="col-span-1">
        <TasksAndRemindersWidget />
      </div>
      <div className="col-span-1">
        <StockStatusWidget />
      </div>
      <div className="col-span-1">
        <RecentMovementsWidget />
      </div>
      <div className="col-span-1">
        <SystemChangesWidget />
      </div>
      <div className="col-span-1">
        <UserNotesWidget />
      </div>
    </div>
  );
}
