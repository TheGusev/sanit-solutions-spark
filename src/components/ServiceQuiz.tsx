import { useState, useMemo } from 'react';
import { Phone, ChevronLeft, ChevronRight, Send, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useTraffic } from '@/contexts/TrafficContext';
import { trackGoal, getYmGoalPrefix } from '@/lib/analytics';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';

function pluralizeQuestion(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'вопрос';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'вопроса';
  return 'вопросов';
}

interface QuizStep {
  question: string;
  options: string[];
}

interface ServiceQuizProps {
  steps: QuizStep[];
  serviceSlug: string;
  serviceTitle: string;
}

const formatPhone = (value: string) => {
  let phone = value.replace(/\D/g, '');
  if (!phone.startsWith('7')) phone = '7' + phone;
  let formatted = '+7';
  if (phone.length > 1) formatted += ` (${phone.substring(1, 4)}`;
  if (phone.length > 4) formatted += `) ${phone.substring(4, 7)}`;
  if (phone.length > 7) formatted += `-${phone.substring(7, 9)}`;
  if (phone.length > 9) formatted += `-${phone.substring(9, 11)}`;
  return formatted;
};

export default function ServiceQuiz({ steps, serviceSlug, serviceTitle }: ServiceQuizProps) {
  const { context } = useTraffic();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [phone, setPhone] = useState('+7');
  const [comment, setComment] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = steps.length + 1; // quiz steps + final form
  const isLastStep = currentStep === steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleOptionSelect = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = option;
    setAnswers(newAnswers);

    // Auto-advance after selection
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error('Согласитесь с политикой конфиденциальности');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) {
      toast.error('Введите корректный номер телефона');
      return;
    }

    setIsSubmitting(true);

    const quizSummary = steps
      .map((step, i) => `${step.question}: ${answers[i] || '—'}`)
      .join('\n');

    try {
      const { data, error } = await supabase.functions.invoke('handle-lead', {
        body: {
          name: 'Квиз-заявка',
          phone,
          source: 'quiz',
          service: serviceSlug,
          session_id: context?.sessionId || null,
          intent: context?.intent || 'default',
          variant_id: context?.variantId || null,
          device_type: context?.deviceType || null,
          last_page_url: window.location.href,
          utm_source: context?.utm_source || null,
          utm_medium: context?.utm_medium || null,
          utm_campaign: context?.utm_campaign || null,
          utm_content: context?.utm_content || null,
          utm_term: context?.utm_term || null,
          comment: `${quizSummary}${comment ? `\nКомментарий: ${comment}` : ''}`,
        },
      });

      if (error || !data?.success) {
        throw error || new Error('Failed');
      }

      const prefix = getYmGoalPrefix();
      const quizSource = sessionStorage.getItem('quiz_source');
      if (quizSource === 'sticky_bar') {
        trackGoal(`sticky_quiz_lead_${prefix}`, { intent: context?.intent, service: serviceSlug });
        sessionStorage.removeItem('quiz_source');
      } else {
        trackGoal(`quiz_lead_${prefix}`, { intent: context?.intent, service: serviceSlug });
      }

      toast.success('✅ Заявка отправлена! Перезвоним в течение 15 минут');
      setCurrentStep(0);
      setAnswers([]);
      setPhone('+7');
      setComment('');
      setAgreed(false);
    } catch {
      toast.error('Ошибка отправки. Позвоните: 8-495-018-18-17');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quiz" className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Рассчитать стоимость
          </h2>
          <div className="tricolor-underline mx-auto mb-4">
            <span /><span /><span />
          </div>
          <p className="text-muted-foreground text-lg">
            Ответьте на {steps.length} {pluralizeQuestion(steps.length)} и получите расчёт
          </p>
        </AnimatedSection>

        <div className="max-w-xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Шаг {currentStep + 1} из {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 min-h-[320px] flex flex-col">
            {!isLastStep ? (
              /* Quiz question step */
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold mb-6">
                  {steps[currentStep].question}
                </h3>

                <div className="flex-1 grid gap-3">
                  {steps[currentStep].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all text-base font-medium min-h-[48px] ${
                        answers[currentStep] === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mt-4 self-start h-12"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Назад
                  </Button>
                )}
              </div>
            ) : (
              /* Final form step */
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Почти готово!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Оставьте телефон — рассчитаем стоимость и перезвоним
                </p>

                {/* Summary of answers */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm space-y-1">
                  {steps.map((step, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="text-muted-foreground truncate">{step.question}</span>
                      <span className="font-medium text-foreground whitespace-nowrap">{answers[i] || '—'}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 flex-1">
                  <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="h-12 text-base"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Комментарий (необязательно)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="h-12 text-base"
                  />

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="quiz-agree"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="quiz-agree" className="text-xs text-muted-foreground leading-tight">
                      Согласен с{' '}
                      <Link to="/privacy" className="underline hover:text-foreground">
                        политикой конфиденциальности
                      </Link>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-12"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Назад
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !agreed}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
