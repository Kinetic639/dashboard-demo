import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { branchLocationsMap, getLocationProductCountByBranch, mockBranches } from '@/lib/mock/branches';
import { buildLocationTree } from '@/lib/utils/build-location-tree';
import { LocationQrActions } from '@/components/locations/location-qr-actions';
import { 
  MapPin, 
  Package, 
  Edit, 
  ArrowLeft, 
  Calendar,
  Hash,
  Palette,
  FileText,
  Image as ImageIcon,
  Building2,
  ClipboardList,
  Settings,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';

interface LocationDetailsPageProps {
  params: {
    id: string;
  };
}

// Add generateStaticParams for static export
export async function generateStaticParams() {
  const allLocations = Object.values(branchLocationsMap).flat();
  return allLocations.map((location) => ({
    id: location.id,
  }));
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-muted/50 rounded animate-pulse" />
        <div className="h-8 bg-muted/50 rounded w-48 animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-96 bg-muted/50 rounded animate-pulse" />
        <div className="h-96 bg-muted/50 rounded animate-pulse" />
      </div>
    </div>
  );
}

function LocationDetailsContent({ locationId }: { locationId: string }) {
  // Find location across all branches
  let location = null;
  let branchId = null;
  
  for (const [bId, locations] of Object.entries(branchLocationsMap)) {
    const found = locations.find(loc => loc.id === locationId);
    if (found) {
      location = found;
      branchId = bId;
      break;
    }
  }
  
  if (!location || !branchId) {
    notFound();
  }

  const branch = mockBranches.find(b => b.id === branchId);
  const productCount = getLocationProductCountByBranch(branchId, locationId);
  const allBranchLocations = branchLocationsMap[branchId];
  
  // Find parent location
  const parentLocation = location.parent_id 
    ? allBranchLocations.find(loc => loc.id === location.parent_id)
    : null;

  // Find child locations
  const childLocations = allBranchLocations.filter(loc => loc.parent_id === locationId);

  const Icon = location.icon_name 
    ? Icons[location.icon_name as keyof typeof Icons] as React.ComponentType<{ className?: string }>
    : Icons.MapPin;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/warehouse/locations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powrót do lokalizacji
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: location.color || '#6b7280' }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{location.name}</h1>
              {location.code && (
                <Badge variant="outline">{location.code}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                Szczegóły lokalizacji magazynowej
              </p>
              {branch && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {branch.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LocationQrActions 
            locationId={locationId} 
            locationName={location.name} 
          />
          <Button variant="outline">
            <ClipboardList className="mr-2 h-4 w-4" />
            Przeprowadź audyt
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Korekta ilości
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edytuj lokalizację
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informacje podstawowe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nazwa</label>
                <p className="text-sm">{location.name}</p>
              </div>
              {location.code && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kod</label>
                  <p className="text-sm font-mono">{location.code}</p>
                </div>
              )}
            </div>

            {location.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Opis</label>
                <p className="text-sm">{location.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Poziom</label>
                <p className="text-sm">{location.level}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Kolejność</label>
                <p className="text-sm">{location.sort_order}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ikona</label>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{location.icon_name}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Kolor</label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: location.color || '#6b7280' }}
                  />
                  <span className="text-sm font-mono">{location.color}</span>
                </div>
              </div>
            </div>

            {branch && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Oddział</label>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">{branch.name}</span>
                </div>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <label className="font-medium">Utworzono</label>
                <p>{new Date(location.created_at!).toLocaleDateString('pl-PL')}</p>
              </div>
              <div>
                <label className="font-medium">Zaktualizowano</label>
                <p>{new Date(location.updated_at!).toLocaleDateString('pl-PL')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics and Relations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Statystyki i relacje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">{productCount}</div>
                <div className="text-sm text-muted-foreground">Produktów</div>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">{childLocations.length}</div>
                <div className="text-sm text-muted-foreground">Podlokalizacji</div>
              </div>
            </div>

            {parentLocation && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Lokalizacja nadrzędna</label>
                <div className="mt-1 p-2 bg-muted/20 rounded flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{parentLocation.name}</span>
                  {parentLocation.code && (
                    <Badge variant="outline" className="text-xs">{parentLocation.code}</Badge>
                  )}
                </div>
              </div>
            )}

            {childLocations.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Podlokalizacje</label>
                <div className="mt-1 space-y-1">
                  {childLocations.map((child) => {
                    const ChildIcon = child.icon_name 
                      ? Icons[child.icon_name as keyof typeof Icons] as React.ComponentType<{ className?: string }>
                      : Icons.MapPin;
                    
                    return (
                      <div key={child.id} className="p-2 bg-muted/20 rounded flex items-center gap-2">
                        <div 
                          className="flex h-6 w-6 items-center justify-center rounded text-white"
                          style={{ backgroundColor: child.color || '#6b7280' }}
                        >
                          <ChildIcon className="h-3 w-3" />
                        </div>
                        <span className="text-sm">{child.name}</span>
                        {child.code && (
                          <Badge variant="outline" className="text-xs">{child.code}</Badge>
                        )}
                        <div className="ml-auto text-xs text-muted-foreground">
                          {getLocationProductCountByBranch(branchId, child.id)} produktów
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image */}
        {location.image_url && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Zdjęcie lokalizacji
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={location.image_url} 
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function LocationDetailsPage({ params }: LocationDetailsPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LocationDetailsContent locationId={params.id} />
    </Suspense>
  );
}