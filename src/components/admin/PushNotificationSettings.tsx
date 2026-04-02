import { Bell, BellOff, Send, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

const PushNotificationSettings = () => {
  const {
    isSupported,
    isSubscribed,
    isPWA,
    isLoading,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestPush,
  } = usePushNotifications();

  const handleSubscribe = async () => {
    const success = await subscribeToPush();
    if (success) {
      toast.success('🔔 Уведомления включены!');
    } else {
      toast.error('Не удалось включить уведомления. Проверьте разрешения браузера.');
    }
  };

  const handleUnsubscribe = async () => {
    await unsubscribeFromPush();
    toast.success('Уведомления отключены');
  };

  const handleTest = async () => {
    const success = await sendTestPush();
    if (success) {
      toast.success('Тестовое уведомление отправлено');
    } else {
      toast.error('Ошибка отправки тестового уведомления');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push-уведомления о заявках
        </CardTitle>
        <CardDescription>
          Получайте мгновенные уведомления при поступлении новых заявок
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PWA warning */}
        {!isPWA && isSupported && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Smartphone className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Для iPhone: установите PWA
              </p>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                Откройте сайт в Safari → Поделиться → «На экран Домой». 
                Push-уведомления на iOS работают только из установленного PWA.
              </p>
            </div>
          </div>
        )}

        {/* Not supported */}
        {!isSupported && (
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div className="text-sm text-red-700 dark:text-red-300">
              Push-уведомления не поддерживаются в этом браузере.
              Используйте Chrome, Safari (PWA) или Firefox.
            </div>
          </div>
        )}

        {/* Subscription status */}
        {isSupported && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {isSubscribed ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Уведомления включены</p>
                    <p className="text-sm text-muted-foreground">
                      Вы получите push при новой заявке
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Уведомления отключены</p>
                    <p className="text-sm text-muted-foreground">
                      Включите, чтобы не пропускать заявки
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isSubscribed ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTest}
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Тест
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnsubscribe}
                    disabled={isLoading}
                  >
                    Отключить
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="bg-primary"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Включить уведомления
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationSettings;
