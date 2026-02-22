import { Button } from "@/components/ui/button";

const CompactCTA = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 border border-primary/20 rounded-xl p-6">
        <p className="text-foreground font-medium text-center sm:text-left">
          Остались вопросы? Закажите бесплатную консультацию специалиста.
        </p>
        <Button
          size="lg"
          onClick={() => {
            window.location.href = '/#contact';
          }}
          className="whitespace-nowrap"
        >
          Консультация
        </Button>
      </div>
    </section>
  );
};

export default CompactCTA;
