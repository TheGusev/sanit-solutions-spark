import { lazy, Suspense } from "react";
import { useTraffic } from "@/contexts/TrafficContext";
import { useABVariant } from "@/hooks/useABVariant";
import SectionLoader from "@/components/SectionLoader";

const PricingByArea = lazy(() => import("@/components/PricingByArea"));
const PricingMinimal = lazy(() => import("@/components/PricingMinimal"));

/**
 * A/B Test Wrapper for Pricing Section
 * Variant A: Full pricing table (PricingByArea)
 * Variant B: Minimal pricing with 5-6 popular services (PricingMinimal)
 */
const PricingABWrapper = () => {
  const { context } = useTraffic();
  
  const { result, isLoading } = useABVariant(
    "pricing_section",
    context?.intent || null,
    context?.sessionId || null
  );

  // Show loader while determining variant
  if (isLoading || !result) {
    return <SectionLoader />;
  }

  return (
    <Suspense fallback={<SectionLoader />}>
      {result.variant === "B" ? <PricingMinimal /> : <PricingByArea />}
    </Suspense>
  );
};

export default PricingABWrapper;
