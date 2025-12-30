import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Политика конфиденциальности | Санитарные Решения</title>
        <meta name="description" content="Политика конфиденциальности ООО Санитарные Решения. Информация о сборе, использовании и защите персональных данных." />
        <link rel="canonical" href="https://goruslugimsk.ru/privacy" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/privacy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
        
        <PrivacyPolicyContent />
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;