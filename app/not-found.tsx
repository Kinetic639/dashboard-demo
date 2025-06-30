import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Strona nie znaleziona</CardTitle>
          <CardDescription>
            Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Przejdź do Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do strony głównej
            </Link>
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Błąd 404 - Strona nie znaleziona
          </div>
        </CardContent>
      </Card>
    </div>
  );
}