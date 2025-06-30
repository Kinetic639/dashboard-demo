'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Building2, 
  Upload, 
  Save, 
  Globe, 
  Palette,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { mockOrganization, mockOrganizationProfile } from '@/lib/mock/organization';
import { useToast } from '@/hooks/use-toast';

const organizationSchema = z.object({
  name: z.string().min(1, 'Nazwa organizacji jest wymagana'),
  name_2: z.string().optional(),
  slug: z.string().min(1, 'Slug jest wymagany').regex(/^[a-z0-9-]+$/, 'Slug może zawierać tylko małe litery, cyfry i myślniki'),
  bio: z.string().max(500, 'Opis może mieć maksymalnie 500 znaków').optional(),
  website: z.string().url('Nieprawidłowy URL').optional().or(z.literal('')),
  logo_url: z.string().url('Nieprawidłowy URL').optional().or(z.literal('')),
  theme_color: z.string().min(1, 'Kolor motywu jest wymagany'),
  font_color: z.string().min(1, 'Kolor czcionki jest wymagany'),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

export default function OrganizationProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: mockOrganization.name,
      name_2: mockOrganization.name_2 || '',
      slug: mockOrganization.slug || '',
      bio: mockOrganizationProfile.bio || '',
      website: mockOrganizationProfile.website || '',
      logo_url: mockOrganizationProfile.logo_url || '',
      theme_color: mockOrganizationProfile.theme_color || '#1e40af',
      font_color: mockOrganizationProfile.font_color || '#1f2937',
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Profil zaktualizowany',
      description: 'Informacje o organizacji zostały pomyślnie zaktualizowane.',
    });
    
    setIsLoading(false);
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Profil organizacji</h1>
        <p className="text-muted-foreground">
          Zarządzaj podstawowymi informacjami o organizacji, logo i kolorami motywu
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informacje podstawowe
              </CardTitle>
              <CardDescription>
                Podstawowe informacje o organizacji widoczne dla wszystkich użytkowników
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa organizacji *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nazwa organizacji" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name_2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa alternatywna</FormLabel>
                          <FormControl>
                            <Input placeholder="Pełna nazwa prawna" {...field} />
                          </FormControl>
                          <FormDescription>
                            Opcjonalna pełna nazwa prawna
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug organizacji *</FormLabel>
                        <FormControl>
                          <Input placeholder="nazwa-organizacji" {...field} />
                        </FormControl>
                        <FormDescription>
                          Unikalny identyfikator używany w URL (tylko małe litery, cyfry i myślniki)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opis organizacji</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Krótki opis działalności organizacji..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Maksymalnie 500 znaków
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strona internetowa</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL logo</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="https://example.com/logo.png" 
                              {...field} 
                            />
                            <Button type="button" variant="outline" size="icon">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          URL do logo organizacji (zalecany rozmiar: 200x200px)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="theme_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kolor motywu *</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="color" 
                                className="w-16 h-10 p-1 border rounded"
                                {...field}
                              />
                              <Input 
                                placeholder="#1e40af" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Główny kolor motywu organizacji
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="font_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kolor czcionki *</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="color" 
                                className="w-16 h-10 p-1 border rounded"
                                {...field}
                              />
                              <Input 
                                placeholder="#1f2937" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Kolor tekstu w interfejsie
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Podgląd
              </CardTitle>
              <CardDescription>
                Tak będzie wyglądać profil organizacji
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Preview */}
              <div className="text-center">
                {watchedValues.logo_url ? (
                  <img 
                    src={watchedValues.logo_url} 
                    alt="Logo organizacji"
                    className="w-20 h-20 mx-auto rounded-lg object-cover border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Organization Info */}
              <div className="text-center space-y-2">
                <h3 
                  className="text-xl font-bold"
                  style={{ color: watchedValues.font_color }}
                >
                  {watchedValues.name || 'Nazwa organizacji'}
                </h3>
                {watchedValues.name_2 && (
                  <p className="text-sm text-muted-foreground">
                    {watchedValues.name_2}
                  </p>
                )}
                {watchedValues.slug && (
                  <p className="text-xs text-muted-foreground font-mono">
                    /{watchedValues.slug}
                  </p>
                )}
              </div>

              {/* Bio */}
              {watchedValues.bio && (
                <div className="text-sm text-muted-foreground text-center">
                  {watchedValues.bio}
                </div>
              )}

              {/* Website */}
              {watchedValues.website && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={watchedValues.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {watchedValues.website}
                  </a>
                </div>
              )}

              {/* Theme Colors */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Kolory motywu:</div>
                <div className="flex gap-2">
                  <div className="flex-1 text-center">
                    <div 
                      className="w-full h-8 rounded border"
                      style={{ backgroundColor: watchedValues.theme_color }}
                    />
                    <div className="text-xs text-muted-foreground mt-1">Motyw</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div 
                      className="w-full h-8 rounded border"
                      style={{ backgroundColor: watchedValues.font_color }}
                    />
                    <div className="text-xs text-muted-foreground mt-1">Czcionka</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}