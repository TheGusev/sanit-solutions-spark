// Компонент для отладки и тестирования A/B архитектуры

import { useTraffic } from "@/contexts/TrafficContext";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Brain, TestTube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export default function ABTestDebug() {
  const { context, isLoading: contextLoading } = useTraffic();
  const { prediction, isLoading: mlLoading } = useMLPrediction();
  const [testingLead, setTestingLead] = useState(false);

  const handleTestLead = async () => {
    if (!context) {
      toast.error("Traffic context not ready");
      return;
    }

    setTestingLead(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-lead", {
        body: {
          name: `Test ${context.variantId}`,
          phone: "+7 (999) 999-99-99",
          service: "disinfection",
          source: "ab_test_debug",
          utm_source: "test",
          utm_medium: "debug",
          utm_campaign: "ab_testing",
          session_id: context.sessionId,
          intent: context.intent,
          variant_id: context.variantId,
          device_type: context.deviceType,
          first_landing_url: context.firstLandingUrl,
          last_page_url: window.location.href,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`✅ Test lead created with variant ${context.variantId}`);
      } else {
        throw new Error(data?.error || "Failed to create test lead");
      }
    } catch (error) {
      console.error("Test lead error:", error);
      toast.error("Failed to create test lead");
    } finally {
      setTestingLead(false);
    }
  };

  const handleTestEvent = async () => {
    if (!context) {
      toast.error("Traffic context not ready");
      return;
    }

    try {
      await supabase.functions.invoke("log-traffic-event", {
        body: {
          session_id: context.sessionId,
          page_url: window.location.href,
          utm_source: context.utm_source,
          utm_medium: context.utm_medium,
          utm_campaign: context.utm_campaign,
          intent: context.intent,
          variant_id: context.variantId,
          device_type: context.deviceType,
          event_type: "ab_test_debug",
          event_data: {
            test: true,
            timestamp: new Date().toISOString(),
          },
        },
      });

      toast.success("✅ Test event logged");
    } catch (error) {
      console.error("Test event error:", error);
      toast.error("Failed to log test event");
    }
  };

  if (contextLoading) {
    return (
      <Card className="fixed bottom-4 right-4 p-4 w-80 opacity-90 z-50">
        <p className="text-sm text-muted-foreground">Loading context...</p>
      </Card>
    );
  }

  if (!context) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 w-80 opacity-90 z-50 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <TestTube className="w-4 h-4" />
          A/B Test Debug
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.location.reload()}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Variant:</span>
          <Badge variant={context.variantId === "A" ? "default" : "secondary"}>
            {context.variantId}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Intent:</span>
          <span className="font-mono text-xs">
            {context.intent || "default"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Device:</span>
          <span className="font-mono text-xs">{context.deviceType}</span>
        </div>

        {prediction && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Brain className="w-3 h-3" />
                ML Segment:
              </span>
              <Badge
                variant={
                  prediction.segment === "high"
                    ? "default"
                    : prediction.segment === "mid"
                    ? "secondary"
                    : "outline"
                }
              >
                {prediction.segment}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">p_conv:</span>
              <span className="font-mono text-xs">
                {(prediction.p_conv * 100).toFixed(1)}%
              </span>
            </div>
          </>
        )}

        {mlLoading && (
          <div className="flex justify-center">
            <span className="text-xs text-muted-foreground">
              Loading ML...
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Session:</span>
          <span className="font-mono text-[10px] truncate max-w-[120px]">
            {context.sessionId.slice(0, 8)}...
          </span>
        </div>
      </div>

      <div className="pt-2 border-t space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs h-7"
          onClick={handleTestEvent}
        >
          <Database className="w-3 h-3 mr-1" />
          Log Test Event
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs h-7"
          onClick={handleTestLead}
          disabled={testingLead}
        >
          <TestTube className="w-3 h-3 mr-1" />
          {testingLead ? "Creating..." : "Create Test Lead"}
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center pt-2 border-t">
        Press Ctrl+Shift+D to toggle
      </p>
    </Card>
  );
}
