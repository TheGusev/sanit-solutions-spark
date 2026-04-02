import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Star, 
  BarChart3, 
  FlaskConical, 
  Settings, 
  LogOut,
  Menu,
  X,
  Beaker,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const navItems = [
  { path: '/admin', icon: ClipboardList, label: 'Заявки', end: true },
  { path: '/admin/test-leads', icon: Beaker, label: 'Тест-заявки' },
  { path: '/admin/reviews', icon: Star, label: 'Отзывы' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Аналитика' },
  { path: '/admin/mvt', icon: FlaskConical, label: 'A/B тесты' },
  { path: '/admin/settings', icon: Settings, label: 'Настройки' },
];

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isSupported, isSubscribed, subscribeToPush, isLoading: pushLoading } = usePushNotifications();

  useEffect(() => {
    if (isAuthenticated && isSupported && !isSubscribed && !localStorage.getItem('push_banner_dismissed')) {
      setShowPushBanner(true);
    }
  }, [isAuthenticated, isSupported, isSubscribed]);

  const handleEnablePush = async () => {
    const success = await subscribeToPush();
    if (success) {
      toast.success('Уведомления включены!');
      setShowPushBanner(false);
    } else {
      toast.error('Не удалось включить уведомления. Проверьте разрешения.');
    }
  };

  const handleDismissPushBanner = () => {
    setShowPushBanner(false);
    localStorage.setItem('push_banner_dismissed', 'true');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Check admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        toast.error('Нет прав доступа');
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Вы вышли из системы');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2 ml-3">
          <Beaker className="h-5 w-5 text-primary" />
          <span className="font-semibold">Админ-панель</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen bg-background border-r transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 px-6 h-16 border-b">
            <Beaker className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Админ-панель</span>
          </div>
          <div className="lg:hidden h-14" /> {/* Spacer for mobile header */}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Выйти
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        {showPushBanner && (
          <div className="mx-4 mt-4 lg:mx-6 lg:mt-6 flex items-center justify-between gap-3 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm dark:border-yellow-700 dark:bg-yellow-950">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-yellow-600 shrink-0" />
              <span className="text-yellow-800 dark:text-yellow-200">
                Включите уведомления, чтобы получать оповещения о новых заявках
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleEnablePush}
                disabled={pushLoading}
                className="bg-primary text-primary-foreground"
              >
                {pushLoading ? 'Подключение…' : 'Включить'}
              </Button>
              <button
                onClick={handleDismissPushBanner}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
