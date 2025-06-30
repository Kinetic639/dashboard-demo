import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

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

function ProductsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Produkty</h1>
        <p className="text-muted-foreground">
          Zarządzanie produktami w magazynie
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Moduł Produktów
          </CardTitle>
          <CardDescription>
            Ta strona będzie zawierać funkcjonalności zarządzania produktami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Moduł w budowie</h3>
            <p>Funkcjonalności zarządzania produktami będą dostępne wkrótce.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}