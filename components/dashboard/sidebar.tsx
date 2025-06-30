'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { useBranchStore } from '@/lib/stores/branch-store';
import { useSavedFiltersStore } from '@/lib/stores/saved-filters-store';
import { getWarehouseModule } from '@/lib/modules/warehouse/config';
import { getOrganizationModule } from '@/lib/modules/organization/config';
import { MenuItem } from '@/lib/types/module';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Building2 } from 'lucide-react';

interface NavigationTreeProps {
  items: MenuItem[];
  level?: number;
}

function NavigationTree({ items, level = 0 }: NavigationTreeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, collapse } = useSidebarStore();
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const handleNavigation = (path: string) => {
    // Close mobile sidebar when navigating
    if (window.innerWidth < 1024) {
      collapse();
    }
    router.push(path);
  };

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
        
        if (item.type === 'action') {
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-10 px-3',
                level > 0 && 'ml-4 w-[calc(100%-1rem)]',
                isCollapsed && 'px-2 justify-center',
              )}
              onClick={() => {
                // Handle action here
                console.log('Action:', item.actionId);
              }}
            >
              <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          );
        }

        const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
        const hasChildren = item.submenu && item.submenu.length > 0;
        const isOpen = openItems.has(item.id);

        if (hasChildren) {
          return (
            <Collapsible key={item.id} open={isOpen} onOpenChange={() => toggleItem(item.id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-10 px-3',
                    level > 0 && 'ml-4 w-[calc(100%-1rem)]',
                    isActive && 'bg-primary/10 text-primary',
                    isCollapsed && 'px-2 justify-center',
                  )}
                >
                  <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!isCollapsed && (
                    <ChevronRight
                      className={cn(
                        'ml-auto h-4 w-4 transition-transform',
                        isOpen && 'rotate-90'
                      )}
                    />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                <NavigationTree items={item.submenu} level={level + 1} />
              </CollapsibleContent>
            </Collapsible>
          );
        }

        return (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'w-full justify-start h-10 px-3',
              level > 0 && 'ml-4 w-[calc(100%-1rem)]',
              isActive && 'bg-primary/10 text-primary',
              isCollapsed && 'px-2 justify-center',
              // Special styling for saved filters
              level > 1 && item.color && 'border-l-2 ml-6 w-[calc(100%-1.5rem)]'
            )}
            style={{
              borderLeftColor: level > 1 && item.color ? item.color : undefined,
            }}
            onClick={() => handleNavigation(item.path)}
          >
            <Icon 
              className={cn(
                'h-4 w-4', 
                !isCollapsed && 'mr-3',
                level > 1 && item.color && 'text-current'
              )} 
              style={{
                color: level > 1 && item.color ? item.color : undefined,
              }}
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const { isCollapsed } = useSidebarStore();
  const { activeBranchId, _hasHydrated: branchHydrated } = useBranchStore();
  const { _hasHydrated: filtersHydrated } = useSavedFiltersStore();
  const [warehouseModule, setWarehouseModule] = React.useState<any>(null);
  const [organizationModule, setOrganizationModule] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Wait for both stores to hydrate before loading module
  const isHydrated = branchHydrated && filtersHydrated;

  React.useEffect(() => {
    if (!isHydrated) return;

    const loadModules = async () => {
      try {
        const [warehouse, organization] = await Promise.all([
          getWarehouseModule(activeBranchId),
          getOrganizationModule()
        ]);
        setWarehouseModule(warehouse);
        setOrganizationModule(organization);
      } catch (error) {
        console.error('Failed to load modules:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [activeBranchId, isHydrated]);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-screen"
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <span className="font-semibold text-lg">GCZ</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          {!isHydrated || loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-muted/50 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Warehouse Module */}
              {warehouseModule && (
                <div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-3 mb-2"
                      >
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Magazyn
                        </h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <NavigationTree items={warehouseModule.items} />
                </div>
              )}

              {/* Separator */}
              {warehouseModule && organizationModule && (
                <Separator className="mx-3" />
              )}

              {/* Organization Module */}
              {organizationModule && (
                <div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-3 mb-2"
                      >
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Organizacja
                        </h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <NavigationTree items={organizationModule.items} />
                </div>
              )}

              {/* Error State */}
              {!warehouseModule && !organizationModule && !loading && (
                <div className="text-center text-muted-foreground text-sm">
                  Nie udało się załadować modułów
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </motion.aside>
  );
}