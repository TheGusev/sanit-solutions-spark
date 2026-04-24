import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bug, Rat, Microscope, Wind, Sparkles, AlertTriangle, Phone, Check, Loader2, ArrowLeft } from "lucide-react";
import { useTraffic } from "@/contexts/TrafficContext";
import { supabase } from "@/lib/supabaseClient";
import { trackGoal } from "@/lib/analytics";

// ─── Price mapping — single source of truth from services.ts pricing arrays ───
type ProblemKey = 'dezinsekciya' | 'deratizaciya' | 'dezinfekciya' | 'dezodoraciya' | 'ozonirovanie' | 'demerkurizaciya';

interface ObjectOption {
  label: string;
  key: string;
  /** If true, show room sub-step */
  hasRooms?: boolean;
}

interface RoomOption {
  label: string;
  key: string;
}

const ROOMS: RoomOption[] = [
  { label: "1-к квартира", key: "1k" },
  { label: "2-к квартира", key: "2k" },
  { label: "3-к квартира", key: "3k" },
];

const PROBLEMS: { key: ProblemKey; label: string; icon: typeof Bug }[] = [
  { key: "dezinsekciya", label: "Тараканы / Клопы / Насекомые", icon: Bug },
  { key: "deratizaciya", label: "Мыши / Крысы", icon: Rat },
  { key: "dezinfekciya", label: "Плесень / Вирусы / Бактерии", icon: Microscope },
  { key: "dezodoraciya", label: "Неприятные запахи", icon: Wind },
  { key: "ozonirovanie", label: "Озонирование", icon: Sparkles },
  { key: "demerkurizaciya", label: "Разбитый градусник", icon: AlertTriangle },
];

const OBJECTS_BY_PROBLEM: Record<ProblemKey, ObjectOption[]> = {
  dezinsekciya: [
    { label: "Квартира", key: "kvartira", hasRooms: true },
    { label: "Частный дом", key: "dom" },
    { label: "Офис / Ресторан", key: "office" },
  ],
  deratizaciya: [
    { label: "Квартира", key: "kvartira" },
    { label: "Частный дом", key: "dom" },
    { label: "Подвал / Чердак", key: "podval" },
    { label: "Склад / Производство", key: "sklad" },
    { label: "Ресторан / Кафе", key: "restoran" },
  ],
  dezinfekciya: [
    { label: "Квартира", key: "kvartira", hasRooms: true },
    { label: "Офис / Магазин", key: "office" },
  ],
  dezodoraciya: [
    { label: "Квартира", key: "kvartira", hasRooms: true },
    { label: "Частный дом", key: "dom" },
    { label: "Автомобиль", key: "auto" },
  ],
  ozonirovanie: [
    { label: "Квартира", key: "kvartira", hasRooms: true },
    { label: "Офис / Помещение", key: "office" },
    { label: "Автомобиль", key: "auto" },
  ],
  demerkurizaciya: [
    { label: "1 комната (до 20 м²)", key: "1room" },
    { label: "2 комнаты (до 40 м²)", key: "2rooms" },
    { label: "Квартира целиком (до 80 м²)", key: "full" },
    { label: "Офис / Предприятие (100+ м²)", key: "office" },
  ],
};

// Exact prices from services.ts pricing arrays (coldFog column)
const PRICE_MAP: Record<string, string> = {
  // Дезинсекция
  "dezinsekciya.kvartira.1k": "1 200 ₽",
  "dezinsekciya.kvartira.2k": "1 800 ₽",
  "dezinsekciya.kvartira.3k": "2 500 ₽",
  "dezinsekciya.dom": "3 500 ₽",
  "dezinsekciya.office": "3 000 ₽",
  // Дератизация
  "deratizaciya.kvartira": "1 400 ₽",
  "deratizaciya.dom": "3 000 ₽",
  "deratizaciya.podval": "2 500 ₽",
  "deratizaciya.sklad": "5 000 ₽",
  "deratizaciya.restoran": "4 000 ₽",
  // Дезинфекция
  "dezinfekciya.kvartira.1k": "1 000 ₽",
  "dezinfekciya.kvartira.2k": "1 500 ₽",
  "dezinfekciya.kvartira.3k": "2 000 ₽",
  "dezinfekciya.office": "2 500 ₽",
  // Дезодорация
  "dezodoraciya.kvartira.1k": "1 200 ₽",
  "dezodoraciya.kvartira.2k": "1 800 ₽",
  "dezodoraciya.kvartira.3k": "2 500 ₽",
  "dezodoraciya.dom": "4 000 ₽",
  "dezodoraciya.auto": "1 500 ₽",
  // Озонирование
  "ozonirovanie.kvartira.1k": "1 500 ₽",
  "ozonirovanie.kvartira.2k": "2 500 ₽",
  "ozonirovanie.kvartira.3k": "3 500 ₽",
  "ozonirovanie.office": "4 000 ₽",
  "ozonirovanie.auto": "1 500 ₽",
  // Демеркуризация
  "demerkurizaciya.1room": "3 000 ₽",
  "demerkurizaciya.2rooms": "4 500 ₽",
  "demerkurizaciya.full": "6 000 ₽",
  "demerkurizaciya.office": "от 60 ₽/м²",
};

