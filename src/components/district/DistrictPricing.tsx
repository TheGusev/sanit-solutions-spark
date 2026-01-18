import { useState } from 'react';
import { Check, FileText, Info } from 'lucide-react';
import { DistrictPage } from '@/data/districtPages';
import { cn } from '@/lib/utils';

interface DistrictPricingProps {
  district: DistrictPage;
}

type TabType = 'apartments' | 'offices' | 'cafes';

const DistrictPricing = ({ district }: DistrictPricingProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('apartments');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'apartments', label: 'Квартиры' },
    { id: 'offices', label: 'Офисы' },
    { id: 'cafes', label: 'Кафе / Рестораны' },
  ];

  const surcharge = district.surcharge;

  const apartmentPrices = [
    { type: '1-комнатная', area: '30-40 м²', price: 1000 + surcharge, time: '1-1.5 ч' },
    { type: '2-комнатная', area: '45-60 м²', price: 1500 + surcharge, time: '1.5-2 ч', highlighted: true },
    { type: '3-комнатная', area: '60-80 м²', price: 2000 + surcharge, time: '2-2.5 ч' },
    { type: '4-комнатная', area: '80-100 м²', price: 2800 + surcharge, time: '2.5-3 ч' },
    { type: 'Более 100 м²', area: '100+ м²', price: null, time: 'от 3 ч' },
  ];

  const officePrices = [
    { type: 'До 100 м²', price: 2500 + surcharge, time: '2-3 ч' },
    { type: '100-300 м²', price: 6000 + surcharge, time: '4-5 ч', highlighted: true },
    { type: '300-500 м²', price: 10000 + surcharge, time: '6-7 ч' },
    { type: 'Более 500 м²', price: null, time: 'от 8 ч' },
  ];

  const cafePrices = [
    { type: 'Кафе / кофейня (до 50 м²)', price: 2000 + surcharge, period: 'Раз в месяц' },
    { type: 'Ресторан (50-150 м²)', price: 4000 + surcharge, period: 'Раз в месяц', highlighted: true },
    { type: 'Крупный ресторан (150+ м²)', price: 6000 + surcharge, period: 'Раз в 2 недели' },
    { type: 'Фудкорт / столовая', price: null, period: 'По требованию СЭС' },
  ];

  const includedItems = [
    'Выезд специалиста в любой район Москвы',
    'Осмотр и консультация на месте',
    'Профессиональные препараты (Европа/РФ)',
    'Современное оборудование (генераторы тумана)',
    'Обработка всех зон и поверхностей',
    'Гарантия результата до 1 года',
    'Документы о проведённой обработке',
    'Рекомендации по уходу после обработки',
  ];

  const corporateFeatures = [
    'Работа в выходные и ночное время',
    'Договор с юрлицом',
    'Отсрочка платежа до 14 дней',
    'Скидка 10% при заказе от 50 000₽',
    'Регулярное обслуживание по графику',
  ];

  const documents = [
    'Договор на оказание услуг',
    'Акт выполненных работ',
    'Копии сертификатов на препараты',
    'Журнал дезинфекционных мероприятий (при необходимости)',
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Цены на дезинфекцию в {district.name}
        </h2>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="text-green-600 font-semibold">✨ Фиксированные цены без доплат за центр!</span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Apartments Table */}
        {activeTab === 'apartments' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Тип квартиры</th>
                    <th className="px-4 py-4 text-left font-semibold">Площадь</th>
                    <th className="px-4 py-4 text-left font-semibold">Стоимость</th>
                    <th className="px-4 py-4 text-left font-semibold">Время</th>
                  </tr>
                </thead>
                <tbody>
                  {apartmentPrices.map((row, idx) => (
                    <tr 
                      key={idx}
                      className={cn(
                        "border-b border-muted transition-colors hover:bg-muted/50",
                        row.highlighted && "bg-primary/5"
                      )}
                    >
                      <td className="px-4 py-4 font-medium">{row.type}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.area}</td>
                      <td className="px-4 py-4 font-bold text-primary">
                        {row.price ? `${row.price.toLocaleString()} ₽` : 'Индивидуально'}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  В {district.name} много квартир в исторических зданиях с высокими потолками (3.5-4 метра). 
                  Для таких помещений стоимость рассчитывается индивидуально.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Offices Table */}
        {activeTab === 'offices' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Площадь офиса</th>
                    <th className="px-4 py-4 text-left font-semibold">Стоимость</th>
                    <th className="px-4 py-4 text-left font-semibold">Время</th>
                  </tr>
                </thead>
                <tbody>
                  {officePrices.map((row, idx) => (
                    <tr 
                      key={idx}
                      className={cn(
                        "border-b border-muted transition-colors hover:bg-muted/50",
                        row.highlighted && "bg-primary/5"
                      )}
                    >
                      <td className="px-4 py-4 font-medium">{row.type}</td>
                      <td className="px-4 py-4 font-bold text-primary">
                        {row.price ? `${row.price.toLocaleString()} ₽` : 'Индивидуально'}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Для корпоративных клиентов:
              </h4>
              <ul className="space-y-2">
                {corporateFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Cafes Table */}
        {activeTab === 'cafes' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Тип заведения</th>
                    <th className="px-4 py-4 text-left font-semibold">Стоимость</th>
                    <th className="px-4 py-4 text-left font-semibold">Периодичность</th>
                  </tr>
                </thead>
                <tbody>
                  {cafePrices.map((row, idx) => (
                    <tr 
                      key={idx}
                      className={cn(
                        "border-b border-muted transition-colors hover:bg-muted/50",
                        row.highlighted && "bg-primary/5"
                      )}
                    >
                      <td className="px-4 py-4 font-medium">{row.type}</td>
                      <td className="px-4 py-4 font-bold text-primary">
                        {row.price ? `${row.price.toLocaleString()} ₽` : 'Индивидуально'}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{row.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Документы для Роспотребнадзора:
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                После обработки выдаём полный пакет документов:
              </p>
              <ul className="space-y-2">
                {documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* What's included */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Что входит в стоимость
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {includedItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistrictPricing;
