"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMessages } from "@/lib/mock/messages";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pin, PinOff } from "lucide-react";

export const OrganizationalMessagesWidget = () => {
  // Mocked user context
  const activeOrg = "org-1";
  const activeBranch = "branch-1";
  const currentUser = "user-1";

  const filteredMessages = mockMessages.filter((message) => {
    if (message.visibility === "organization") return true;
    if (message.visibility === "branch") return true; // Simplified for demo
    if (message.visibility === "user")
      return message.created_by === currentUser;
    return false;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Komunikaty organizacyjne</CardTitle>
      </CardHeader>
      <CardContent>
        dick
        {/* <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {filteredMessages.map(message => (
            <div key={message.id} className="border p-2 rounded-md flex items-start space-x-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{message.title}</h4>
                <p className="text-sm text-muted-foreground break-words">{message.content}</p>
                <p className="text-xs text-muted-foreground">{message.created_by} - {new Date(message.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                      {message.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </Button>
                  <Checkbox id={`read-${message.id}`} />
                  <Label htmlFor={`read-${message.id}`} className="sr-only">Oznacz jako przeczytane</Label>
              </div>
            </div>
          ))}
        </div> */}
      </CardContent>
    </Card>
  );
};
