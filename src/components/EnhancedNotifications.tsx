// ============= FASE 3.2: COMPONENTE DE NOTIFICACIONES MEJORADO =============

import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedError, EnhancedErrorHandler } from '@/utils/enhancedErrorHandling';

export interface NotificationConfig {
  id?: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'loading';
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  onDismiss?: () => void;
  showProgress?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline';
}

interface ActiveNotification extends NotificationConfig {
  id: string;
  createdAt: Date;
  timeRemaining?: number;
}

const NOTIFICATION_ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  loading: Loader2
};

const NOTIFICATION_STYLES = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-green-200 bg-green-50 text-green-900',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  loading: 'border-gray-200 bg-gray-50 text-gray-900'
};

export class NotificationManager {
  private static notifications: ActiveNotification[] = [];
  private static listeners: Array<(notifications: ActiveNotification[]) => void> = [];
  private static nextId = 1;

  static show(config: NotificationConfig): string {
    const id = config.id || `notification_${this.nextId++}`;
    const duration = config.persistent ? undefined : (config.duration || 5000);
    
    const notification: ActiveNotification = {
      ...config,
      id,
      createdAt: new Date(),
      timeRemaining: duration
    };

    this.notifications.push(notification);
    this.notifyListeners();

    // Auto-dismiss if not persistent
    if (duration) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  static dismiss(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification?.onDismiss) {
      notification.onDismiss();
    }
    
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  static dismissAll() {
    this.notifications.forEach(n => {
      if (n.onDismiss) n.onDismiss();
    });
    this.notifications = [];
    this.notifyListeners();
  }

  static update(id: string, updates: Partial<NotificationConfig>) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], ...updates };
      this.notifyListeners();
    }
  }

  static subscribe(callback: (notifications: ActiveNotification[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  static getNotifications(): ActiveNotification[] {
    return [...this.notifications];
  }

  // Métodos de conveniencia
  static success(title: string, description: string, actions?: NotificationAction[]) {
    return this.show({
      title,
      description,
      type: 'success',
      actions
    });
  }

  static error(title: string, description: string, actions?: NotificationAction[]) {
    return this.show({
      title,
      description,
      type: 'error',
      persistent: true,
      actions
    });
  }

  static warning(title: string, description: string, actions?: NotificationAction[]) {
    return this.show({
      title,
      description,
      type: 'warning',
      duration: 8000,
      actions
    });
  }

  static info(title: string, description: string, actions?: NotificationAction[]) {
    return this.show({
      title,
      description,
      type: 'info',
      actions
    });
  }

  static loading(title: string, description: string, id?: string) {
    return this.show({
      id,
      title,
      description,
      type: 'loading',
      persistent: true
    });
  }

  // Manejo de errores mejorados
  static fromEnhancedError(error: EnhancedError) {
    const actions: NotificationAction[] = [];

    // Agregar acciones sugeridas
    if (error.userActions) {
      error.userActions.slice(0, 2).forEach(actionText => {
        actions.push({
          label: actionText,
          action: () => {
            // Aquí podrías implementar acciones específicas
            console.log(`User action: ${actionText}`);
          },
          variant: 'outline'
        });
      });
    }

    const type = error.severity === 'critical' ? 'error' : 
                 error.severity === 'high' ? 'error' :
                 error.severity === 'medium' ? 'warning' : 'info';

    return this.show({
      title: `Error: ${error.context}`,
      description: error.message,
      type,
      persistent: error.severity === 'critical' || error.severity === 'high',
      actions
    });
  }
}

// Hook para usar notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);

  useEffect(() => {
    const unsubscribe = NotificationManager.subscribe(setNotifications);
    setNotifications(NotificationManager.getNotifications());
    return unsubscribe;
  }, []);

  return {
    notifications,
    show: NotificationManager.show,
    dismiss: NotificationManager.dismiss,
    dismissAll: NotificationManager.dismissAll,
    update: NotificationManager.update,
    success: NotificationManager.success,
    error: NotificationManager.error,
    warning: NotificationManager.warning,
    info: NotificationManager.info,
    loading: NotificationManager.loading
  };
}

// Componente de notificación individual
function NotificationItem({ notification }: { notification: ActiveNotification }) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      NotificationManager.dismiss(notification.id);
    }, 200);
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 transform',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        NOTIFICATION_STYLES[notification.type],
        'shadow-lg border-l-4'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Icon 
            className={cn(
              'w-5 h-5 flex-shrink-0 mt-0.5',
              notification.type === 'loading' && 'animate-spin'
            )} 
          />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-1">
              {notification.title}
            </h4>
            <p className="text-sm opacity-90">
              {notification.description}
            </p>
            
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {notification.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.variant || 'outline'}
                    onClick={action.action}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {!notification.persistent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 h-6 w-6 p-0 opacity-60 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {notification.showProgress && notification.timeRemaining && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-current h-1 rounded-full transition-all duration-100"
                style={{ 
                  width: `${(notification.timeRemaining / (notification.duration || 5000)) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente contenedor de notificaciones
export function NotificationContainer() {
  const { notifications } = useNotifications();

  // Configurar manejo automático de errores mejorados
  useEffect(() => {
    const handleEnhancedError = (error: EnhancedError) => {
      NotificationManager.fromEnhancedError(error);
    };

    EnhancedErrorHandler.onError(handleEnhancedError);
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
      
      {notifications.length > 1 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={NotificationManager.dismissAll}
            className="text-xs"
          >
            Dismiss All
          </Button>
        </div>
      )}
    </div>
  );
}