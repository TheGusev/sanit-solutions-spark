import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DiscountPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiscountPopup = ({ open, onOpenChange }: DiscountPopupProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      toast.success("Спасибо! Ваша заявка принята!", {
        description: "Мы свяжемся с вами в ближайшее время для уточнения деталей.",
      });
      onOpenChange(false);
      setName("");
      setPhone("");
      setEmail("");
    } else {
      toast.error("Пожалуйста, заполните обязательные поля");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🎁 Получите скидку до 30%!
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-gradient-accent p-6 rounded-2xl text-accent-foreground text-center mb-4">
          <p className="text-3xl font-bold mb-2">До -30%</p>
          <p className="text-sm">на первый заказ при заявке сегодня</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="popup-name">Ваше имя *</Label>
            <Input
              id="popup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div>
            <Label htmlFor="popup-phone">Телефон *</Label>
            <Input
              id="popup-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>

          <div>
            <Label htmlFor="popup-email">Email (опционально)</Label>
            <Input
              id="popup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.ru"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg py-6 h-auto"
          >
            Получить скидку
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;
