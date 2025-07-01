'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  QrCode, 
  Search, 
  MapPin, 
  User, 
  Calendar,
  Eye,
  Copy,
  Link,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  getAllQrCodes, 
  getAssignedQrCodes, 
  getUnassignedQrCodes 
} from '@/lib/mock/qr-codes';
import { getQrCodeUrl } from '@/lib/qr/utils';
import { getCurrentUser, mockUsers } from '@/lib/mock/organization';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

type FilterType = 'all' | 'assigned' | 'unassigned';

export function QrCodeHistory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState<FilterType>('all');

  const currentUser = getCurrentUser();
  const allCodes = getAllQrCodes();

  const filteredCodes = React.useMemo(() => {
    let codes = allCodes;

    // Filter by type
    if (filterType === 'assigned') {
      codes = getAssignedQrCodes();
    } else if (filterType === 'unassigned') {
      codes = getUnassignedQrCodes();
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      codes = codes.filter(code =>
        code.qr_token.toLowerCase().includes(query)
      );
    }

    return codes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [allCodes, filterType, searchQuery]);

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

  const getUserName = (userId: string) => {
    if (userId === currentUser.id) return 'Ty';
    const user = mockUsers.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Nieznany użytkownik';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filtry i wyszukiwanie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj po tokenie QR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie kody</SelectItem>
                    <SelectItem value="assigned">Przypisane</SelectItem>
                    <SelectItem value="unassigned">Nieprzypisane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                >
                  Wyczyść filtry
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Znaleziono {filteredCodes.length} kodów z {allCodes.length} łącznie
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Codes Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Historia kodów QR ({filteredCodes.length})
            </CardTitle>
            <CardDescription>
              Wszystkie wygenerowane kody QR w systemie
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCodes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token QR</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokalizacja</TableHead>
                    <TableHead>Utworzony przez</TableHead>
                    <TableHead>Data utworzenia</TableHead>
                    <TableHead className="w-[150px]">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.map((code) => (
                    <TableRow key={code.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {code.qr_token}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {code.entity_id ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Badge variant="default">Przypisany</Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <Badge variant="secondary">Nieprzypisany</Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {code.entity_id ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Lokalizacja przypisana</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Brak przypisania</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{getUserName(code.created_by)}</span>
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
                            title="Kopiuj token"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(code.qr_token)}
                            title="Kopiuj URL"
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/qr/${code.qr_token}`, '_blank')}
                            title="Otwórz QR"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || filterType !== 'all' ? 'Brak wyników' : 'Brak kodów QR'}
                </h3>
                <p>
                  {searchQuery || filterType !== 'all'
                    ? 'Nie znaleziono kodów QR pasujących do wybranych filtrów.'
                    : 'Nie wygenerowano jeszcze żadnych kodów QR.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}