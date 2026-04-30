// AI Lab — prompt → project plan generator (Lovable AI)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are AADHYRA LAB, a Lovable-style AI project generator.
Given a user's project idea, return a complete structured plan PLUS production-grade preview code.

Return:
- name (catchy product name)
- tagline (one-liner)
- description (2-3 sentences)
- techStack (array of strings — modern web stack)
- features (array of 5-7 user-facing features)
- pages (array of 3-6 page names)
- dataModel (array of {table, fields[]})
- nextSteps (array of 4-5 actionable steps to build it)
- previewHtml: ONE complete, self-contained, beautiful HTML document (string) that demonstrates the landing page of the project.
  * Include <html>, <head>, <body>, inline <style>, and inline <script>.
  * Use TailwindCSS via <script src="https://cdn.tailwindcss.com"></script>.
  * Use modern gradients, rounded corners, hover states, responsive grid.
  * Include hero, features, CTA. Make it look like a real production landing page for the product.
  * No external images (use emoji or SVG). No external CSS/JS besides Tailwind CDN.
  * Must render standalone in a sandboxed iframe.

Be specific, modern, and production-oriented.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_project_plan",
              description: "Generate a structured project plan",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  tagline: { type: "string" },
                  description: { type: "string" },
                  techStack: { type: "array", items: { type: "string" } },
                  features: { type: "array", items: { type: "string" } },
                  pages: { type: "array", items: { type: "string" } },
                  dataModel: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        table: { type: "string" },
                        fields: { type: "array", items: { type: "string" } },
                      },
                      required: ["table", "fields"],
                    },
                  },
                  nextSteps: { type: "array", items: { type: "string" } },
                  previewHtml: { type: "string", description: "Self-contained HTML document for preview iframe" },
                },
                required: ["name", "tagline", "description", "techStack", "features", "pages", "dataModel", "nextSteps", "previewHtml"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_project_plan" } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`AI gateway error: ${txt}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured response from AI");

    const plan = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-lab-builder error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
