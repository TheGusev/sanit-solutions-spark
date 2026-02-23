import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

const FloatingButtons = () => {
  const { context } = useTraffic();
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);
  const [showMaxTooltip, setShowMaxTooltip] = useState(false);

  const handlePhoneClick = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      variant: context?.variantId
    });
    
    window.location.href = "tel:84950181817";
  };

  const handleMaxClick = () => {
    trackGoal('max_click', {
      intent: context?.intent,
      variant: context?.variantId
    });
    
    window.open("https://max.ru/u/f9LHodD0cOLnq-s7zesBNQy44zFsmKRWA0ggLQyxcSygnjU6MTchzhcEMBo", "_blank");
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

      {/* MAX Button */}
      <div className="relative">
        <button
          onClick={handleMaxClick}
          onMouseEnter={() => setShowMaxTooltip(true)}
          onMouseLeave={() => setShowMaxTooltip(false)}
          className="w-14 h-14 md:w-14 md:h-14 rounded-full bg-[#168DE2] hover:bg-[#1278c4] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:ring-2 hover:ring-russia-red hover:ring-offset-2"
          aria-label="Написать в MAX"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        {showMaxTooltip && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-fade-in">
            Написать в MAX
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-foreground"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingButtons;
