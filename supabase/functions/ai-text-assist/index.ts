// AI text assist for resume / portfolio (auto-write summaries, bios, project descriptions)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROMPTS: Record<string, string> = {
  resume_summary: "Write a powerful 3-4 line professional resume summary based on the user's role, skills and experience. Use active voice, no first-person.",
  portfolio_bio: "Write a friendly 4-5 sentence portfolio bio in first person showing personality, skills and what the person is passionate about.",
  project_description: "Write a clear, results-oriented 2-3 sentence project description highlighting the problem, solution, and impact.",
  skill_suggest: "Given the user's role/field, return ONLY a comma-separated list of 12-15 relevant technical and soft skills. No explanation.",
  experience_bullet: "Convert the user's job description into 3-4 strong, quantified bullet points starting with action verbs. Return as a markdown bullet list.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { type, input } = await req.json();
    if (!type || !PROMPTS[type]) return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!input || input.trim().length < 2) return new Response(JSON.stringify({ error: "Provide more details" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: PROMPTS[type] },
          { role: "user", content: input },
        ],
      }),
    });
    if (r.status === 429) return new Response(JSON.stringify({ error: "Busy. Try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) throw new Error(await r.text());
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("ai-text-assist error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});