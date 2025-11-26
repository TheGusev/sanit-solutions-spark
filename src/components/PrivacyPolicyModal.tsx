import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
}

const PrivacyPolicyModal = ({ open, onOpenChange, onAccept }: PrivacyPolicyModalProps) => {
  const handleAccept = () => {
    onAccept?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Политика конфиденциальности</DialogTitle>
          <DialogDescription>
            Пожалуйста, ознакомьтесь с условиями обработки персональных данных
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 max-h-[60vh] md:max-h-[70vh]">
          <PrivacyPolicyContent />
        </ScrollArea>

        <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t mt-4">
          <Button
            onClick={handleAccept}
            className="w-full"
            size="lg"
          >
            Принять и закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
