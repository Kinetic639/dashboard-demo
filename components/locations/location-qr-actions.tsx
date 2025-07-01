'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  QrCode, 
  Plus, 
  Eye, 
  Copy, 
  Link,
  MoreHorizontal 
} from 'lucide-react';
import { 
  getAllQrCodes, 
  addQrCode, 
  generateQrToken 
} from '@/lib/mock/qr-codes';
import { getCurrentUser } from '@/lib/mock/organization';
import { getQrCodeUrl } from '@/lib/qr/utils';
import { useToast } from '@/hooks/use-toast';

interface LocationQrActionsProps {
  locationId: string;
  locationName: string;
}

export function LocationQrActions({ locationId, locationName }: LocationQrActionsProps) {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  // Find existing QR codes for this location
  const existingQrCodes = getAllQrCodes().filter(qr => qr.entity_id === locationId);

  const handleGenerateQr = async () => {
    try {
      const qrCode = addQrCode({
        qr_token: generateQrToken(),
        entity_type: 'location',
        entity_id: locationId,
        created_by: currentUser.id,
        assigned_at: new Date().toISOString(),
      });

      toast({
        title: 'Kod QR wygenerowany',
        description: `Kod QR dla lokalizacji "${locationName}" został utworzony.`,
      });

      // Auto-copy the URL
      const url = getQrCodeUrl(qrCode.qr_token);
      navigator.clipboard.writeText(url);
      
      toast({
        title: 'URL skopiowany',
        description: 'URL kodu QR został skopiowany do schowka.',
      });
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się wygenerować kodu QR.',
        variant: 'destructive',
      });
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

  const handleViewQr = (qrToken: string) => {
    window.open(`/qr/${qrToken}`, '_blank');
  };

  if (existingQrCodes.length === 0) {
    return (
      <Button variant="outline" size="sm" onClick={handleGenerateQr}>
        <QrCode className="mr-2 h-4 w-4" />
        Generuj kod QR
      </Button>
    );
  }

  if (existingQrCodes.length === 1) {
    const qrCode = existingQrCodes[0];
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <QrCode className="mr-2 h-4 w-4" />
            Kod QR
            <Badge variant="secondary" className="ml-2 text-xs">
              {qrCode.qr_token.slice(-6)}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleViewQr(qrCode.qr_token)}>
            <Eye className="mr-2 h-4 w-4" />
            Zobacz kod QR
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCopyUrl(qrCode.qr_token)}>
            <Copy className="mr-2 h-4 w-4" />
            Kopiuj URL
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleGenerateQr}>
            <Plus className="mr-2 h-4 w-4" />
            Generuj nowy kod
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="mr-2 h-4 w-4" />
          Kody QR
          <Badge variant="secondary" className="ml-2 text-xs">
            {existingQrCodes.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {existingQrCodes.map((qrCode) => (
          <React.Fragment key={qrCode.id}>
            <DropdownMenuItem onClick={() => handleViewQr(qrCode.qr_token)}>
              <QrCode className="mr-2 h-4 w-4" />
              {qrCode.qr_token}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleGenerateQr}>
          <Plus className="mr-2 h-4 w-4" />
          Generuj nowy kod
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}