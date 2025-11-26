import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";

const Privacy = () => {
  return (
    <div className="min-h-screen">
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