
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { mockUserPreferences } from "@/lib/mock/user-preferences";
import { useState } from "react";

export const UserNotesWidget = () => {
  const [notes, setNotes] = useState(mockUserPreferences[0]?.notes || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notatki użytkownika</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Twoje prywatne notatki..."
          className="mb-2"
        />
        <Button size="sm">Zapisz</Button>
      </CardContent>
    </Card>
  );
};
