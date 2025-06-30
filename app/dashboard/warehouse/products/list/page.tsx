'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Package, 
  Search, 
  Grid3X3, 
  List, 
  TableIcon,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building2,
  Truck,
  Euro,
  Hash,
  CheckCircle,
  XCircle,
  Package2,
  Wrench,
  Save,
  Settings,
} from 'lucide-react';
import { getProductsWithInventoryDataByBranch, getSupplierNames } from '@/lib/mock/products';
import { useBranchStore } from '@/lib/stores/branch-store';
import { useSavedFiltersStore } from '@/lib/stores/saved-filters-store';
import { SaveFilterDialog } from '@/components/products/save-filter-dialog';
import { SavedFiltersManager } from '@/components/products/saved-filters-manager';
import { SavedFilter } from '@/lib/types/saved-filters';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'cards' | 'list' | 'table';
type ProductType = 'all' | 'simple' | 'variant';
type AvailabilityFilter = 'all' | 'available' | 'unavailable';
type ServiceFilter = 'all' | 'products' | 'services';

const ITEMS_PER_PAGE = 12;

export default function ProductsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  // Initialize state from URL params
  const [viewMode, setViewMode] = React.useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'cards'
  );
  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get('search') || ''
  );
  const [productTypeFilter, setProductTypeFilter] = React.useState<ProductType>(
    (searchParams.get('type') as ProductType) || 'all'
  );
  const [availabilityFilter, setAvailabilityFilter] = React.useState<AvailabilityFilter>(
    (searchParams.get('availability') as AvailabilityFilter) || 'all'
  );
  const [serviceFilter, setServiceFilter] = React.useState<ServiceFilter>(
    (searchParams.get('service') as ServiceFilter) || 'all'
  );
  const [currentPage, setCurrentPage] = React.useState(
    parseInt(searchParams.get('page') || '1')
  );

  // Dialog states
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = React.useState(false);
  const [filtersManagerOpen, setFiltersManagerOpen] = React.useState(false);

  // Update URL when filters change
  const updateURL = React.useCallback((updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '' && value !== 1) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    const newURL = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newURL, { scroll: false });
  }, [searchParams, router]);

  // Data - filtered by active branch
  const allProducts = React.useMemo(() => {
    return getProductsWithInventoryDataByBranch(activeBranchId);
  }, [activeBranchId]);

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    return allProducts.filter(product => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query) ||
          product.code?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Product type filter
      if (productTypeFilter !== 'all') {
        if (productTypeFilter !== product.productType) return false;
      }

      // Availability filter
      if (availabilityFilter !== 'all') {
        if (availabilityFilter === 'available' && !product.isAvailable) return false;
        if (availabilityFilter === 'unavailable' && product.isAvailable) return false;
      }

      // Service filter
      if (serviceFilter !== 'all') {
        if (serviceFilter === 'services' && !product.isService) return false;
        if (serviceFilter === 'products' && product.isService) return false;
      }

      return true;
    });
  }, [allProducts, searchQuery, productTypeFilter, availabilityFilter, serviceFilter]);

  // Paginated products
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Check if any filters are active
  const hasActiveFilters = React.useMemo(() => {
    return searchQuery !== '' || 
           productTypeFilter !== 'all' || 
           availabilityFilter !== 'all' || 
           serviceFilter !== 'all';
  }, [searchQuery, productTypeFilter, availabilityFilter, serviceFilter]);

  // Update URL when filters change
  React.useEffect(() => {
    updateURL({
      view: viewMode,
      search: searchQuery,
      type: productTypeFilter,
      availability: availabilityFilter,
      service: serviceFilter,
      page: currentPage,
    });
  }, [viewMode, searchQuery, productTypeFilter, availabilityFilter, serviceFilter, currentPage, updateURL]);

  // Reset page when filters change (except page itself)
  React.useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, productTypeFilter, availabilityFilter, serviceFilter]);

  // Update state when branch changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeBranchId]);

  const handleProductClick = (productId: string) => {
    // Navigate to product details (placeholder)
    console.log('Navigate to product:', productId);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'type':
        setProductTypeFilter(value as ProductType);
        break;
      case 'availability':
        setAvailabilityFilter(value as AvailabilityFilter);
        break;
      case 'service':
        setServiceFilter(value as ServiceFilter);
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setProductTypeFilter('all');
    setAvailabilityFilter('all');
    setServiceFilter('all');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSaveFilter = () => {
    if (!hasActiveFilters) {
      toast({
        title: 'Brak filtrów do zapisania',
        description: 'Ustaw filtry przed zapisaniem.',
        variant: 'destructive',
      });
      return;
    }
    setSaveFilterDialogOpen(true);
  };

  const handleApplySavedFilter = (filter: SavedFilter) => {
    setSearchQuery(filter.filters.search || '');
    setProductTypeFilter((filter.filters.type as ProductType) || 'all');
    setAvailabilityFilter((filter.filters.availability as AvailabilityFilter) || 'all');
    setServiceFilter((filter.filters.service as ServiceFilter) || 'all');
    setCurrentPage(1);
    
    toast({
      title: 'Filtr zastosowany',
      description: `Zastosowano filtr "${filter.name}".`,
    });
  };

  const getCurrentFilters = () => ({
    search: searchQuery,
    type: productTypeFilter,
    availability: availabilityFilter,
    service: serviceFilter,
  });

  const renderProductCard = (product: any) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="h-full hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => handleProductClick(product.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {product.sku && (
                  <Badge variant="outline" className="text-xs">
                    {product.sku}
                  </Badge>
                )}
                <Badge 
                  variant={product.isAvailable ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {product.totalQuantity} {product.default_unit}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={product.productType === 'variant' ? 'secondary' : 'outline'}>
                {product.productType === 'variant' ? 'Wariant' : 'Prosty'}
              </Badge>
              {product.isAvailable ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="space-y-2">
            {product.inventory && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cena zakupu:</span>
                <span className="font-medium">
                  {product.inventory.purchase_price.toFixed(2)} zł
                </span>
              </div>
            )}
            
            {product.inventory?.supplier_ids && (
              <div className="flex items-center gap-2">
                <Truck className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {getSupplierNames(product.inventory.supplier_ids).slice(0, 2).join(', ')}
                  {product.inventory.supplier_ids.length > 2 && ` +${product.inventory.supplier_ids.length - 2}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderProductList = (product: any) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer group"
      onClick={() => handleProductClick(product.id)}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Package className="h-6 w-6 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.sku && (
            <Badge variant="outline" className="text-xs">
              {product.sku}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {product.description}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-sm font-medium">
            {product.totalQuantity} {product.default_unit}
          </div>
          <div className="text-xs text-muted-foreground">Stan</div>
        </div>
        
        {product.inventory && (
          <div className="text-center">
            <div className="text-sm font-medium">
              {product.inventory.purchase_price.toFixed(2)} zł
            </div>
            <div className="text-xs text-muted-foreground">Cena</div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {product.isAvailable ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <Badge variant={product.productType === 'variant' ? 'secondary' : 'outline'}>
            {product.productType === 'variant' ? 'Wariant' : 'Prosty'}
          </Badge>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Lista produktów</h1>
          {activeBranch && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {activeBranch.name}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Przeglądaj i zarządzaj produktami dostępnymi w aktywnym oddziale ({allProducts.length} produktów)
        </p>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtry i widok</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('cards')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('table')}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj produktów po nazwie, SKU, kodzie..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Typ produktu</label>
                <Select value={productTypeFilter} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie typy</SelectItem>
                    <SelectItem value="simple">Produkty proste</SelectItem>
                    <SelectItem value="variant">Produkty z wariantami</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Dostępność</label>
                <Select value={availabilityFilter} onValueChange={(value) => handleFilterChange('availability', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie</SelectItem>
                    <SelectItem value="available">Dostępne</SelectItem>
                    <SelectItem value="unavailable">Niedostępne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rodzaj</label>
                <Select value={serviceFilter} onValueChange={(value) => handleFilterChange('service', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie</SelectItem>
                    <SelectItem value="products">Produkty</SelectItem>
                    <SelectItem value="services">Usługi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleClearFilters}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Wyczyść filtry
                </Button>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSaveFilter}
                  disabled={!hasActiveFilters}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Zapisz filtr
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFiltersManagerOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Znaleziono {filteredProducts.length} produktów z {allProducts.length} dostępnych w oddziale
              </span>
              {viewMode !== 'table' && totalPages > 1 && (
                <span>
                  Strona {currentPage} z {totalPages}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'cards' && (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedProducts.map(renderProductCard)}
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {paginatedProducts.map(renderProductList)}
            </motion.div>
          )}

          {viewMode === 'table' && (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produkt</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Stan całkowity</TableHead>
                      <TableHead>Cena zakupu</TableHead>
                      <TableHead>Dostawcy</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.sku && (
                            <Badge variant="outline" className="text-xs">
                              {product.sku}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {product.totalQuantity}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {product.default_unit}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.inventory && (
                            <span className="font-medium">
                              {product.inventory.purchase_price.toFixed(2)} zł
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.inventory?.supplier_ids && (
                            <div className="text-sm">
                              {getSupplierNames(product.inventory.supplier_ids).slice(0, 2).join(', ')}
                              {product.inventory.supplier_ids.length > 2 && (
                                <span className="text-muted-foreground">
                                  {' '}+{product.inventory.supplier_ids.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.productType === 'variant' ? 'secondary' : 'outline'}>
                            {product.productType === 'variant' ? 'Wariant' : 'Prosty'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.isAvailable ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Dostępny</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm">Niedostępny</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProductClick(product.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Brak produktów</h3>
            <p className="text-muted-foreground mb-4">
              {allProducts.length === 0 
                ? `Brak produktów w oddziale ${activeBranch?.name || 'aktywnym'}.`
                : 'Nie znaleziono produktów pasujących do wybranych filtrów.'
              }
            </p>
            {filteredProducts.length === 0 && allProducts.length > 0 && (
              <Button 
                variant="outline"
                onClick={handleClearFilters}
              >
                Wyczyść filtry
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      {viewMode !== 'table' && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Poprzednia
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Następna
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Dialogs */}
      <SaveFilterDialog
        open={saveFilterDialogOpen}
        onOpenChange={setSaveFilterDialogOpen}
        currentFilters={getCurrentFilters()}
      />

      <SavedFiltersManager
        open={filtersManagerOpen}
        onOpenChange={setFiltersManagerOpen}
        onApplyFilter={handleApplySavedFilter}
      />
    </div>
  );
}