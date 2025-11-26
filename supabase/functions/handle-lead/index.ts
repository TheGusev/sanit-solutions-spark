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
  object_type?: string;
  area_m2?: number;
  service?: string;
  method?: string;
  frequency?: string;
  client_type?: string;
  base_price?: number;
  discount_percent?: number;
  discount_amount?: number;
  final_price?: number;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  website?: string; // Honeypot field
}

// Translation dictionaries
const objectTypeLabels: Record<string, string> = {
  apartment: "🏠 Квартира",
  house: "🏡 Частный дом",
  office: "🏢 Офис",
  warehouse: "📦 Склад",
  shop: "🛒 Магазин",
  restaurant: "🍽️ Ресторан",
  production: "🏭 Производство",
  other: "📋 Другое"
};

const serviceLabels: Record<string, string> = {
  disinfection: "🦠 Дезинфекция",
  disinsection: "🐜 Дезинсекция",
  deratization: "🐀 Дератизация",
  ozonation: "💨 Озонирование",
  complex: "✨ Комплексная обработка"
};

const methodLabels: Record<string, string> = {
  cold: "❄️ Холодный туман",
  hot: "🔥 Горячий туман",
  spot: "🎯 Точечная обработка",
  complex: "💎 Комплексная обработка"
};

const frequencyLabels: Record<string, string> = {
  once: "Разовая",
  monthly: "Ежемесячно",
  quarterly: "Ежеквартально"
};

const clientTypeLabels: Record<string, string> = {
  individual: "Физическое лицо",
  ip: "ИП",
  company: "Юридическое лицо"
};

async function sendTelegramNotification(lead: LeadData): Promise<boolean> {
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  
  if (!botToken || !chatId) {
    console.log("⚠️ Telegram not configured, skipping notification");
    return true;
  }
  
  // Check if this is a discount popup lead (without calculator data)
  const isDiscountPopup = lead.source === "website_discount_popup";
  
  let message: string;
  
  if (isDiscountPopup) {
    // Simplified message for discount popup leads
    message = `🎁 *ЗАЯВКА НА СКИДКУ*
━━━━━━━━━━━━━━━━━

👤 *Клиент:* ${lead.name}
📱 *Телефон:* [${lead.phone}](tel:${lead.phone.replace(/[^+\d]/g, "")})
${lead.email ? `📧 *Email:* ${lead.email}\n` : ""}
🔧 *Интересует:* ${lead.service ? (serviceLabels[lead.service] || lead.service) : "Не указана"}

━━━━━━━━━━━━━━━━━
📍 *Источник:* Попап со скидкой
${lead.utm_source || lead.utm_medium || lead.utm_campaign ? `📊 *UTM:* ${lead.utm_source || "—"} / ${lead.utm_medium || "—"} / ${lead.utm_campaign || "—"}\n` : ""}🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;
  } else {
    // Full message for calculator leads
    message = `🔔 *НОВАЯ ЗАЯВКА*
━━━━━━━━━━━━━━━━━

👤 *Клиент:* ${lead.name}
📱 *Телефон:* [${lead.phone}](tel:${lead.phone.replace(/[^+\d]/g, "")})
${lead.email ? `📧 *Email:* ${lead.email}\n` : ""}━━━━━━━━━━━━━━━━━

🏠 *Объект:* ${lead.object_type ? (objectTypeLabels[lead.object_type] || lead.object_type) : "—"}
📐 *Площадь:* ${lead.area_m2 || 0} м²

🔧 *Услуга:* ${lead.service ? (serviceLabels[lead.service] || lead.service) : "—"}
⚙️ *Метод:* ${lead.method ? (methodLabels[lead.method] || lead.method) : "—"}
📅 *Периодичность:* ${lead.frequency ? (frequencyLabels[lead.frequency] || lead.frequency) : "—"}
👔 *Тип клиента:* ${lead.client_type ? (clientTypeLabels[lead.client_type] || lead.client_type) : "—"}

━━━━━━━━━━━━━━━━━
💵 *СТОИМОСТЬ*

💰 Базовая: ${(lead.base_price || 0).toLocaleString("ru-RU")} ₽
🎁 Скидка: −${lead.discount_percent || 0}% (−${(lead.discount_amount || 0).toLocaleString("ru-RU")} ₽)
✅ *ИТОГО: ${(lead.final_price || 0).toLocaleString("ru-RU")} ₽*

━━━━━━━━━━━━━━━━━
${lead.utm_source || lead.utm_medium || lead.utm_campaign ? `📊 *UTM:* ${lead.utm_source || "—"} / ${lead.utm_medium || "—"} / ${lead.utm_campaign || "—"}\n` : ""}🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;
  }

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
      object_type: leadData.object_type || null,
      area_m2: leadData.area_m2 || null,
      service: leadData.service || null,
      method: leadData.method || null,
      frequency: leadData.frequency || null,
      client_type: leadData.client_type || null,
      base_price: leadData.base_price || null,
      discount_percent: leadData.discount_percent || null,
      discount_amount: leadData.discount_amount || null,
      final_price: leadData.final_price || null,
      source: leadData.source || "website_calculator",
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
