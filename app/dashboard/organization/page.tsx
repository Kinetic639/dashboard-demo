import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, MapPin, Settings } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted/50 rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-96 animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function OrganizationOverview() {
  const modules = [
    {
      title: 'Profil organizacji',
      description: 'Zarządzanie podstawowymi informacjami o organizacji',
      icon: Building2,
      href: '/dashboard/organization/profile',
      color: 'text-blue-500',
      stats: 'GCZ - Grupa Cichy-Zasada',
    },
    {
      title: 'Oddziały',
      description: 'Zarządzanie oddziałami organizacji',
      icon: MapPin,
      href: '/dashboard/organization/branches',
      color: 'text-green-500',
      stats: '4 aktywne oddziały',
    },
    {
      title: 'Użytkownicy',
      description: 'Zarządzanie użytkownikami i uprawnieniami',
      icon: Users,
      href: '/dashboard/organization/users',
      color: 'text-purple-500',
      stats: '5 aktywnych użytkowników',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zarządzanie organizacją</h1>
        <p className="text-muted-foreground">
          Panel administracyjny do zarządzania organizacją, użytkownikami i uprawnieniami
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <p className="text-xs text-muted-foreground mb-2">
                    {module.description}
                  </p>
                  <p className="text-xs font-medium text-primary">
                    {module.stats}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizacja</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GCZ</div>
            <p className="text-xs text-muted-foreground">
              Grupa Cichy-Zasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oddziały</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Aktywne lokalizacje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Użytkownicy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Aktywni członkowie
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Zdefiniowane role
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OrganizationPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <OrganizationOverview />
    </Suspense>
  );
}