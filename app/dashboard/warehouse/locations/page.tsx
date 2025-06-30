'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationTree } from '@/components/locations/location-tree';
import { LocationTreeMobile } from '@/components/locations/location-tree-mobile';
import { LocationFormDialog } from '@/components/locations/location-form-dialog';
import { buildLocationTree } from '@/lib/utils/build-location-tree';
import { LocationTreeItem } from '@/lib/types/location-tree';
import { Plus, Search, MapPin, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBranchStore } from '@/lib/stores/branch-store';
import { getLocationProductCountByBranch } from '@/lib/mock/branches';
import { Badge } from '@/components/ui/badge';

export default function LocationsPage() {
  const { toast } = useToast();
  const { activeBranchId, getActiveBranch, getActiveBranchLocations } = useBranchStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingLocation, setEditingLocation] = React.useState<LocationTreeItem | undefined>();
  const [parentLocation, setParentLocation] = React.useState<LocationTreeItem | undefined>();

  const activeBranch = getActiveBranch();
  const branchLocations = getActiveBranchLocations();

  const locationTree = React.useMemo(() => {
    const filtered = searchQuery 
      ? branchLocations.filter(loc => 
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.code?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : branchLocations;
    
    return buildLocationTree(filtered, activeBranchId);
  }, [branchLocations, searchQuery, activeBranchId]);

  const handleAddLocation = () => {
    setEditingLocation(undefined);
    setParentLocation(undefined);
    setIsDialogOpen(true);
  };

  const handleEditLocation = (location: LocationTreeItem) => {
    setEditingLocation(location);
    setParentLocation(undefined);
    setIsDialogOpen(true);
  };

  const handleAddChildLocation = (parent: LocationTreeItem) => {
    setEditingLocation(undefined);
    setParentLocation(parent);
    setIsDialogOpen(true);
  };

  const handleDeleteLocation = (location: LocationTreeItem) => {
    const productCount = getLocationProductCountByBranch(activeBranchId, location.id);
    if (productCount > 0) {
      toast({
        title: 'Nie można usunąć lokalizacji',
        description: 'Lokalizacja zawiera produkty. Najpierw przenieś wszystkie produkty.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Lokalizacja usunięta',
      description: `Lokalizacja "${location.name}" została usunięta.`,
    });
  };

  const handleSaveLocation = (data: any) => {
    if (editingLocation) {
      toast({
        title: 'Lokalizacja zaktualizowana',
        description: `Lokalizacja "${data.name}" została zaktualizowana.`,
      });
    } else {
      toast({
        title: 'Lokalizacja dodana',
        description: `Lokalizacja "${data.name}" została dodana.`,
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Lokalizacje</h1>
            {activeBranch && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {activeBranch.name}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Zarządzanie strukturą lokalizacji magazynowych w aktywnym oddziale
          </p>
        </div>
        <Button onClick={handleAddLocation} className="h-9 md:h-10">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Dodaj lokalizację</span>
          <span className="sm:hidden">Dodaj</span>
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Wyszukiwanie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj lokalizacji po nazwie lub kodzie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Tree */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <MapPin className="h-5 w-5" />
              Struktura lokalizacji
              {activeBranch && (
                <span className="text-sm font-normal text-muted-foreground">
                  - {activeBranch.name}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-sm">
              Hierarchiczna struktura wszystkich lokalizacji magazynowych w aktywnym oddziale
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            {locationTree.length > 0 ? (
              <>
                {/* Desktop Tree - Hidden on mobile */}
                <div className="hidden lg:block">
                  <LocationTree
                    locations={locationTree}
                    onEdit={handleEditLocation}
                    onAddChild={handleAddChildLocation}
                    onDelete={handleDeleteLocation}
                  />
                </div>
                
                {/* Mobile Tree - Hidden on desktop */}
                <div className="lg:hidden">
                  <LocationTreeMobile
                    locations={locationTree}
                    onEdit={handleEditLocation}
                    onAddChild={handleAddChildLocation}
                    onDelete={handleDeleteLocation}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8 md:py-12 text-muted-foreground">
                <MapPin className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-base md:text-lg font-medium mb-2">
                  {searchQuery ? 'Brak wyników' : 'Brak lokalizacji'}
                </h3>
                <p className="mb-4 text-sm md:text-base">
                  {searchQuery 
                    ? 'Nie znaleziono lokalizacji pasujących do wyszukiwania.'
                    : `Dodaj pierwszą lokalizację w oddziale ${activeBranch?.name || 'aktywnym'}.`
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={handleAddLocation}>
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj pierwszą lokalizację
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Form Dialog */}
      <LocationFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        location={editingLocation}
        parentLocation={parentLocation}
        onSave={handleSaveLocation}
      />
    </div>
  );
}