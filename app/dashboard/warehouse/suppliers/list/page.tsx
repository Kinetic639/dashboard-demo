import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted/50 rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-96 animate-pulse" />
      </div>
      <div className="h-96 bg-muted/50 rounded animate-pulse" />
    </div>
  );
}

function SuppliersListContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lista dostawców</h1>
        <p className="text-muted-foreground">
          Przeglądaj i zarządzaj wszystkimi dostawcami
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Lista wszystkich dostawców
          </CardTitle>
          <CardDescription>
            Ta strona będzie zawierać tabelę z wszystkimi dostawcami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <List className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Lista dostawców</h3>
            <p>Tutaj będzie wyświetlana tabela z wszystkimi dostawcami.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuppliersListPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SuppliersListContent />
    </Suspense>
  );
}