'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  QrCode, 
  MapPin, 
  Building2, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  Shield,
  Eye
} from 'lucide-react';
import { resolveQrCode, QrResolutionResult } from '@/lib/qr/utils';
import { AssignQrToLocationDialog } from '@/components/qr/assign-qr-to-location-dialog';
import { useToast } from '@/hooks/use-toast';

export default function QrCodePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const qrToken = params.qr_token as string;
  
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<QrResolutionResult | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!qrToken) return;

    const resolve = async () => {
      setLoading(true);
      try {
        const resolutionResult = await resolveQrCode(qrToken);
        setResult(resolutionResult);
        
        // Auto-redirect if successful
        if (resolutionResult.success && resolutionResult.action === 'redirect' && resolutionResult.redirectUrl) {
          setTimeout(() => {
            router.push(resolutionResult.redirectUrl!);
          }, 1500);
        }
      } catch (error) {
        console.error('Error resolving QR code:', error);
        setResult({
          success: false,
          action: 'error',
          message: 'Wystąpił błąd podczas rozpoznawania kodu QR.',
        });
      } finally {
        setLoading(false);
      }
    };

    resolve();
  }, [qrToken, router]);

  const handleAssignSuccess = () => {
    toast({
      title: 'Kod QR przypisany',
      description: 'Kod QR został pomyślnie przypisany do lokalizacji.',
    });
    
    // Refresh the resolution
    resolveQrCode(qrToken).then(setResult);
    setAssignDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
              <h3 className="text-lg font-medium mb-2">Rozpoznawanie kodu QR...</h3>
              <p className="text-sm text-muted-foreground">
                Sprawdzamy kod: <span className="font-mono">{qrToken}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-medium mb-2">Błąd</h3>
              <p className="text-sm text-muted-foreground">
                Nie udało się rozpoznać kodu QR.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <QrCode className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-xl">Kod QR</CardTitle>
            <CardDescription>
              Token: <span className="font-mono text-sm">{qrToken}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success - Redirect to location */}
            {result.action === 'redirect' && result.qrCode?.location && (
              <>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Kod QR rozpoznany pomyślnie! Przekierowywanie do lokalizacji...
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{result.qrCode.location.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        {result.qrCode.location.branch_name}
                      </div>
                    </div>
                    {result.qrCode.location.code && (
                      <Badge variant="outline">{result.qrCode.location.code}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Przekierowywanie za chwilę...
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => router.push(result.redirectUrl!)}
                >
                  Przejdź teraz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {/* Assign QR to location */}
            {result.action === 'assign' && (
              <>
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    {result.message}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => setAssignDialogOpen(true)}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Przypisz do lokalizacji
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Kod QR: <span className="font-mono">{qrToken}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Utworzony: {new Date(result.qrCode?.created_at).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Error states */}
            {(result.action === 'error' || result.action === 'unauthorized') && (
              <>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {result.message}
                  </AlertDescription>
                </Alert>

                {result.action === 'unauthorized' && (
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Skontaktuj się z administratorem, jeśli uważasz, że to błąd.
                    </p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push('/dashboard')}
                >
                  Powrót do Dashboard
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Assign Dialog */}
      {result.action === 'assign' && (
        <AssignQrToLocationDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          qrToken={qrToken}
          availableLocations={result.availableLocations || []}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}