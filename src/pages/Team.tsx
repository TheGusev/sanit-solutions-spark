import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { blogAuthors } from "@/data/blog/types";
import { SEO_CONFIG } from "@/lib/seo";
import { Shield, Award, Clock } from "lucide-react";

const teamExtras: Record<string, { description: string }> = {
  'gusev-m': { description: 'Специализируется на уничтожении тараканов и клопов в жилых помещениях. Провёл более 2 000 обработок квартир и домов.' },
  'afanasiev': { description: 'Эксперт по борьбе с грызунами на складах и в частном секторе. Разрабатывает индивидуальные схемы дератизации.' },
  'gusev-v': { description: 'Мастер по применению современных препаратов и технологий: холодный/горячий туман, озонирование, аэрозольная обработка.' },
  'ivanov': { description: 'Ведущий специалист по барьерной защите и профилактике. Работает с жилыми домами, детскими садами и школами.' },
  'vasiliev': { description: 'Главный эксперт компании. Консультирует бизнес по требованиям СанПиН и Роспотребнадзора, оформляет документацию.' },
  'uchaev': { description: 'Обслуживает рестораны, офисы и производственные объекты. Специалист по регулярному санитарному обслуживанию B2B-клиентов.' },
};

const organizationLD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": SEO_CONFIG.companyName,
    "url": SEO_CONFIG.baseUrl,
    "description": "Профессиональные услуги дезинфекции, дезинсекции и дератизации в Москве и Московской области",
    "telephone": SEO_CONFIG.phone,
    "employee": blogAuthors.map(a => ({
      "@type": "Person",
      "name": a.name,
      "jobTitle": a.role,
      "description": `${a.experience} опыта. Специализация: ${a.specialization.slice(0, 3).join(', ')}`,
      "worksFor": {
        "@type": "Organization",
        "name": SEO_CONFIG.companyName,
      }
    }))
  }
};

const Team = () => (
  <div className="min-h-screen">
    <Helmet>
      <title>Наша команда — эксперты по дезинфекции | {SEO_CONFIG.companyName}</title>
      <meta name="description" content="Познакомьтесь с командой сертифицированных специалистов Санитарных Решений. Опыт от 5 до 12 лет в дезинфекции, дезинсекции и дератизации." />
      <link rel="canonical" href={`${SEO_CONFIG.baseUrl}/team/`} />
      <meta property="og:title" content={`Наша команда | ${SEO_CONFIG.companyName}`} />
      <meta property="og:description" content="Сертифицированные специалисты с опытом от 5 до 12 лет" />
      <meta property="og:url" content={`${SEO_CONFIG.baseUrl}/team/`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json">{JSON.stringify(organizationLD)}</script>
    </Helmet>

    <Header />

    <section className="pt-28 pb-4 px-4 border-b">
      <div className="container mx-auto max-w-5xl">
        <Breadcrumbs items={[{ label: "Наша команда" }]} />
      </div>
    </section>

    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Наша команда экспертов
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Сертифицированные специалисты с суммарным опытом более 49 лет в области санитарной обработки
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span>Все специалисты лицензированы</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-5 h-5 text-primary" />
              <span>Регулярное повышение квалификации</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span>Опыт от 5 до 12 лет</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogAuthors.map(author => {
            const initials = author.name.split(' ').map(w => w[0]).join('').slice(0, 2);
            const extra = teamExtras[author.id];

            return (
              <article
                key={author.id}
                id={`author-${author.id}`}
                className="rounded-xl border bg-card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow scroll-mt-28"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{author.name}</h2>
                    <p className="text-sm text-primary font-medium">{author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Опыт: {author.experience}</span>
                </div>

                {extra && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {extra.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {author.specialization.map(spec => (
                    <span
                      key={spec}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Team;
