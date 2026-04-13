import { useState, useRef, useEffect } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const MaxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

const FloatingButtons = () => {
  const { context } = useTraffic();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handlePhoneClick = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      variant: context?.variantId
    });
    window.location.href = "tel:84950181817";
  };

  const items = [
    {
      label: "Позвонить",
      onClick: handlePhoneClick,
      href: undefined as string | undefined,
      bg: "bg-green-600 hover:bg-green-700",
      icon: <Phone className="w-5 h-5" />,
      delay: "0ms",
    },
    {
      label: "MAX",
      href: "https://max.ru/u/f9LHodD0cOLnq-s7zesBNQy44zFsmKRWA0ggLQyxcSygnjU6MTchzhcEMBo",
      bg: "bg-[#168DE2] hover:bg-[#1278c4]",
      icon: <MaxIcon className="w-5 h-5" />,
      delay: "75ms",
    },
    {
      label: "Telegram",
      href: "https://t.me/one_help",
      bg: "bg-[#26A5E4] hover:bg-[#1e8cbf]",
      icon: <TelegramIcon className="w-5 h-5" />,
      delay: "150ms",
    },
  ];

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
      {/* Expandable items */}
      <div className="flex flex-col items-end gap-2.5">
        {items.map((item, i) => {
          const btnClass = `flex items-center gap-2 rounded-full ${item.bg} text-white shadow-lg transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-4 scale-75 pointer-events-none"
          }`;

          const style = {
            transitionDelay: isOpen ? item.delay : `${(items.length - 1 - i) * 50}ms`,
          };

          const content = (
            <>
              <span className="text-sm font-medium pl-4 pr-1 whitespace-nowrap">{item.label}</span>
              <span className="w-11 h-11 flex items-center justify-center">{item.icon}</span>
            </>
          );

          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={btnClass}
                style={style}
                aria-label={item.label}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={btnClass}
              style={style}
              aria-label={item.label}
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? "rotate-0" : "animate-pulse-attention"
        }`}
        aria-label={isOpen ? "Закрыть меню" : "Связаться с нами"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default FloatingButtons;
