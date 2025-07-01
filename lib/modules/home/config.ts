import { Home } from "lucide-react";
import { MenuItem } from "@/lib/types/module";

export async function getHomeModule() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const homeModule = {
    id: "home",
    name: "Start",
    icon: Home,
    items: [
        {
            id: "home-dashboard",
            label: "Strona główna",
            icon: "Home",
            path: "/dashboard/home",
            type: "link" as const,
        },
        {
            id: "home-activity-log",
            label: "Dziennik aktywności",
            icon: "ClipboardList",
            path: "/dashboard/home/activity-log",
            type: "link" as const,
        },
    ] as MenuItem[],
  };

  return homeModule;
}