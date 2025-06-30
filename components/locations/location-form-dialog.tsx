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
import { Badge } from '@/components/ui/badge';
import { LocationTreeItem } from '@/lib/types/location-tree';
import { Tables } from '@/lib/types';

const locationSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  code: z.string().optional(),
  description: z.string().optional(),
  color: z.string().min(1, 'Kolor jest wymagany'),
  icon_name: z.string().min(1, 'Ikona jest wymagana'),
  image_url: z.string().url().optional().or(z.literal('')),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: LocationTreeItem;
  parentLocation?: LocationTreeItem;
  onSave: (data: LocationFormData) => void;
}

const iconOptions = [
  'Warehouse', 'Building', 'Grid3X3', 'Package', 'Archive', 'Box',
  'Container', 'Layers', 'MapPin', 'Home', 'Store', 'Truck'
];

const colorOptions = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4',
  '#84cc16', '#f97316', '#ec4899', '#6366f1', '#14b8a6', '#a855f7'
];

export function LocationFormDialog({
  open,
  onOpenChange,
  location,
  parentLocation,
  onSave,
}: LocationFormDialogProps) {
  const isEditing = !!location;
  
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || '',
      code: location?.code || '',
      description: location?.raw.description || '',
      color: location?.color || '#3b82f6',
      icon_name: location?.icon_name || 'MapPin',
      image_url: location?.raw.image_url || '',
    },
  });

  React.useEffect(() => {
    if (location) {
      form.reset({
        name: location.name,
        code: location.code || '',
        description: location.raw.description || '',
        color: location.color || '#3b82f6',
        icon_name: location.icon_name || 'MapPin',
        image_url: location.raw.image_url || '',
      });
    } else {
      form.reset({
        name: '',
        code: '',
        description: '',
        color: '#3b82f6',
        icon_name: 'MapPin',
        image_url: '',
      });
    }
  }, [location, form]);

  const onSubmit = (data: LocationFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  const selectedIcon = form.watch('icon_name');
  const selectedColor = form.watch('color');
  const SelectedIcon = Icons[selectedIcon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edytuj lokalizację' : 'Dodaj nową lokalizację'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Zaktualizuj informacje o lokalizacji'
              : parentLocation 
                ? `Dodaj nową podlokalizację w: ${parentLocation.name}`
                : 'Dodaj nową lokalizację główną'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nazwa lokalizacji" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod</FormLabel>
                    <FormControl>
                      <Input placeholder="np. MG-A-R1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unikalny kod lokalizacji
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Opis lokalizacji..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon_name"
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
                      <SelectContent>
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

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL zdjęcia</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Opcjonalne zdjęcie lokalizacji
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <h4 className="text-sm font-medium mb-2">Podgląd:</h4>
              <div className="flex items-center gap-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: selectedColor }}
                >
                  <SelectedIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {form.watch('name') || 'Nazwa lokalizacji'}
                    </span>
                    {form.watch('code') && (
                      <Badge variant="outline" className="text-xs">
                        {form.watch('code')}
                      </Badge>
                    )}
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
                {isEditing ? 'Zapisz zmiany' : 'Dodaj lokalizację'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}