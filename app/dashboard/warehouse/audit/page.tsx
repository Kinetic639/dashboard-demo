import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Calendar, History, TrendingUp } from 'lucide-react';

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

function AuditOverview() {
  const modules = [
    {
      title: 'Harmonogram audytów',
      description: 'Zarządzanie harmonogramami cyklicznych audytów',
      icon: Calendar,
      href: '/dashboard/warehouse/audit/schedules',
      color: 'text-blue-500',
      stats: '3 aktywne harmonogramy',
    },
    {
      title: 'Historia audytów',
      description: 'Przeglądaj poprzednie audyty i ich wyniki',
      icon: History,
      href: '/dashboard/warehouse/audit/history',
      color: 'text-green-500',
      stats: '12 zakończonych audytów',
    },
    {
      title: 'Przeprowadź audyt',
      description: 'Rozpocznij nowy audyt magazynowy',
      icon: ClipboardList,
      href: '/dashboard/warehouse/locations',
      color: 'text-purple-500',
      stats: 'Dostępne w lokalizacjach',
    },
    {
      title: 'Statystyki',
      description: 'Analizy i raporty z audytów',
      icon: TrendingUp,
      href: '/dashboard/warehouse/audit/stats',
      color: 'text-orange-500',
      stats: 'Ostatni audyt: 15.01.2024',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audyt magazynowy</h1>
        <p className="text-muted-foreground">
          Zarządzanie audytami magazynowymi i weryfikacja stanów produktów
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ostatni audyt</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.01.2024</div>
            <p className="text-xs text-muted-foreground">
              Sekcja A - 8 korekt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Następny audyt</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22.01.2024</div>
            <p className="text-xs text-muted-foreground">
              Audyt tygodniowy - Sekcja A
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Średnia dokładność</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Ostatnie 30 dni
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AuditOverview />
    </Suspense>
  );
}