'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as Icons from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useSavedFiltersStore } from '@/lib/stores/saved-filters-store';
import { useBranchStore } from '@/lib/stores/branch-store';
import { getCurrentUser } from '@/lib/mock/organization';

const saveFilterSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana').max(50, 'Nazwa może mieć maksymalnie 50 znaków'),
  description: z.string().max(200, 'Opis może mieć maksymalnie 200 znaków').optional(),
  color: z.string().min(1, 'Kolor jest wymagany'),
  icon: z.string().min(1, 'Ikona jest wymagana'),
  addToSidebar: z.boolean().default(false),
  isPublic: z.boolean().default(false),
});

type SaveFilterFormData = z.infer<typeof saveFilterSchema>;

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: {
    search?: string;
    type?: string;
    availability?: string;
    service?: string;
  };
}

const iconOptions = [
  'Filter', 'Search', 'Package', 'Tag', 'Star', 'Heart', 'Bookmark',
  'Flag', 'Target', 'Zap', 'Flame', 'Award', 'Shield', 'CheckCircle',
  'AlertCircle', 'Info', 'Settings', 'Wrench', 'Palette', 'Layers'
];

const colorOptions = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4',
  '#84cc16', '#f97316', '#ec4899', '#6366f1', '#14b8a6', '#a855f7',
  '#64748b', '#374151', '#dc2626', '#059669', '#7c3aed', '#db2777'
];

export function SaveFilterDialog({
  open,
  onOpenChange,
  currentFilters,
}: SaveFilterDialogProps) {
  const { addSavedFilter } = useSavedFiltersStore();
  const { activeBranchId } = useBranchStore();
  const currentUser = getCurrentUser();

  const form = useForm<SaveFilterFormData>({
    resolver: zodResolver(saveFilterSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#3b82f6',
      icon: 'Filter',
      addToSidebar: false,
      isPublic: false,
    },
  });

  const selectedIcon = form.watch('icon');
  const selectedColor = form.watch('color');
  const isPublic = form.watch('isPublic');
  const SelectedIcon = Icons[selectedIcon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const onSubmit = (data: SaveFilterFormData) => {
    addSavedFilter({
      ...data,
      filters: currentFilters,
      userId: currentUser.id,
      branchId: activeBranchId,
    });
    
    onOpenChange(false);
    form.reset();
  };

  const getFilterSummary = () => {
    const summary = [];
    
    if (currentFilters.search) {
      summary.push(`Wyszukiwanie: "${currentFilters.search}"`);
    }
    if (currentFilters.type && currentFilters.type !== 'all') {
      const typeLabels = {
        simple: 'Produkty proste',
        variant: 'Produkty z wariantami',
      };
      summary.push(`Typ: ${typeLabels[currentFilters.type as keyof typeof typeLabels]}`);
    }
    if (currentFilters.availability && currentFilters.availability !== 'all') {
      const availabilityLabels = {
        available: 'Dostępne',
        unavailable: 'Niedostępne',
      };
      summary.push(`Dostępność: ${availabilityLabels[currentFilters.availability as keyof typeof availabilityLabels]}`);
    }
    if (currentFilters.service && currentFilters.service !== 'all') {
      const serviceLabels = {
        products: 'Produkty',
        services: 'Usługi',
      };
      summary.push(`Rodzaj: ${serviceLabels[currentFilters.service as keyof typeof serviceLabels]}`);
    }
    
    return summary.length > 0 ? summary : ['Brak aktywnych filtrów'];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Zapisz filtr</DialogTitle>
          <DialogDescription>
            Zapisz bieżące ustawienia filtrów, aby móc szybko je zastosować w przyszłości
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Filters Summary */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <h4 className="text-sm font-medium mb-2">Zapisywane filtry:</h4>
              <div className="space-y-1">
                {getFilterSummary().map((filter, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {filter}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa filtru *</FormLabel>
                    <FormControl>
                      <Input placeholder="np. Dostępne lakiery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="addToSidebar"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          Dodaj do sidebara
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Filtr będzie dostępny w menu bocznym
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          Filtr publiczny
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Inni użytkownicy w oddziale będą mogli zobaczyć i skopiować ten filtr
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis (opcjonalny)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Krótki opis filtru..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maksymalnie 200 znaków
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ikona *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz ikonę">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <SelectedIcon className="h-4 w-4" />
                                {field.value}
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {iconOptions.map((icon) => {
                          const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                          return (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {icon}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kolor *</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: field.value }}
                          />
                          <Input 
                            type="color" 
                            className="w-16 h-8 p-1 border rounded"
                            {...field}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className="w-6 h-6 rounded border-2 border-transparent hover:border-gray-300"
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <h4 className="text-sm font-medium mb-2">Podgląd:</h4>
              <div className="flex items-center gap-3">
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: selectedColor }}
                >
                  <SelectedIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {form.watch('name') || 'Nazwa filtru'}
                    </span>
                    <div className="flex gap-1">
                      {form.watch('addToSidebar') && (
                        <Badge variant="secondary" className="text-xs">
                          Sidebar
                        </Badge>
                      )}
                      {isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Publiczny
                        </Badge>
                      )}
                    </div>
                  </div>
                  {form.watch('description') && (
                    <p className="text-xs text-muted-foreground">
                      {form.watch('description')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Anuluj
              </Button>
              <Button type="submit">
                Zapisz filtr
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}