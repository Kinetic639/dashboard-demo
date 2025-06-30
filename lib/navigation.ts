import { NavigationItem } from '@/lib/types';

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/dashboard',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'Package',
    href: '/inventory',
    children: [
      {
        id: 'products',
        label: 'Products',
        icon: 'Box',
        href: '/inventory/products',
      },
      {
        id: 'categories',
        label: 'Categories',
        icon: 'Tag',
        href: '/inventory/categories',
      },
      {
        id: 'stock',
        label: 'Stock Management',
        icon: 'Warehouse',
        href: '/inventory/stock',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: 'ShoppingCart',
    href: '/orders',
    children: [
      {
        id: 'all-orders',
        label: 'All Orders',
        icon: 'List',
        href: '/orders/all',
      },
      {
        id: 'pending',
        label: 'Pending',
        icon: 'Clock',
        href: '/orders/pending',
      },
      {
        id: 'completed',
        label: 'Completed',
        icon: 'CheckCircle',
        href: '/orders/completed',
      },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'Users',
    href: '/customers',
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    icon: 'Truck',
    href: '/suppliers',
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: 'MapPin',
    href: '/locations',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart3',
    href: '/reports',
    children: [
      {
        id: 'sales',
        label: 'Sales Reports',
        icon: 'TrendingUp',
        href: '/reports/sales',
      },
      {
        id: 'inventory-reports',
        label: 'Inventory Reports',
        icon: 'Archive',
        href: '/reports/inventory',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: 'Activity',
        href: '/reports/analytics',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    href: '/settings',
    children: [
      {
        id: 'organization',
        label: 'Organization',
        icon: 'Building',
        href: '/settings/organization',
      },
      {
        id: 'users',
        label: 'Users & Roles',
        icon: 'UserCheck',
        href: '/settings/users',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: 'Plug',
        href: '/settings/integrations',
      },
    ],
  },
];