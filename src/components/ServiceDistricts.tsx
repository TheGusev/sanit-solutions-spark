import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Top 40 districts for display on homepage
const topDistricts = [
  { slug: 'arbat', name: 'Арбат', district: 'ЦАО' },
  { slug: 'zamoskvorechye', name: 'Замоскворечье', district: 'ЦАО' },
  { slug: 'khamovniki', name: 'Хамовники', district: 'ЦАО' },
  { slug: 'presnensky', name: 'Пресненский', district: 'ЦАО' },
  { slug: 'basmannyy', name: 'Басманный', district: 'ЦАО' },
  { slug: 'tverskoy', name: 'Тверской', district: 'ЦАО' },
  { slug: 'tagansky', name: 'Таганский', district: 'ЦАО' },
  { slug: 'meshchansky', name: 'Мещанский', district: 'ЦАО' },
  { slug: 'yakimanka', name: 'Якиманка', district: 'ЦАО' },
  { slug: 'maryino', name: 'Марьино', district: 'ЮАО' },
  { slug: 'brateevo', name: 'Братеево', district: 'ЮАО' },
  { slug: 'orekhovo-borisovo-severnoe', name: 'Орехово-Борисово', district: 'ЮАО' },
  { slug: 'tekstilshchiki', name: 'Текстильщики', district: 'ЮВАО' },
  { slug: 'pechatniki', name: 'Печатники', district: 'ЮВАО' },
  { slug: 'vykhino-zhulebino', name: 'Выхино-Жулебино', district: 'ЮВАО' },
  { slug: 'izmaylovo', name: 'Измайлово', district: 'ВАО' },
  { slug: 'perovo', name: 'Перово', district: 'ВАО' },
  { slug: 'sokol', name: 'Сокол', district: 'САО' },
  { slug: 'khoroshevsky', name: 'Хорошёво-Мнёвники', district: 'САО' },
  { slug: 'kuntsevo', name: 'Кунцево', district: 'ЗАО' },
  { slug: 'fili-davydkovo', name: 'Фили-Давыдково', district: 'ЗАО' },
  { slug: 'ochakovo-matveevskoe', name: 'Очаково-Матвеевское', district: 'ЗАО' },
  { slug: 'krylatskoe', name: 'Крылатское', district: 'ЗАО' },
  { slug: 'gagarinskiy', name: 'Гагаринский', district: 'ЮЗАО' },
  { slug: 'lomonosovsky', name: 'Ломоносовский', district: 'ЮЗАО' },
  { slug: 'akademichesky', name: 'Академический', district: 'ЮЗАО' },
  { slug: 'cheryomushki', name: 'Черёмушки', district: 'ЮЗАО' },
  { slug: 'konkovo', name: 'Коньково', district: 'ЮЗАО' },
  { slug: 'tyoply-stan', name: 'Тёплый Стан', district: 'ЮЗАО' },
  { slug: 'yasenevo', name: 'Ясенево', district: 'ЮЗАО' },
  { slug: 'dorogomilovo', name: 'Дорогомилово', district: 'ЗАО' },
];

const okrugs = [
  { id: 'cao', name: 'ЦАО', fullName: 'Центральный' },
  { id: 'sao', name: 'САО', fullName: 'Северный' },
  { id: 'svao', name: 'СВАО', fullName: 'Северо-Восточный' },
  { id: 'vao', name: 'ВАО', fullName: 'Восточный' },
  { id: 'yuvao', name: 'ЮВАО', fullName: 'Юго-Восточный' },
  { id: 'yao', name: 'ЮАО', fullName: 'Южный' },
  { id: 'yzao', name: 'ЮЗАО', fullName: 'Юго-Западный' },
  { id: 'zao', name: 'ЗАО', fullName: 'Западный' },
  { id: 'szao', name: 'СЗАО', fullName: 'Северо-Западный' },
  { id: 'nao', name: 'НАО', fullName: 'Новомосковский' },
  { id: 'tao', name: 'ТАО', fullName: 'Троицкий' },
  { id: 'zelao', name: 'ЗелАО', fullName: 'Зеленоградский' },
];

const serviceTabs = [
  { key: 'dezinfekciya', label: 'Дезинфекция' },
  { key: 'dezinsekciya', label: 'Дезинсекция' },
  { key: 'deratizaciya', label: 'Дератизация' },
];

const ServiceDistricts = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Районы обслуживания в Москве
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Работаем во всех районах Москвы и Московской области. Выезд за 15-40 минут в зависимости от удалённости.
          </p>
        </div>

        {/* Tabbed Administrative Districts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Административные округа
          </h3>
          <Tabs defaultValue="dezinfekciya" className="w-full">
            <TabsList className="mb-4 w-full flex flex-wrap h-auto gap-1">
              {serviceTabs.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key} className="flex-1 min-w-[120px]">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {serviceTabs.map((tab) => (
              <TabsContent key={tab.key} value={tab.key}>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                  {okrugs.map((okrug) => (
                    <Link key={okrug.id} to={`/uslugi/${tab.key}-${okrug.id}`}>
                      <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border hover:border-primary/50">
                        <CardContent className="p-3 text-center">
                          <span className="font-bold text-primary text-sm">{okrug.name}</span>
                          <p className="text-xs text-muted-foreground truncate">{okrug.fullName}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Popular Neighborhoods */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Популярные районы</h3>
          <div className="flex flex-wrap gap-2">
            {topDistricts.map((district) => (
              <Link key={district.slug} to={`/rajony/${district.slug}`}>
                <Badge 
                  variant="secondary" 
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer py-1.5 px-3"
                >
                  {district.name}
                  <span className="ml-1 text-xs opacity-70">({district.district})</span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA to all districts */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/rajony" className="flex items-center gap-2">
              Все 130 районов Москвы
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceDistricts;
