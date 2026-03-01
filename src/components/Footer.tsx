import { memo } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, MapPin, Clock, Beaker } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

const Footer = memo(() => {
  const { context } = useTraffic();
  
  const handlePhoneClick = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      variant: context?.variantId,
      source: 'footer'
    });
  };

  const handleMessengerClick = (messenger: string) => {
    trackGoal('messenger_click', {
      intent: context?.intent,
      variant: context?.variantId,
      messenger: messenger,
      source: 'footer'
    });
  };

  return (
    <footer className="bg-[hsl(230,25%,12%)] text-white">
      {/* Триколор-полоса сверху */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-primary"></div>
        <div className="flex-1 bg-russia-red"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
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
              <li><Link to="/uslugi/dezinfekciya" className="hover:opacity-100">• Дезинфекция помещений</Link></li>
              <li><Link to="/uslugi/dezinsekciya" className="hover:opacity-100">• Дезинсекция (уничтожение насекомых)</Link></li>
              <li><Link to="/uslugi/deratizaciya" className="hover:opacity-100">• Дератизация (борьба с грызунами)</Link></li>
              <li><Link to="/uslugi/ozonirovanie" className="hover:opacity-100">• Озонирование</Link></li>
              <li><Link to="/uslugi/dezodoraciya" className="hover:opacity-100">• Дезодорация</Link></li>
              <li><Link to="/uslugi/demerkurizaciya" className="hover:opacity-100">• Демеркуризация</Link></li>
              <li><Link to="/uslugi/borba-s-krotami" className="hover:opacity-100">• Борьба с кротами</Link></li>
              <li><Link to="/uslugi/obrabotka-uchastkov" className="hover:opacity-100">• Обработка участков</Link></li>
              <li><Link to="/sluzhba-dezinsekcii" className="hover:opacity-100">• Служба дезинсекции</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/uslugi/po-okrugam-moskvy" className="hover:opacity-100">• По округам Москвы</Link></li>
              <li><Link to="/rajony" className="hover:opacity-100">• Районы Москвы</Link></li>
              <li><Link to="/blog" className="hover:opacity-100">• Блог и статьи</Link></li>
              <li><Link to="/blog/kak-podgotovit-pomeshchenie" className="hover:opacity-100">• Подготовка к дезинфекции</Link></li>
              <li><Link to="/#faq" className="hover:opacity-100">• Частые вопросы</Link></li>
              <li><Link to="/privacy" className="hover:opacity-100">• Политика конфиденциальности</Link></li>
              <li><Link to="/terms" className="hover:opacity-100">• Пользовательское соглашение</Link></li>
              <li><Link to="/contacts" className="hover:opacity-100">• Контакты и реквизиты</Link></li>
              <li><Link to="/team" className="hover:opacity-100">• Наша команда</Link></li>
              <li><Link to="/otzyvy" className="hover:opacity-100">• Отзывы клиентов</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Московская область</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/moscow-oblast" className="hover:opacity-100">• Все города МО</Link></li>
              <li><Link to="/moscow-oblast/khimki" className="hover:opacity-100">• Химки</Link></li>
              <li><Link to="/moscow-oblast/mytishchi" className="hover:opacity-100">• Мытищи</Link></li>
              <li><Link to="/moscow-oblast/balashikha" className="hover:opacity-100">• Балашиха</Link></li>
              <li><Link to="/moscow-oblast/krasnogorsk" className="hover:opacity-100">• Красногорск</Link></li>
              <li><Link to="/moscow-oblast/podolsk" className="hover:opacity-100">• Подольск</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="tel:84950181817" 
                  onClick={handlePhoneClick} 
                  className="hover:opacity-100"
                >
                  8-495-018-18-17
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
                <a 
                  href="https://max.ru/u/f9LHodD0cOLnq-s7zesBNQy44zFsmKRWA0ggLQyxcSygnjU6MTchzhcEMBo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => handleMessengerClick('max')}
                  className="hover:opacity-100"
                >
                  MAX Мессенджер
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

        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} ООО "Санитарные Решения". Все права защищены.</p>
          <p className="mt-2">Деятельность по дезинфекции, дезинсекции и дератизации подлежит лицензированию. Компания внесена в реестр Роспотребнадзора.</p>
          <p className="mt-2">
            ИНН: 5410169338 | ОГРН: 1255400030555
          <a href="/admin/login" className="ml-2 opacity-30 hover:opacity-100 transition-opacity">◊</a>
          </p>
          <p className="mt-2 text-xs opacity-50">
            Данный сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями Статьи 437 (2) ГК РФ.
          </p>
        </div>
      </div>

      {/* Триколорная полоса снизу */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-primary"></div>
        <div className="flex-1 bg-russia-red"></div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
