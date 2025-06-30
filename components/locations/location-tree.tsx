'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LocationTreeItem } from '@/lib/types/location-tree';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuditStartDialog } from '@/components/audit/audit-start-dialog';
import { AuditProcessDialog } from '@/components/audit/audit-process-dialog';
import { AuditSummaryDialog } from '@/components/audit/audit-summary-dialog';
import { QuantityCorrectionDialog } from '@/components/audit/quantity-correction-dialog';
import { 
  ChevronRight, 
  Eye, 
  Edit, 
  Plus, 
  Trash2,
  MoreHorizontal,
  ClipboardList,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useBranchStore } from '@/lib/stores/branch-store';
import { useAuditStore } from '@/lib/stores/audit-store';
import { getProductsForLocations } from '@/lib/mock/audit';
import { getCurrentUser } from '@/lib/mock/organization';
import { useToast } from '@/hooks/use-toast';

interface LocationTreeProps {
  locations: LocationTreeItem[];
  onEdit?: (location: LocationTreeItem) => void;
  onAddChild?: (parentLocation: LocationTreeItem) => void;
  onDelete?: (location: LocationTreeItem) => void;
  level?: number;
}

interface LocationNodeProps {
  location: LocationTreeItem;
  onEdit?: (location: LocationTreeItem) => void;
  onAddChild?: (parentLocation: LocationTreeItem) => void;
  onDelete?: (location: LocationTreeItem) => void;
  level: number;
}

function LocationNode({ 
  location, 
  onEdit, 
  onAddChild, 
  onDelete, 
  level 
}: LocationNodeProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { activeBranchId } = useBranchStore();
  const { startAudit, completeAudit, resetAudit } = useAuditStore();
  const [isOpen, setIsOpen] = React.useState(level < 2);
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [auditStartOpen, setAuditStartOpen] = React.useState(false);
  const [auditProcessOpen, setAuditProcessOpen] = React.useState(false);
  const [auditSummaryOpen, setAuditSummaryOpen] = React.useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = React.useState(false);
  
  const hasChildren = location.children && location.children.length > 0;
  const Icon = location.icon_name 
    ? Icons[location.icon_name as keyof typeof Icons] as React.ComponentType<{ className?: string }>
    : Icons.MapPin;

  const currentUser = getCurrentUser();

  const handleViewDetails = () => {
    router.push(`/dashboard/warehouse/locations/${location.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(location);
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild?.(location);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(location);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (location.raw.image_url) {
      setImageModalOpen(true);
    }
  };

  const handleStartAudit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAuditStartOpen(true);
  };

  const handleConfirmAudit = () => {
    const products = getProductsForLocations([location.id], activeBranchId);
    
    const audit = {
      id: `audit-${Date.now()}`,
      name: `Audyt - ${location.name}`,
      location_ids: [location.id],
      status: 'pending' as const,
      conducted_by: currentUser.id,
      total_products: products.length,
      checked_products: 0,
      corrections_count: 0,
      total_value_change: 0,
      branch_id: activeBranchId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    startAudit(audit, products);
    setAuditProcessOpen(true);
    
    toast({
      title: 'Audyt rozpoczęty',
      description: `Rozpoczęto audyt lokalizacji "${location.name}".`,
    });
  };

  const handleCompleteAudit = () => {
    completeAudit();
    setAuditProcessOpen(false);
    setAuditSummaryOpen(true);
  };

  const handleFinishAudit = () => {
    resetAudit();
    toast({
      title: 'Audyt zakończony',
      description: 'Audyt został pomyślnie zakończony i zapisany w historii.',
    });
  };

  const handleQuantityCorrection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCorrectionDialogOpen(true);
  };

  const handleSaveCorrection = (correction: { newQuantity: number; reason: string }) => {
    toast({
      title: 'Korekta zapisana',
      description: `Ilość produktu została zaktualizowana. Powód: ${correction.reason}`,
    });
  };

  const canDelete = (location.productCount || 0) === 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full mb-1"
      >
        <div 
          className={cn(
            'group flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors',
            level > 0 && 'border-l-2',
          )} 
          style={{ 
            marginLeft: `${level * 20}px`,
            marginRight: 0,
            borderLeftColor: location.color || undefined 
          }}
        >
          
          {/* Expand/Collapse Button */}
          <div className="flex-shrink-0">
            {hasChildren ? (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronRight className={cn(
                      'h-3 w-3 transition-transform',
                      isOpen && 'rotate-90'
                    )} />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            ) : (
              <div className="w-6" />
            )}
          </div>

          {/* Location Icon */}
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-md text-white flex-shrink-0"
            style={{ backgroundColor: location.color || '#6b7280' }}
          >
            <Icon className="h-5 w-5" />
          </div>

          {/* Location Image */}
          {location.raw.image_url && (
            <div 
              className="h-10 w-10 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              onClick={handleImageClick}
            >
              <img 
                src={location.raw.image_url} 
                alt={location.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Location Info - takes remaining space */}
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{location.name}</h3>
              {location.code && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {location.code}
                </Badge>
              )}
            </div>
            {location.raw.description && (
              <p className="text-xs text-muted-foreground truncate">
                {location.raw.description}
              </p>
            )}
          </div>

          {/* Product Count */}
          <div className="flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {location.productCount || 0}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleViewDetails}
            >
              <Eye className="h-3 w-3" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-3 w-3" />
                  Edytuj
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddChild}>
                  <Plus className="mr-2 h-3 w-3" />
                  Dodaj podlokalizację
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleStartAudit}>
                  <ClipboardList className="mr-2 h-3 w-3" />
                  Przeprowadź audyt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleQuantityCorrection}>
                  <Settings className="mr-2 h-3 w-3" />
                  Korekta ilości
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={!canDelete}
                  className={cn(
                    !canDelete && 'opacity-50 cursor-not-allowed',
                    canDelete && 'text-destructive focus:text-destructive'
                  )}
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Usuń
                  {!canDelete && (
                    <span className="ml-auto text-xs">(nie pusta)</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Children */}
        {hasChildren && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent>
              <div className="mt-1">
                <AnimatePresence>
                  {location.children?.map((child) => (
                    <LocationNode
                      key={child.id}
                      location={child}
                      onEdit={onEdit}
                      onAddChild={onAddChild}
                      onDelete={onDelete}
                      level={level + 1}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </motion.div>

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{location.name}</DialogTitle>
          </DialogHeader>
          {location.raw.image_url && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={location.raw.image_url} 
                alt={location.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Audit Dialogs */}
      <AuditStartDialog
        open={auditStartOpen}
        onOpenChange={setAuditStartOpen}
        location={location}
        branchId={activeBranchId}
        onConfirm={handleConfirmAudit}
      />

      <AuditProcessDialog
        open={auditProcessOpen}
        onOpenChange={setAuditProcessOpen}
        onComplete={handleCompleteAudit}
      />

      <AuditSummaryDialog
        open={auditSummaryOpen}
        onOpenChange={setAuditSummaryOpen}
        onFinish={handleFinishAudit}
      />

      <QuantityCorrectionDialog
        open={correctionDialogOpen}
        onOpenChange={setCorrectionDialogOpen}
        product={null} // Would need to select a product first
        onSave={handleSaveCorrection}
      />
    </>
  );
}

export function LocationTree({ 
  locations, 
  onEdit, 
  onAddChild, 
  onDelete, 
  level = 0 
}: LocationTreeProps) {
  return (
    <div className="space-y-0">
      {locations.map((location) => (
        <LocationNode
          key={location.id}
          location={location}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
          level={level}
        />
      ))}
    </div>
  );
}