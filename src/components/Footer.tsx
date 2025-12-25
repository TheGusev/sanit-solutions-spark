import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, Send, MapPin, Clock, Beaker } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

const Footer = () => {
  const { context } = useTraffic();
  
  const handlePhoneClick = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      variant: context?.variantId,
      source: 'footer'
    });
  };
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="h-7 w-7" />
              <h3 className="text-xl font-bold">Санитарные Решения</h3>
            </div>
            <p className="text-sm opacity-80 mb-4">
              ООО "Санитарные Решения" — профессиональные услуги дезинфекции, 
              дезинсекции и дератизации в Москве и Московской области.
            </p>
            <p className="text-xs opacity-60">ИНН: 5410169338</p>
            <p className="text-xs opacity-60">ОГРН: 1255400030555</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/uslugi/dezinfekciya" className="hover:opacity-100">
                  • Дезинфекция помещений
                </Link>
              </li>
              <li>
                <Link to="/uslugi/dezinsekciya" className="hover:opacity-100">
                  • Дезинсекция (уничтожение насекомых)
                </Link>
              </li>
              <li>
                <Link to="/uslugi/deratizaciya" className="hover:opacity-100">
                  • Дератизация (борьба с грызунами)
                </Link>
              </li>
              <li>• Озонирование</li>
              <li>• Дезодорация</li>
              <li>• Сертификация</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/blog" className="hover:opacity-100">
                  • Блог и статьи
                </Link>
              </li>
              <li>
                <Link to="/blog/kak-podgotovit-pomeshchenie" className="hover:opacity-100">
                  • Подготовка к дезинфекции
                </Link>
              </li>
              <li>
                <Link to="/blog/borba-s-tarakanami" className="hover:opacity-100">
                  • Борьба с тараканами
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:opacity-100">
                  • Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:opacity-100">
                  • Контакты и реквизиты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+79069989888" onClick={handlePhoneClick} className="hover:opacity-100">
                  +7 (906) 998-98-88
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:west-centro@mail.ru" className="hover:opacity-100">
                  west-centro@mail.ru
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                <a href="https://wa.me/79069989888" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-4 w-4 flex-shrink-0" />
                <a href="https://t.me/The_Suppor_t" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">
                  Telegram: @The_Suppor_t
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Москва, Центральный округ</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Круглосуточно, без выходных</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} ООО "Санитарные Решения". Все права защищены.</p>
          <p className="mt-2">Деятельность по дезинфекции, дезинсекции и дератизации подлежит лицензированию. Компания внесена в реестр Роспотребнадзора.</p>
          <p className="mt-2">
            ИНН: 5410169338 | ОГРН: 1255400030555
            <a href="/admin/login" className="ml-2 opacity-30 hover:opacity-100 transition-opacity">◊</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
