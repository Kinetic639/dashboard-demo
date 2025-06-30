import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, MapPin, Tag, Truck } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted/50 rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-96 animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function WarehouseOverview() {
  const modules = [
    {
      title: 'Produkty',
      description: 'Zarządzanie produktami i ich kategoriami',
      icon: Package,
      href: '/dashboard/warehouse/products/list',
      color: 'text-blue-500',
    },
    {
      title: 'Lokalizacje',
      description: 'Zarządzanie lokalizacjami magazynowymi',
      icon: MapPin,
      href: '/dashboard/warehouse/locations',
      color: 'text-green-500',
    },
    {
      title: 'Etykiety',
      description: 'Zarządzanie etykietami i szablonami',
      icon: Tag,
      href: '/dashboard/warehouse/labels',
      color: 'text-purple-500',
    },
    {
      title: 'Dostawcy',
      description: 'Zarządzanie dostawcami i dostawami',
      icon: Truck,
      href: '/dashboard/warehouse/suppliers',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Magazyn</h1>
        <p className="text-muted-foreground">
          Zarządzanie magazynem i zapasami
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.title} href={module.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {module.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${module.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function WarehousePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <WarehouseOverview />
    </Suspense>
  );
}