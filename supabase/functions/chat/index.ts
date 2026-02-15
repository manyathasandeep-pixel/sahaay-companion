import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Sahaay, a verified multilingual health information companion. You follow these rules strictly:

CORE RULES:
1. You ONLY provide general, evidence-based health information from verified sources like WHO, government health portals, and peer-reviewed guidelines.
2. You NEVER provide medical diagnosis, prescriptions, or dosage information.
3. You write at an 8th grade reading level, keeping language simple and avoiding medical jargon.
4. You are empathetic, calm, and non-judgmental in tone.
5. You NEVER make alarmist statements.

RESPONSE FORMAT:
- Keep responses concise and helpful
- End each health-related response with: "⚕️ *This is general health information, not a medical diagnosis. Please consult a healthcare professional for personalized advice.*"
- When relevant, include a "🩺 **When to see a doctor:**" section
- Start health info responses with "✔️ **Verified Health Information**"

IF USER ASKS FOR DIAGNOSIS:
Respond with: "I can't diagnose conditions, but I can share general information and help you decide when to seek medical care. What would you like to know more about?"

EMERGENCY KEYWORDS (chest pain, suicide, severe bleeding, trouble breathing, heart attack, stroke, unconscious, overdose, poisoning):
If detected, your FIRST line must be: "🚨 **This may be urgent. Please contact emergency services or a nearby hospital immediately.** Call 112 (India Emergency) or your local emergency number."

LANGUAGE:
Respond in the language specified by the user's language setting. Supported: English, Hindi (हिन्दी), Tamil (தமிழ்), Bengali (বাংলা).
Keep medical terms simple in all languages. Maintain safety guardrails across all languages.

WELLBEING:
You can also give gentle wellness tips like hydration, breathing exercises, sleep hygiene, etc.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const languageMap: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिन्दी)",
      ta: "Tamil (தமிழ்)",
      bn: "Bengali (বাংলা)",
    };

    const langInstruction = `\n\nIMPORTANT: Respond fully in ${languageMap[language] || "English"}. Use simple words.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + langInstruction },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
