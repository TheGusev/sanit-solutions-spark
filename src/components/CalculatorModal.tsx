import { useState, lazy, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SectionLoader from "@/components/SectionLoader";

const Calculator = lazy(() => import("@/components/Calculator"));

interface CalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CalculatorModal = ({ open, onOpenChange }: CalculatorModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            Рассчитать стоимость
          </DialogTitle>
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
