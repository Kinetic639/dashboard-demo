import { ActivityLogWidget } from "@/components/home/activity-log-widget";

export default function ActivityLogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dziennik aktywności</h1>
      <ActivityLogWidget />
    </div>
  );
}