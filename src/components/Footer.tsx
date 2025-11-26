import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">🧪</div>
              <h3 className="text-xl font-bold">Санитарные Решения</h3>
            </div>
            <p className="text-sm opacity-80 mb-4">
              ООО "Санитарные Решения" — профессиональные услуги дезинфекции, 
              дезинсекции и дератизации в Москве и Московской области.
            </p>
            <p className="text-xs opacity-60">ИНН: 7701234567</p>
            <p className="text-xs opacity-60">ОГРН: 1234567890123</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>• Дезинфекция помещений</li>
              <li>• Дезинсекция (уничтожение насекомых)</li>
              <li>• Дератизация (борьба с грызунами)</li>
              <li>• Озонирование</li>
              <li>• Дезодорация</li>
              <li>• Сертификация</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/gallery" className="hover:opacity-100">
                  • Наши работы
                </Link>
              </li>
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
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+79069989888" className="hover:opacity-100">
                  +7 (906) 998-98-88
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:west-centro@mail.ru" className="hover:opacity-100">
                  west-centro@mail.ru
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <a href="https://wa.me/79069989888" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✈️</span>
                <a href="https://t.me/The_Suppor_t" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">
                  Telegram: @The_Suppor_t
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Москва, Центральный округ</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span>
                <span>Круглосуточно, без выходных</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-60">
          <p>© 2024 ООО "Санитарные Решения". Все права защищены.</p>
          <p className="mt-2">Лицензия на осуществление деятельности № 123456</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
