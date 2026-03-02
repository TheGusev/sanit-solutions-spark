import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'code' | 'form' | 'success';

const ReviewFormModal = ({ isOpen, onClose }: ReviewFormModalProps) => {
  const [step, setStep] = useState<Step>('code');
  const [isLoading, setIsLoading] = useState(false);
  
  // Code step
  const [code, setCode] = useState('');
  const [leadData, setLeadData] = useState<{ lead_id: string; name: string; object_type: string | null } | null>(null);
  
  // Form step
  const [displayName, setDisplayName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleClose = () => {
    setStep('code');
    setCode('');
    setLeadData(null);
    setDisplayName('');
    setRating(5);
    setText('');
    onClose();
  };

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Код должен содержать 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-review-code', {
        body: { code }
      });

      if (error) throw error;

      if (!data.valid) {
        toast.error(data.error || 'Недействительный код');
        return;
      }

      setLeadData(data);
      setDisplayName(data.name?.split(' ')[0] || '');
      setStep('form');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка проверки кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast.error('Введите ваше имя');
      return;
    }
    if (text.trim().length < 10) {
      toast.error('Отзыв должен содержать минимум 10 символов');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-review', {
        body: { 
          code,
          display_name: displayName,
          rating,
          text
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setStep('success');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка отправки отзыва');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'code' && (
          <>
            <DialogHeader>
              <DialogTitle>Оставить отзыв</DialogTitle>
              <DialogDescription>
                Введите 6-значный код, который вы получили после выполнения заказа
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleValidateCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код для отзыва</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="XXXXXX"
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Проверка...
                  </>
                ) : (
                  'Продолжить'
                )}
              </Button>
            </form>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Ваш отзыв</DialogTitle>
              <DialogDescription>
                {leadData?.object_type && `Услуга: ${leadData.object_type}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Ваше имя</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Как вас представить?"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Оценка</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                      disabled={isLoading}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Ваш отзыв</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Расскажите о вашем опыте..."
                  rows={4}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  {text.length}/1000 символов
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('code')}
                  disabled={isLoading}
                >
                  Назад
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    'Отправить отзыв'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Спасибо за отзыв!</h3>
              <p className="text-muted-foreground mt-1">
                Ваш отзыв отправлен на модерацию и появится на сайте после проверки.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewFormModal;
