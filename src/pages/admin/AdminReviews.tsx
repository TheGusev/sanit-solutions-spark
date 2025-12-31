import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Star, 
  Loader2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Review {
  id: string;
  display_name: string;
  rating: number;
  text: string;
  object_type: string | null;
  is_approved: boolean | null;
  is_rejected: boolean | null;
  created_at: string | null;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast.error('Ошибка загрузки отзывов');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          is_approved: true, 
          is_rejected: false,
          approved_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, is_approved: true, is_rejected: false } : r
      ));
      toast.success('Отзыв одобрен');
    } catch (error: any) {
      toast.error('Ошибка одобрения');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectReview = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: false, is_rejected: true })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, is_approved: false, is_rejected: true } : r
      ));
      toast.success('Отзыв отклонён');
    } catch (error: any) {
      toast.error('Ошибка отклонения');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Удалить этот отзыв?')) return;

    setActionLoading(reviewId);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success('Отзыв удалён');
    } catch (error: any) {
      toast.error('Ошибка удаления');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingReviews = reviews.filter(r => !r.is_approved && !r.is_rejected);
  const approvedReviews = reviews.filter(r => r.is_approved);
  const rejectedReviews = reviews.filter(r => r.is_rejected);

  const renderReviewCard = (review: Review, showActions: boolean = true) => (
    <Card key={review.id}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {review.display_name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-base">{review.display_name}</CardTitle>
              {review.object_type && (
                <p className="text-sm text-muted-foreground">{review.object_type}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{review.text}</p>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {review.created_at && format(new Date(review.created_at), 'd MMMM yyyy', { locale: ru })}
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2">
              {!review.is_approved && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => approveReview(review.id)}
                  disabled={actionLoading === review.id}
                >
                  {actionLoading === review.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Одобрить
                    </>
                  )}
                </Button>
              )}
              {!review.is_rejected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => rejectReview(review.id)}
                  disabled={actionLoading === review.id}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Отклонить
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteReview(review.id)}
                disabled={actionLoading === review.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Отзывы</h1>
          <p className="text-muted-foreground">Модерация отзывов клиентов</p>
        </div>
        <Button variant="outline" onClick={fetchReviews} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingReviews.length}</div>
            <p className="text-sm text-muted-foreground">Ожидают</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{approvedReviews.length}</div>
            <p className="text-sm text-muted-foreground">Одобрено</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{rejectedReviews.length}</div>
            <p className="text-sm text-muted-foreground">Отклонено</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            На модерации
            {pendingReviews.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingReviews.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Одобренные</TabsTrigger>
          <TabsTrigger value="rejected">Отклонённые</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="pending" className="space-y-4 mt-4">
              {pendingReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Нет отзывов на модерации
                  </CardContent>
                </Card>
              ) : (
                pendingReviews.map(review => renderReviewCard(review))
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-4">
              {approvedReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Нет одобренных отзывов
                  </CardContent>
                </Card>
              ) : (
                approvedReviews.map(review => renderReviewCard(review))
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-4">
              {rejectedReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Нет отклонённых отзывов
                  </CardContent>
                </Card>
              ) : (
                rejectedReviews.map(review => renderReviewCard(review))
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default AdminReviews;
