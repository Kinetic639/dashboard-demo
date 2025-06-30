'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotificationsStore } from '@/lib/stores/notifications-store';
import {
  Check,
  X,
  Mail,
  MailOpen,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const notificationColors = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

export function NotificationsDrawer() {
  const router = useRouter();
  const {
    notifications,
    isDrawerOpen,
    closeDrawer,
    markAsRead,
    markAsUnread,
    discardNotification,
  } = useNotificationsStore();

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      closeDrawer();
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleMarkAsUnread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsUnread(id);
  };

  const handleDiscard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    discardNotification(id);
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Powiadomienia</SheetTitle>
          <SheetDescription>
            Zarządzaj swoimi powiadomieniami
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const iconColor = notificationColors[notification.type];
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50',
                      !notification.read && 'bg-muted/20 border-primary/20'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('mt-0.5', iconColor)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            'text-sm font-medium',
                            !notification.read && 'font-semibold'
                          )}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-primary" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.timestamp), {
                              addSuffix: true,
                              locale: pl,
                            })}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            {notification.read ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => handleMarkAsUnread(e, notification.id)}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => handleMarkAsRead(e, notification.id)}
                              >
                                <MailOpen className="h-3 w-3" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => handleDiscard(e, notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {notifications.length === 0 && (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Brak powiadomień</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}