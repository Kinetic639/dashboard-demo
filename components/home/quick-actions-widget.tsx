
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockQuickActions } from "@/lib/mock/quick-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings, GripVertical, PlusCircle, Tag, ScanLine, MapPin, AlertCircle } from "lucide-react"; // Explicitly import icons
import { useState, useEffect } from "react";
import { useQuickActionsStore } from "@/lib/stores/quick-actions-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Map string names to actual icon components
const IconComponents: { [key: string]: React.ComponentType<{ className?: string }> } = {
  PlusCircle,
  Tag,
  ScanLine,
  MapPin,
  AlertCircle,
};

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center justify-between rounded-md border p-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 cursor-grab" {...listeners} />
          {children}
        </div>
      </div>
    </div>
  );
}

export const QuickActionsWidget = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { actions, hiddenActionIds, setActions, toggleVisibility, _hasHydrated } = useQuickActionsStore();
  const [currentActions, setCurrentActions] = useState(actions);

  useEffect(() => {
    if (_hasHydrated) {
      setCurrentActions(actions);
    }
  }, [actions, _hasHydrated]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = currentActions.findIndex((action) => action.id === active.id);
      const newIndex = currentActions.findIndex((action) => action.id === over.id);
      const newActions = [...currentActions];
      const [movedItem] = newActions.splice(oldIndex, 1);
      newActions.splice(newIndex, 0, movedItem);
      setCurrentActions(newActions);
    }
  };

  const handleSaveSettings = () => {
    setActions(currentActions);
    setIsSettingsOpen(false);
  };

  const visibleActions = currentActions.filter(
    (action) => !hiddenActionIds.includes(action.id)
  );

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Szybkie akcje</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <TooltipProvider>
          {visibleActions.map((action) => {
            const Icon = IconComponents[action.icon];
            if (!Icon) return null; // Handle case where icon might not be found
            return (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" size="icon">
                    <Link href={action.href} passHref>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </CardContent>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dostosuj szybkie akcje</DialogTitle>
            <DialogDescription>
              Wybierz, które akcje mają być widoczne i zmień ich kolejność.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentActions.map((action) => action.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentActions.map((action) => {
                  const Icon = IconComponents[action.icon];
                  if (!Icon) return null; // Handle case where icon might not be found
                  return (
                    <SortableItem key={action.id} id={action.id}>
                      <Checkbox
                        id={`action-${action.id}`}
                        checked={!hiddenActionIds.includes(action.id)}
                        onCheckedChange={() => toggleVisibility(action.id)}
                      />
                      <Label htmlFor={`action-${action.id}`} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {action.label}
                      </Label>
                    </SortableItem>
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveSettings}>Zapisz zmiany</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
