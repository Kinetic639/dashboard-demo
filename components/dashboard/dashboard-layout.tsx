'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          isCollapsed ? 'pointer-events-none' : 'pointer-events-auto'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/50 transition-opacity',
            isCollapsed ? 'opacity-0' : 'opacity-100'
          )}
          onClick={() => useSidebarStore.getState().collapse()}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-80 transform transition-transform',
            isCollapsed ? '-translate-x-full' : 'translate-x-0'
          )}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header (fixed height assumed: h-16 or similar) */}
        <div className="shrink-0">
          <Header />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto flex-grow">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
