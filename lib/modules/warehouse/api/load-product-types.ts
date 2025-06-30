import { Tables } from '@/lib/types';

// Mock function - in real app this would fetch from database
export async function loadProductTypes(orgId: string): Promise<Tables<'product_types'>[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    {
      id: '1',
      name: 'Lakiery',
      slug: 'lakiery',
      icon: 'Palette',
      organization_id: orgId,
      created_at: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Narzędzia',
      slug: 'narzedzia',
      icon: 'Wrench',
      organization_id: orgId,
      created_at: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'Materiały ścierne',
      slug: 'materialy-scierne',
      icon: 'Disc',
      organization_id: orgId,
      created_at: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '4',
      name: 'Chemia',
      slug: 'chemia',
      icon: 'Flask',
      organization_id: orgId,
      created_at: '2024-01-01T00:00:00.000Z',
    },
  ];
}