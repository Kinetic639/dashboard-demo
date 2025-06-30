'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSavedFiltersStore } from '@/lib/stores/saved-filters-store';
import { useBranchStore } from '@/lib/stores/branch-store';
import { getCurrentUser } from '@/lib/mock/organization';
import { SavedFilter } from '@/lib/types/saved-filters';
import { MoreHorizontal, Edit, Trash2, Eye, Sidebar, Minus, Calendar, Copy, Globe, Lock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface SavedFiltersManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filter: SavedFilter) => void;
}

export function SavedFiltersManager({
  open,
  onOpenChange,
  onApplyFilter,
}: SavedFiltersManagerProps) {
  const { toast } = useToast();
  const { activeBranchId } = useBranchStore();
  const currentUser = getCurrentUser();
  const { 
    getUserFiltersByBranch,
    getPublicFiltersByBranch,
    deleteSavedFilter, 
    updateSavedFilter,
    clonePublicFilter
  } = useSavedFiltersStore();

  const userFilters = getUserFiltersByBranch(activeBranchId, currentUser.id);
  const publicFilters = getPublicFiltersByBranch(activeBranchId);

  const handleApplyFilter = (filter: SavedFilter) => {
    onApplyFilter(filter);
    onOpenChange(false);
  };

  const handleToggleSidebar = (filter: SavedFilter) => {
    updateSavedFilter(filter.id, {
      addToSidebar: !filter.addToSidebar,
    });
  };

  const handleTogglePublic = (filter: SavedFilter) => {
    updateSavedFilter(filter.id, {
      isPublic: !filter.isPublic,
    });
    
    toast({
      title: filter.isPublic ? 'Filtr ustawiony jako prywatny' : 'Filtr ustawiony jako publiczny',
      description: filter.isPublic 
        ? 'Filtr nie będzie już widoczny dla innych użytkowników.'
        : 'Filtr będzie teraz widoczny dla innych użytkowników w oddziale.',
    });
  };

  const handleDeleteFilter = (filterId: string) => {
    deleteSavedFilter(filterId);
    toast({
      title: 'Filtr usunięty',
      description: 'Filtr został pomyślnie usunięty.',
    });
  };

  const handleClonePublicFilter = (filter: SavedFilter) => {
    clonePublicFilter(filter.id, currentUser.id);
    toast({
      title: 'Filtr skopiowany',
      description: `Filtr "${filter.name}" został skopiowany do Twoich filtrów.`,
    });
  };

  const getFilterSummary = (filter: SavedFilter) => {
    const summary = [];
    
    if (filter.filters.search) {
      summary.push(`"${filter.filters.search}"`);
    }
    if (filter.filters.type && filter.filters.type !== 'all') {
      const typeLabels = {
        simple: 'Proste',
        variant: 'Warianty',
      };
      summary.push(typeLabels[filter.filters.type as keyof typeof typeLabels]);
    }
    if (filter.filters.availability && filter.filters.availability !== 'all') {
      const availabilityLabels = {
        available: 'Dostępne',
        unavailable: 'Niedostępne',
      };
      summary.push(availabilityLabels[filter.filters.availability as keyof typeof availabilityLabels]);
    }
    if (filter.filters.service && filter.filters.service !== 'all') {
      const serviceLabels = {
        products: 'Produkty',
        services: 'Usługi',
      };
      summary.push(serviceLabels[filter.filters.service as keyof typeof serviceLabels]);
    }
    
    return summary.length > 0 ? summary.join(' • ') : 'Brak filtrów';
  };

  const renderFilterCard = (filter: SavedFilter, isOwner: boolean = false) => {
    const Icon = Icons[filter.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    
    return (
      <motion.div
        key={filter.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: filter.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{filter.name}</CardTitle>
                    <div className="flex gap-1">
                      {filter.addToSidebar && (
                        <Badge variant="secondary" className="text-xs">
                          <Sidebar className="h-3 w-3 mr-1" />
                          Sidebar
                        </Badge>
                      )}
                      {filter.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          Publiczny
                        </Badge>
                      )}
                      {!isOwner && (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Udostępniony
                        </Badge>
                      )}
                    </div>
                  </div>
                  {filter.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {filter.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApplyFilter(filter)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Zastosuj
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleApplyFilter(filter)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Zastosuj filtr
                    </DropdownMenuItem>
                    
                    {isOwner ? (
                      <>
                        <DropdownMenuItem onClick={() => handleToggleSidebar(filter)}>
                          {filter.addToSidebar ? (
                            <>
                              <Minus className="mr-2 h-4 w-4" />
                              Usuń z sidebara
                            </>
                          ) : (
                            <>
                              <Sidebar className="mr-2 h-4 w-4" />
                              Dodaj do sidebara
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublic(filter)}>
                          {filter.isPublic ? (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Ustaw jako prywatny
                            </>
                          ) : (
                            <>
                              <Globe className="mr-2 h-4 w-4" />
                              Ustaw jako publiczny
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteFilter(filter.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Usuń filtr
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => handleClonePublicFilter(filter)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Skopiuj do moich filtrów
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Filtry: </span>
                <span className="text-sm">{getFilterSummary(filter)}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Utworzono {formatDistanceToNow(new Date(filter.createdAt), { 
                    addSuffix: true, 
                    locale: pl 
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Zarządzanie zapisanymi filtrami</DialogTitle>
          <DialogDescription>
            Zarządzaj swoimi zapisanymi filtrami i przeglądaj filtry udostępnione przez innych użytkowników
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="my-filters" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-filters" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Moje filtry ({userFilters.length})
            </TabsTrigger>
            <TabsTrigger value="public-filters" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Filtry publiczne ({publicFilters.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-filters" className="space-y-4 max-h-[50vh] overflow-y-auto">
            {userFilters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icons.Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Brak zapisanych filtrów</h3>
                <p>Zapisz swoje pierwsze filtry, aby szybko je zastosować w przyszłości.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {userFilters.map((filter) => renderFilterCard(filter, true))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="public-filters" className="space-y-4 max-h-[50vh] overflow-y-auto">
            {publicFilters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icons.Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Brak publicznych filtrów</h3>
                <p>Żaden użytkownik w tym oddziale nie udostępnił jeszcze swoich filtrów.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {publicFilters.map((filter) => renderFilterCard(filter, false))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}