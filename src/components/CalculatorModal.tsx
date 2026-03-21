import { lazy, Suspense, useEffect, useRef } from "react";
import { trackGoal } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SectionLoader from "@/components/SectionLoader";

const Calculator = lazy(() => import("./Calculator"));

interface CalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CalculatorModal = ({ open, onOpenChange }: CalculatorModalProps) => {
  const calcOpenFired = useRef(false);

  useEffect(() => {
    if (open && !calcOpenFired.current) {
      calcOpenFired.current = true;
      trackGoal("calc_open");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Калькулятор</DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-6">
          <Suspense fallback={<SectionLoader />}>
            <Calculator isModal />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorModal;
