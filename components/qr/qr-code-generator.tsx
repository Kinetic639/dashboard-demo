'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  QrCode, 
  Plus, 
  Download, 
  Eye, 
  Copy,
  Trash2,
  Calendar,
  User
} from 'lucide-react';
import { 
  addQrCode, 
  generateQrToken, 
  getAllQrCodes, 
  getUnassignedQrCodes 
} from '@/lib/mock/qr-codes';
import { getCurrentUser } from '@/lib/mock/organization';
import { getQrCodeUrl } from '@/lib/qr/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

export function QrCodeGenerator() {
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState('5');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedCodes, setGeneratedCodes] = React.useState<any[]>([]);
  const [allCodes, setAllCodes] = React.useState(getAllQrCodes());

  const currentUser = getCurrentUser();
  const unassignedCodes = getUnassignedQrCodes();

  const handleGenerate = async () => {
    const count = parseInt(quantity) || 1;
    if (count < 1 || count > 50) {
      toast({
        title: 'Nieprawidłowa liczba',
        description: 'Możesz wygenerować od 1 do 50 kodów QR na raz.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    const newCodes = [];

    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      for (let i = 0; i < count; i++) {
        const qrCode = addQrCode({
          qr_token: generateQrToken(),
          entity_type: 'location',
          entity_id: null,
          created_by: currentUser.id,
        });
        newCodes.push(qrCode);
      }

      setGeneratedCodes(newCodes);
      setAllCodes(getAllQrCodes());

      toast({
        title: 'Kody QR wygenerowane',
        description: `Pomyślnie wygenerowano ${count} kodów QR.`,
      });
    } catch (error) {
      toast({
        title: 'Błąd generowania',
        description: 'Wystąpił błąd podczas generowania kodów QR.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = (qrToken: string) => {
    const url = getQrCodeUrl(qrToken);
    navigator.clipboard.writeText(url);
    toast({
      title: 'Skopiowano',
      description: 'URL kodu QR został skopiowany do schowka.',
    });
  };

  const handleCopyToken = (qrToken: string) => {
    navigator.clipboard.writeText(qrToken);
    toast({
      title: 'Skopiowano',
      description: 'Token kodu QR został skopiowany do schowka.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Generator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Generuj nowe kody QR
            </CardTitle>
            <CardDescription>
              Wygeneruj puste kody QR gotowe do przypisania do lokalizacji
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="quantity">Liczba kodów</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Wprowadź liczbę kodów"
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="min-w-[120px]"
              >
                {isGenerating ? 'Generowanie...' : 'Generuj kody'}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Możesz wygenerować od 1 do 50 kodów QR na raz. Kody będą gotowe do przypisania do lokalizacji.
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recently Generated Codes */}
      <AnimatePresence>
        {generatedCodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Ostatnio wygenerowane kody ({generatedCodes.length})
                </CardTitle>
                <CardDescription>
                  Kody QR wygenerowane w tej sesji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {generatedCodes.map((code, index) => (
                    <motion.div
                      key={code.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {code.qr_token}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCopyToken(code.qr_token)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCopyUrl(code.qr_token)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Utworzony: {new Date(code.created_at).toLocaleTimeString('pl-PL')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unassigned Codes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Nieprzypisane kody QR ({unassignedCodes.length})
            </CardTitle>
            <CardDescription>
              Kody QR gotowe do przypisania do lokalizacji
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unassignedCodes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Utworzony przez</TableHead>
                    <TableHead>Data utworzenia</TableHead>
                    <TableHead className="w-[150px]">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unassignedCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {code.qr_token}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {code.created_by === currentUser.id ? 'Ty' : 'Inny użytkownik'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(code.created_at).toLocaleDateString('pl-PL')}</div>
                          <div className="text-muted-foreground">
                            {formatDistanceToNow(new Date(code.created_at), {
                              addSuffix: true,
                              locale: pl,
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToken(code.qr_token)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(code.qr_token)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/qr/${code.qr_token}`, '_blank')}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Brak nieprzypisanych kodów</h3>
                <p>Wszystkie kody QR zostały już przypisane do lokalizacji.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}