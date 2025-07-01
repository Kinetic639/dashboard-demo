'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Link } from 'lucide-react';
import { assignQrToLocation } from '@/lib/qr/utils';
import { mockBranches } from '@/lib/mock/branches';

const assignSchema = z.object({
  locationId: z.string().min(1, 'Wybierz lokalizację'),
});

type AssignFormData = z.infer<typeof assignSchema>;

interface AssignQrToLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrToken: string;
  availableLocations: Array<{
    id: string;
    name: string;
    code?: string;
    branch_id?: string;
  }>;
  onSuccess: () => void;
}

export function AssignQrToLocationDialog({
  open,
  onOpenChange,
  qrToken,
  availableLocations,
  onSuccess,
}: AssignQrToLocationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AssignFormData>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      locationId: '',
    },
  });

  const onSubmit = async (data: AssignFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = assignQrToLocation(qrToken, data.locationId);
      
      if (success) {
        onSuccess();
        form.reset();
      } else {
        throw new Error('Failed to assign QR code');
      }
    } catch (error) {
      console.error('Error assigning QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group locations by branch
  const locationsByBranch = React.useMemo(() => {
    const grouped: Record<string, typeof availableLocations> = {};
    
    availableLocations.forEach(location => {
      const branchId = location.branch_id || 'unknown';
      if (!grouped[branchId]) {
        grouped[branchId] = [];
      }
      grouped[branchId].push(location);
    });
    
    return grouped;
  }, [availableLocations]);

  const getBranchName = (branchId: string) => {
    const branch = mockBranches.find(b => b.id === branchId);
    return branch?.name || 'Nieznany oddział';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Przypisz kod QR do lokalizacji
          </DialogTitle>
          <DialogDescription>
            Wybierz lokalizację, do której chcesz przypisać kod QR: <span className="font-mono">{qrToken}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokalizacja *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz lokalizację..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {Object.entries(locationsByBranch).map(([branchId, locations]) => (
                        <div key={branchId}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3 w-3" />
                              {getBranchName(branchId)}
                            </div>
                          </div>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              <div className="flex items-center gap-2 w-full">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="flex-1">{location.name}</span>
                                {location.code && (
                                  <Badge variant="outline" className="text-xs">
                                    {location.code}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Co się stanie po przypisaniu?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Kod QR zostanie trwale przypisany do wybranej lokalizacji</li>
                <li>• Skanowanie kodu będzie przekierowywać do szczegółów lokalizacji</li>
                <li>• Przypisanie można zmienić tylko przez administratora</li>
              </ul>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Przypisywanie...' : 'Przypisz kod QR'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}