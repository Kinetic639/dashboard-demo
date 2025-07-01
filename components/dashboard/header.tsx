'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Bell,
  Menu,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { useNotificationsStore } from '@/lib/stores/notifications-store';
import { mockUserFullName, mockUserInitials, mockUser } from '@/lib/mock/user';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { NotificationsDrawer } from './notifications-drawer';
import { BranchSelector } from './branch-selector';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useBranchStore } from '@/lib/stores/branch-store';
import { useHasHydrated } from '@/hooks/use-hydrated-value';

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Always start with Dashboard
  breadcrumbs.push({
    label: 'Dashboard',
    href: '/dashboard',
    isLast: segments.length === 1,
  });

  // Build breadcrumbs from path segments
  let currentPath = '';
  for (let i = 1; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    const fullPath = `/dashboard${currentPath}`;
    const isLast = i === segments.length - 1;

    let label = segments[i];

    // Custom labels for known paths
    switch (segments[i]) {
      case 'warehouse':
        label = 'Magazyn';
        break;
      case 'locations':
        label = 'Lokalizacje';
        break;
      case 'products':
        label = 'Produkty';
        break;
      case 'labels':
        label = 'Etykiety';
        break;
      case 'suppliers':
        label = 'Dostawcy';
        break;
      case 'list':
        label = 'Lista';
        break;
      case 'templates':
        label = 'Szablony';
        break;
      case 'deliveries':
        label = 'Dostawy';
        break;
      default:
        // For dynamic segments like IDs, try to get a meaningful name
        if (segments[i - 1] === 'locations' && segments[i].length > 5) {
          label = 'Szczegóły lokalizacji';
        } else {
          // Capitalize first letter
          label = label.charAt(0).toUpperCase() + label.slice(1);
        }
    }

    breadcrumbs.push({
      label,
      href: fullPath,
      isLast,
    });
  }

  return breadcrumbs;
}

export function Header() {
  const pathname = usePathname();
  const { toggle, isCollapsed } = useSidebarStore();
  const { openDrawer, unreadCount } = useNotificationsStore();
const hydrated = useHasHydrated();
if (!hydrated) {
  return (
    <header className="h-16 flex items-center px-4">
      <span className="text-sm text-muted-foreground">Ładowanie oddziału...</span>
    </header>
  );
}
  const breadcrumbs = generateBreadcrumbs(pathname);

  const handleToggle = () => {
    // On mobile, always toggle between open/closed
    // On desktop, toggle between collapsed/expanded
    if (window.innerWidth < 1024) {
      toggle();
    } else {
      toggle();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="shrink-0"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Branch Selector - replaces search bar */}
          <div className="flex-1 max-w-md">
            <BranchSelector />
          </div>

          {/* Spacer to push actions to far right */}
          <div className="flex-1" />

          {/* Actions - moved to far right */}
          <div className="flex items-center gap-2">
            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <MessageSquare className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                3
              </Badge>
              <span className="sr-only">Messages</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openDrawer}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={mockUserFullName()} />
                    <AvatarFallback className="text-xs">
                      {mockUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">
                      {mockUserFullName()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {mockUser.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {mockUserFullName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {mockUser.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ustawienia</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Wyloguj</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="border-t bg-muted/20 px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="text-sm">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href} className="text-xs hover:text-foreground flex items-center">
                          {index === 0 ? (
                            <>
                              <Home className="h-3 w-3" />
                              <span className="sr-only">Strona główna</span>
                            </>
                          ) : (
                            crumb.label
                          )}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!crumb.isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-3 w-3" />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <NotificationsDrawer />
    </>
  );
}