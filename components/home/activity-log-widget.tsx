"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockActivityLog } from "@/lib/mock/activity-log";
import { getAllUsers } from "@/lib/mock/user";
import { format } from "date-fns";
import { 
  Package, 
  MapPin, 
  UserPlus, 
  UserCheck, 
  LogIn, 
  AlertCircle,
  Info
} from "lucide-react";

const getActivityIcon = (action: string) => {
  if (action.includes("Utworzono lokalizację")) return MapPin;
  if (action.includes("Dodano produkt")) return Package;
  if (action.includes("Zalogowano użytkownika")) return LogIn;
  if (action.includes("Nowy użytkownik")) return UserPlus;
  if (action.includes("Zmiana roli")) return UserCheck;
  return Info; // Default icon
};

export const ActivityLogWidget = () => {
  const users = getAllUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dziennik aktywności</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockActivityLog.map((log) => {
            const Icon = getActivityIcon(log.action);
            const user = users.find(u => u.first_name + " " + u.last_name === log.user);
            const userInitials = user ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase() : '';

            return (
              <li key={log.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  {user && user.avatar_url && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar_url} alt={user.first_name} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.details}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">{log.user}</span> - {" "}
                    {format(new Date(log.timestamp), "dd.MM.yyyy HH:mm")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};
