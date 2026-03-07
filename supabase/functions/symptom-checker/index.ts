import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms, age, gender } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!symptoms || symptoms.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Please describe your symptoms" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an AI medical symptom analyzer for Shiksha Health Connect. You provide preliminary health assessments based on symptoms described by patients.

IMPORTANT DISCLAIMERS:
- You are NOT a doctor. Always recommend consulting a real doctor.
- Never diagnose with certainty. Use phrases like "may indicate", "could be", "possibly".
- Always recommend emergency services for life-threatening symptoms.

Analyze the patient's symptoms and respond using the "analyze_symptoms" tool.

Consider the patient's age and gender when relevant to your analysis.`;

    const userPrompt = `Patient Info:
- Age: ${age || "Not specified"}
- Gender: ${gender || "Not specified"}

Symptoms described: ${symptoms}

Please analyze these symptoms and provide your assessment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_symptoms",
              description: "Return structured symptom analysis with possible conditions and recommendations",
              parameters: {
                type: "object",
                properties: {
                  severity: {
                    type: "string",
                    enum: ["low", "moderate", "high", "emergency"],
                    description: "Overall severity assessment",
                  },
                  possible_conditions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Condition name" },
                        likelihood: { type: "string", enum: ["low", "moderate", "high"] },
                        description: { type: "string", description: "Brief explanation" },
                      },
                      required: ["name", "likelihood", "description"],
                      additionalProperties: false,
                    },
                    description: "List of 2-5 possible conditions",
                  },
                  recommended_specialist: {
                    type: "string",
                    description: "Type of doctor to consult e.g. General Physician, Cardiologist",
                  },
                  immediate_actions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Things the patient should do right now",
                  },
                  questions_to_ask_doctor: {
                    type: "array",
                    items: { type: "string" },
                    description: "Questions the patient should ask their doctor",
                  },
                  disclaimer: {
                    type: "string",
                    description: "Medical disclaimer",
                  },
                },
                required: ["severity", "possible_conditions", "recommended_specialist", "immediate_actions", "questions_to_ask_doctor", "disclaimer"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_symptoms" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Service is busy. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits exhausted. Please try later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis returned");

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("symptom-checker error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
