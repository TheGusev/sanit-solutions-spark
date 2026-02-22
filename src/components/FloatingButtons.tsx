import { useState } from "react";
import { Phone } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

const FloatingButtons = () => {
  const { context } = useTraffic();
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);
  const [showTelegramTooltip, setShowTelegramTooltip] = useState(false);

  const handlePhoneClick = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      variant: context?.variantId
    });
    
    window.location.href = "tel:84950181817";
  };

  const handleTelegramClick = () => {
    trackGoal('telegram_click', {
      intent: context?.intent,
      variant: context?.variantId
    });
    
    window.open("https://t.me/one_help", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5">
      {/* Phone Button */}
      <div className="relative">
        <button
          onClick={handlePhoneClick}
          onMouseEnter={() => setShowPhoneTooltip(true)}
          onMouseLeave={() => setShowPhoneTooltip(false)}
          className="w-14 h-14 md:w-14 md:h-14 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:ring-2 hover:ring-russia-red hover:ring-offset-2 animate-pulse-attention"
          aria-label="Позвонить"
        >
          <Phone className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        {showPhoneTooltip && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-fade-in">
            Позвонить
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-foreground"></div>
          </div>
        )}
      </div>

      {/* Telegram Button */}
      <div className="relative">
        <button
          onClick={handleTelegramClick}
          onMouseEnter={() => setShowTelegramTooltip(true)}
          onMouseLeave={() => setShowTelegramTooltip(false)}
          className="w-14 h-14 md:w-14 md:h-14 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:ring-2 hover:ring-russia-red hover:ring-offset-2"
          aria-label="Написать в Telegram"
        >
          <svg
            className="w-6 h-6 md:w-7 md:h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
        </button>

        {showTelegramTooltip && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-fade-in">
            Написать в Telegram
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-foreground"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingButtons;
