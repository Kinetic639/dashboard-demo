import { MenuItem } from '@/lib/types/module';
import { useSavedFiltersStore } from '@/lib/stores/saved-filters-store';
import { getCurrentUser } from '@/lib/mock/organization';

export async function getWarehouseModule(branchId: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get saved filters for sidebar (both user's own and public filters they've added to sidebar)
  const currentUser = getCurrentUser();
  const savedFilters = useSavedFiltersStore.getState().getSidebarFilters(branchId);
  
  // Filter to show only user's own filters in sidebar (they can add public filters to their sidebar by cloning them)
  const userSidebarFilters = savedFilters.filter(filter => filter.userId === currentUser.id);

  const warehouseModule = {
    id: 'warehouse',
    name: 'Magazyn',
    description: 'Zarządzanie magazynem i zapasami',
    items: [
      {
        id: 'warehouse-overview',
        label: 'Przegląd',
        icon: 'LayoutDashboard',
        path: '/dashboard/warehouse',
        type: 'link' as const,
      },
      {
        id: 'products',
        label: 'Produkty',
        icon: 'Package',
        path: '/dashboard/warehouse/products',
        type: 'group' as const,
        submenu: [
          {
            id: 'products-list',
            label: 'Lista produktów',
            icon: 'List',
            path: '/dashboard/warehouse/products/list',
            type: 'link' as const,
            submenu: userSidebarFilters.length > 0 ? [
              ...userSidebarFilters.map((filter) => ({
                id: `saved-filter-${filter.id}`,
                label: filter.name,
                icon: filter.icon,
                path: `/dashboard/warehouse/products/list?search=${encodeURIComponent(filter.filters.search || '')}&type=${filter.filters.type || 'all'}&availability=${filter.filters.availability || 'all'}&service=${filter.filters.service || 'all'}`,
                type: 'link' as const,
                color: filter.color,
              })),
            ] : undefined,
          },
          {
            id: 'products-add',
            label: 'Dodaj produkt',
            icon: 'Plus',
            path: '/dashboard/warehouse/products/add',
            type: 'link' as const,
          },
          {
            id: 'products-categories',
            label: 'Kategorie',
            icon: 'FolderTree',
            path: '/dashboard/warehouse/products/categories',
            type: 'link' as const,
          },
        ],
      },
      {
        id: 'locations',
        label: 'Lokalizacje',
        icon: 'MapPin',
        path: '/dashboard/warehouse/locations',
        type: 'group' as const,
        submenu: [
          {
            id: 'locations-list',
            label: 'Lista lokalizacji',
            icon: 'List',
            path: '/dashboard/warehouse/locations',
            type: 'link' as const,
          },
          {
            id: 'locations-add',
            label: 'Dodaj lokalizację',
            icon: 'Plus',
            path: '/dashboard/warehouse/locations/add',
            type: 'link' as const,
          },
        ],
      },
      {
        id: 'audit',
        label: 'Audyt',
        icon: 'ClipboardList',
        path: '/dashboard/warehouse/audit',
        type: 'group' as const,
        submenu: [
          {
            id: 'audit-overview',
            label: 'Przegląd',
            icon: 'LayoutDashboard',
            path: '/dashboard/warehouse/audit',
            type: 'link' as const,
          },
          {
            id: 'audit-schedules',
            label: 'Harmonogram audytów',
            icon: 'Calendar',
            path: '/dashboard/warehouse/audit/schedules',
            type: 'link' as const,
          },
          {
            id: 'audit-history',
            label: 'Historia audytów',
            icon: 'History',
            path: '/dashboard/warehouse/audit/history',
            type: 'link' as const,
          },
        ],
      },
      {
        id: 'suppliers',
        label: 'Dostawcy',
        icon: 'Truck',
        path: '/dashboard/warehouse/suppliers',
        type: 'group' as const,
        submenu: [
          {
            id: 'suppliers-list',
            label: 'Lista dostawców',
            icon: 'List',
            path: '/dashboard/warehouse/suppliers/list',
            type: 'link' as const,
          },
          {
            id: 'suppliers-deliveries',
            label: 'Dostawy',
            icon: 'Package',
            path: '/dashboard/warehouse/suppliers/deliveries',
            type: 'link' as const,
          },
        ],
      },
      {
        id: 'labels',
        label: 'Etykiety',
        icon: 'Tag',
        path: '/dashboard/warehouse/labels',
        type: 'group' as const,
        submenu: [
          {
            id: 'labels-products',
            label: 'Etykiety produktów',
            icon: 'Package',
            path: '/dashboard/warehouse/labels/products',
            type: 'link' as const,
          },
          {
            id: 'labels-locations',
            label: 'Etykiety lokalizacji',
            icon: 'MapPin',
            path: '/dashboard/warehouse/labels/locations',
            type: 'link' as const,
          },
          {
            id: 'labels-templates',
            label: 'Szablony etykiet',
            icon: 'FileText',
            path: '/dashboard/warehouse/labels/templates',
            type: 'link' as const,
          },
        ],
      },
    ] as MenuItem[],
  };

  return warehouseModule;
}