'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, MapPin, Tag, History } from 'lucide-react';
import { QrCodeGenerator } from '@/components/qr/qr-code-generator';
import { QrCodeHistory } from '@/components/qr/qr-code-history';

export default function LocationLabelsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Etykiety lokalizacji</h1>
          <p className="text-muted-foreground">
            Zarządzanie kodami QR i etykietami dla lokalizacji magazynowych
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="qr-generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qr-generator" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Generuj kody QR
            </TabsTrigger>
            <TabsTrigger value="qr-history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historia kodów
            </TabsTrigger>
            <TabsTrigger value="label-templates" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Szablony etykiet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-generator" className="space-y-6">
            <QrCodeGenerator />
          </TabsContent>

          <TabsContent value="qr-history" className="space-y-6">
            <QrCodeHistory />
          </TabsContent>

          <TabsContent value="label-templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Szablony etykiet
                </CardTitle>
                <CardDescription>
                  Zarządzanie szablonami etykiet dla lokalizacji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Moduł w budowie</h3>
                  <p>Funkcjonalności szablonów etykiet będą dostępne wkrótce.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}