const PROBLEM_LABELS: Record<ProblemKey, string> = {
  dezinsekciya: "Дезинсекция (насекомые)",
  deratizaciya: "Дератизация (грызуны)",
  dezinfekciya: "Дезинфекция (вирусы/плесень)",
  dezodoraciya: "Дезодорация (запахи)",
  ozonirovanie: "Озонирование",
  demerkurizaciya: "Демеркуризация (ртуть)",
};

function getPrice(problem: ProblemKey, objectKey: string, roomKey?: string): string | null {
  const key = roomKey
    ? `${problem}.${objectKey}.${roomKey}`
    : `${problem}.${objectKey}`;
  return PRICE_MAP[key] || null;
}

type Step = "problem" | "object" | "room" | "form";
type FormStatus = "idle" | "submitting" | "success" | "error";

interface SimpleCalculatorProps {
  isModal?: boolean;
}

const SimpleCalculator = ({ isModal = false }: SimpleCalculatorProps) => {
  const { context } = useTraffic();

  const [step, setStep] = useState<Step>("problem");
  const [problem, setProblem] = useState<ProblemKey | null>(null);
  const [object, setObject] = useState<ObjectOption | null>(null);
  const [room, setRoom] = useState<RoomOption | null>(null);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const interactFired = useRef(false);

  const price = problem && object
    ? getPrice(problem, object.key, room?.key)
    : null;

  const resetTo = useCallback((target: Step) => {
    if (target === "problem") {
      setProblem(null);
      setObject(null);
      setRoom(null);
    } else if (target === "object") {
      setObject(null);
      setRoom(null);
    } else if (target === "room") {
      setRoom(null);
    }
    setStep(target);
  }, []);

  const handleProblemSelect = (key: ProblemKey) => {
    if (!interactFired.current) {
      interactFired.current = true;
      trackGoal("calc_interact");
    }
    setProblem(key);
    setObject(null);
    setRoom(null);
    setStep("object");
  };

  const handleObjectSelect = (obj: ObjectOption) => {
    setObject(obj);
    setRoom(null);
    if (obj.hasRooms) {
      setStep("room");
    } else {
      trackGoal("calc_price_view");
      setStep("form");
    }
  };

  const handleRoomSelect = (r: RoomOption) => {
    setRoom(r);
    trackGoal("calc_price_view");
    setStep("form");
  };

  const handleSubmit = async () => {
    // Hard guard: prevent double-submit even if button click fires twice before disabled state propagates
    if (formStatus === "submitting") return;
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Введите корректный номер телефона");
      return;
    }
    if (!consent) {
      setErrorMsg("Необходимо согласие на обработку данных");
      return;
    }
    if (!problem || !object || !price) return;

    setFormStatus("submitting");
    setErrorMsg("");

    const leadData = {
      name: "Калькулятор",
      phone: phone.trim(),
      service: problem,
      object_type: object.label,
      method: room ? room.label : undefined,
      final_price: price ? parseFloat(price.replace(/[^\d]/g, "")) || 0 : 0,
      source: "calculator_v2",
      last_page_url: typeof window !== "undefined" ? window.location.href : "",
      session_id: context?.sessionId || undefined,
      intent: context?.intent || "default",
      variant_id: context?.variantId || undefined,
      utm_source: context?.utm_source || undefined,
      utm_medium: context?.utm_medium || undefined,
      utm_campaign: context?.utm_campaign || undefined,
      utm_content: context?.utm_content || undefined,
      utm_term: context?.utm_term || undefined,
      device_type: context?.deviceType || undefined,
    };

    // Safety: hard timeout so the button never hangs in "submitting" forever
    const submitTimeout = setTimeout(() => {
      setErrorMsg("Сервер не отвечает. Позвоните: 8-495-018-18-17");
      setFormStatus("error");
    }, 15000);

    // Direct fetch fallback — used if supabase-js client failed to load
    // (happens on iOS Safari with flaky network or unsupported top-level await chunks).
    const sendDirect = async (): Promise<{ success: boolean; lead_id?: string; error?: string }> => {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
      const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/handle-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify(leadData),
      });
      if (!resp.ok) {
        return { success: false, error: `HTTP ${resp.status}` };
      }
      return await resp.json();
    };

    try {
      let result: { success?: boolean; lead_id?: string; error?: string } | null = null;

      // Try supabase-js client first (preferred path)
      if (supabase?.functions?.invoke) {
        try {
          const { data, error } = await supabase.functions.invoke("handle-lead", {
            body: leadData,
          });
          if (error) throw error;
          result = data;
        } catch (sdkErr) {
          console.warn("supabase.functions.invoke failed, falling back to fetch:", sdkErr);
          result = await sendDirect();
        }
      } else {
        // SDK not initialized → go direct
        result = await sendDirect();
      }

      if (!result || result.success === false) {
        throw new Error(result?.error || "Ошибка отправки");
      }

      trackGoal("lead_submit", { source: "calculator_v2", price });
      setFormStatus("success");
    } catch (err) {
      console.error("Lead submit error:", err);
      setErrorMsg("Не удалось отправить заявку. Попробуйте позже или позвоните: 8-495-018-18-17");
      setFormStatus("error");
    } finally {
      clearTimeout(submitTimeout);
    }
  };

  if (formStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Заявка отправлена!</h3>
        <p className="text-muted-foreground max-w-sm">
          Мы перезвоним вам в течение 15 минут для уточнения деталей.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {problem && step !== "problem" && (
          <button onClick={() => resetTo("problem")} className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        )}
      </div>

      {/* STEP 1: Problem */}
      {step === "problem" && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Какая проблема?</h3>
          <div className="grid grid-cols-1 gap-2">
            {PROBLEMS.map((p) => (
              <button
                key={p.key}
                onClick={() => handleProblemSelect(p.key)}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left min-h-[52px]"
              >
                <p.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Object */}
      {step === "object" && problem && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{PROBLEM_LABELS[problem]}</p>
          <h3 className="text-lg font-semibold text-foreground">Что обрабатываем?</h3>
          <div className="grid grid-cols-1 gap-2">
            {OBJECTS_BY_PROBLEM[problem].map((obj) => (
              <button
                key={obj.key}
                onClick={() => handleObjectSelect(obj)}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left min-h-[52px]"
              >
                <span className="text-sm font-medium text-foreground">{obj.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Room count (only for apartments) */}
      {step === "room" && problem && object && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{PROBLEM_LABELS[problem]} → {object.label}</p>
          <h3 className="text-lg font-semibold text-foreground">Тип квартиры</h3>
          <div className="grid grid-cols-1 gap-2">
            {ROOMS.map((r) => (
              <button
                key={r.key}
                onClick={() => handleRoomSelect(r)}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left min-h-[52px]"
              >
                <span className="text-sm font-medium text-foreground">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Price + Lead form */}
      {step === "form" && problem && object && price && (
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              {PROBLEM_LABELS[problem]} → {object.label}{room ? ` → ${room.label}` : ""}
            </p>
            <div className="text-3xl font-bold text-primary">от {price}</div>
            <p className="text-xs text-muted-foreground">Точную стоимость рассчитает специалист</p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMsg("");
                }}
                className="pl-10 h-12 text-base"
                autoComplete="tel"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={consent}
                onCheckedChange={(v) => {
                  setConsent(v === true);
                  setErrorMsg("");
                }}
                className="mt-0.5"
              />
              <span className="text-xs text-muted-foreground leading-tight">
                Согласен на{" "}
                <a href="/privacy/" target="_blank" className="underline hover:text-foreground">
                  обработку персональных данных
                </a>
              </span>
            </label>

            {errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={formStatus === "submitting"}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {formStatus === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                "Вызвать мастера"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCalculator;
