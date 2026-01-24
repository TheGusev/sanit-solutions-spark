import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TermsContent from "@/components/TermsContent";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`Пользовательское соглашение | Санитарные Решения`}</title>
        <meta name="description" content="Пользовательское соглашение ООО Санитарные Решения. Условия использования сайта, оказания услуг и права сторон." />
        <link rel="canonical" href="https://goruslugimsk.ru/terms" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/terms" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/terms" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Пользовательское соглашение</h1>
        
        <TermsContent />
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
