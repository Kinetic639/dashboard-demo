'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupplierNames } from '@/lib/mock/products';

interface ProductCardProps {
  product: any;
  onClick?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={() => onClick?.(product.id)}
        className={cn(
          'group h-full flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer',
          'rounded-xl border border-muted bg-background'
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold truncate group-hover:text-primary">
                {product.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {product.sku && (
                  <Badge variant="outline" className="text-xs">
                    {product.sku}
                  </Badge>
                )}
                <Badge
                  variant={product.isAvailable ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {product.totalQuantity} {product.default_unit}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant={product.productType === 'variant' ? 'secondary' : 'outline'}>
                {product.productType === 'variant' ? 'Wariant' : 'Prosty'}
              </Badge>
              {product.isAvailable ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground line-clamp-2">{product.description}</p>

          {product.inventory && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cena zakupu:</span>
              <span className="font-medium">{product.inventory.purchase_price.toFixed(2)} zł</span>
            </div>
          )}

          {product.inventory?.supplier_ids && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-3 w-3" />
              <span className="truncate">
                {getSupplierNames(product.inventory.supplier_ids).slice(0, 2).join(', ')}
                {product.inventory.supplier_ids.length > 2 &&
                  ` +${product.inventory.supplier_ids.length - 2}`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
