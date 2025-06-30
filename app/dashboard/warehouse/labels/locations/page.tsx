import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

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

function LocationLabelsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Etykiety lokalizacji</h1>
        <p className="text-muted-foreground">
          Zarządzanie etykietami dla lokalizacji
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Etykiety lokalizacji
          </CardTitle>
          <CardDescription>
            Ta strona będzie zawierać funkcjonalności zarządzania etykietami lokalizacji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Moduł w budowie</h3>
            <p>Funkcjonalności etykiet lokalizacji będą dostępne wkrótce.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LocationLabelsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LocationLabelsContent />
    </Suspense>
  );
}