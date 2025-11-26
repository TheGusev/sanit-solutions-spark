import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  object_type: string;
  area_m2: number;
  service: string;
  method: string;
  frequency: string;
  client_type: string;
  base_price: number;
  discount_percent: number;
  discount_amount: number;
  final_price: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  website?: string; // Honeypot field
}

async function sendTelegramNotification(lead: LeadData): Promise<boolean> {
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  
  if (!botToken || !chatId) {
    console.log("⚠️ Telegram not configured, skipping notification");
    return true;
  }
  
  const message = `🔔 *Новая заявка с сайта!*

👤 *Имя:* ${lead.name}
📱 *Телефон:* ${lead.phone}
${lead.email ? `📧 *Email:* ${lead.email}\n` : ""}
🏠 *Помещение:* ${lead.object_type}
📐 *Площадь:* ${lead.area_m2} м²
🔧 *Услуга:* ${lead.service}
⚙️ *Метод:* ${lead.method}
📅 *Периодичность:* ${lead.frequency}
👔 *Тип клиента:* ${lead.client_type}

💰 *Базовая цена:* ${lead.base_price.toLocaleString("ru-RU")}₽
🎁 *Скидка:* ${lead.discount_percent}% (-${lead.discount_amount.toLocaleString("ru-RU")}₽)
✅ *Итого:* ${lead.final_price.toLocaleString("ru-RU")}₽
${lead.utm_source || lead.utm_medium || lead.utm_campaign ? `\n📊 *UTM:* ${lead.utm_source || "-"} / ${lead.utm_medium || "-"} / ${lead.utm_campaign || "-"}` : ""}
🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Telegram API error:", error);
      return false;
    }
    
    console.log("✅ Telegram notification sent successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to send Telegram notification:", error);
    return false;
  }
}

async function sendLeadToCrm(lead: LeadData): Promise<boolean> {
  const crmWebhookUrl = Deno.env.get("CRM_WEBHOOK_URL");
  
  if (!crmWebhookUrl) {
    console.log("📝 CRM not configured, skipping");
    return true;
  }
  
  try {
    const response = await fetch(crmWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      console.error("❌ CRM webhook error:", await response.text());
      return false;
    }
    
    console.log("✅ Lead sent to CRM successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to send lead to CRM:", error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("📥 Received lead request");
    const leadData: LeadData = await req.json();
    
    // Honeypot protection: if website field is filled, it's a bot
    if (leadData.website) {
      console.log("🤖 Bot detected via honeypot field");
      // Return success to not reveal the honeypot
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    console.log("💾 Saving lead to database...");
    const { data, error } = await supabase.from("leads").insert({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email || null,
      object_type: leadData.object_type,
      area_m2: leadData.area_m2,
      service: leadData.service,
      method: leadData.method,
      frequency: leadData.frequency,
      client_type: leadData.client_type,
      base_price: leadData.base_price,
      discount_percent: leadData.discount_percent,
      discount_amount: leadData.discount_amount,
      final_price: leadData.final_price,
      utm_source: leadData.utm_source || null,
      utm_medium: leadData.utm_medium || null,
      utm_campaign: leadData.utm_campaign || null,
    }).select().single();
    
    if (error) {
      console.error("❌ Database error:", error);
      throw error;
    }
    
    console.log("✅ Lead saved to database:", data.id);
    
    await Promise.all([
      sendTelegramNotification(leadData),
      sendLeadToCrm(leadData)
    ]);
    
    return new Response(
      JSON.stringify({ success: true, lead_id: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("❌ Error handling lead:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
