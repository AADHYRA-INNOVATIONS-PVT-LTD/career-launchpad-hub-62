// Multi-purpose Health AI tools (skin, hair, BMI, diabetes, stress, sleep, diet, chatbot)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOOL_PROMPTS: Record<string, string> = {
  skin: `You are an AI dermatology assistant. Given a description (and optionally an image description) of a person's skin, return possible skin conditions, severity, recommended skincare routine, ingredients to look for/avoid, and when to see a dermatologist. Always include a disclaimer.`,
  hair: `You are an AI trichology assistant. Given a description of hair/scalp issues, return possible causes (stress, hormonal, nutritional, genetic), recommended treatments, products, lifestyle changes and when to see a doctor. Always include a disclaimer.`,
  bmi: `You are a clinical health AI. Given height, weight, age, gender — calculate BMI, classify it, identify obesity/underweight risks, and give a 7-day action plan with diet & exercise tips. Always include a disclaimer.`,
  diabetes: `You are a diabetes risk assessment AI. Based on the user's lifestyle, family history, weight, age, and symptoms — return a risk score (0-100), risk level (low/medium/high), top contributing factors, prevention plan, and recommended tests. Disclaimer required.`,
  stress: `You are a mental wellness AI. Based on the user's described feelings, sleep, work pressure — return a stress level (low/moderate/high/severe), top triggers, evidence-based coping strategies (CBT, breathing, journaling), 7-day mindfulness plan and when to seek therapy. Disclaimer required.`,
  sleep: `You are a sleep medicine AI. Given sleep patterns, hours, quality, and lifestyle, return sleep score, likely causes of poor sleep, sleep hygiene plan, and red flags requiring a doctor.`,
  diet: `You are a clinical nutritionist AI. Given goals (weight loss/gain/PCOS/diabetes/muscle), preferences (veg/non-veg), allergies, and current weight — return a 7-day meal plan (Indian foods preferred), macro split, hydration plan, and supplements suggestion.`,
  chat: `You are AADHYRA Health Assistant — a friendly 24/7 health chatbot. Answer general health questions clearly, recommend specialists when needed, never diagnose, and always remind users to consult doctors for serious concerns.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tool, input } = await req.json();
    if (!tool || !TOOL_PROMPTS[tool]) {
      return new Response(JSON.stringify({ error: "Invalid tool" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!input || typeof input !== "string" || input.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Please provide details" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: TOOL_PROMPTS[tool] + "\n\nReturn a friendly, well-formatted Markdown response with clear sections and bullet points." },
          { role: "user", content: input },
        ],
      }),
    });

    if (response.status === 429) return new Response(JSON.stringify({ error: "Service is busy. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!response.ok) {
      const t = await response.text();
      throw new Error(`AI gateway error: ${t}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response";
    return new Response(JSON.stringify({ result: content, tool }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("health-ai error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});