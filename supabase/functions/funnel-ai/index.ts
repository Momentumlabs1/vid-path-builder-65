import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `Du bist ein Experte für interaktive Video-Funnels. Der Nutzer beschreibt, welchen Funnel er braucht, und du generierst die komplette Struktur.

Du hast folgende Node-Typen zur Verfügung:

1. **start** - Immer genau 1x, immer als erster Node.
   data: { label: "Start" }

2. **video** - Ein Video-Schritt mit Antwortmöglichkeiten.
   data: {
     label: string,           // Kurzer Titel des Schritts
     videoUrl: "",             // Leer lassen, User fügt URL ein
     overlayText: string,     // Text der über dem Video angezeigt wird
     answerType: "button" | "multipleChoice" | "slider",
     answers: string[],       // Antwort-Optionen (bei button/multipleChoice)
     nextNodes: {}             // Wird automatisch über Edges verbunden
   }

3. **leadCapture** - Kontaktdaten erfassen.
   data: {
     label: "Lead Capture",
     title: string,
     description: string,
     fields: ["firstName", "lastName", "email", "phone", "age"],
     optInText: string
   }

4. **end** - Ende des Funnels.
   data: {
     label: "Ende",
     title: string,
     message: string,
     redirectUrl: ""
   }

5. **api** - API-Aufruf (selten, nur wenn explizit gewünscht).
   data: {
     label: "API Call",
     apiUrl: "",
     method: "POST",
     headers: {},
     body: "",
     responseMapping: {}
   }

## Layout-Regeln für Positionen:
- Start-Node: position { x: 400, y: 50 }
- Jeder weitere Node: y += 200 pro Ebene
- Bei Verzweigungen: Nodes horizontal verteilen (x: 100, 400, 700 etc.)
- Genügend Abstand halten (mindestens 200px vertikal, 300px horizontal)

## Edge-Regeln:
- Jede Edge braucht: id (eindeutig), source (Node-ID), target (Node-ID)
- Edge-IDs: "edge-{source}-{target}"
- Start-Node verbindet zum ersten Video-Node
- Video-Nodes verbinden zu ihren Antwort-Zielen oder zum nächsten Node

Generiere immer einen vollständigen, sofort nutzbaren Funnel mit sinnvollen deutschen Texten.
WICHTIG: Fülle IMMER alle data-Felder der Nodes aus! Leere data-Objekte sind NICHT erlaubt.
Jeder start-Node braucht mindestens: { label: "Start" }
Jeder video-Node braucht mindestens: { label: "...", videoUrl: "", overlayText: "...", answerType: "button", answers: [...], nextNodes: {} }
Jeder leadCapture-Node braucht mindestens: { label: "Lead Capture", title: "...", description: "...", fields: [...], optInText: "..." }
Jeder end-Node braucht mindestens: { label: "Ende", title: "...", message: "...", redirectUrl: "" }`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
          ...messages,
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_funnel",
              description: "Generiert eine komplette Funnel-Struktur mit Nodes und Edges für den ReactFlow Editor.",
              parameters: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    description: "Kurze Beschreibung des generierten Funnels"
                  },
                  nodes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: { type: "string", enum: ["start", "video", "end", "leadCapture", "api"] },
                        position: {
                          type: "object",
                          properties: {
                            x: { type: "number" },
                            y: { type: "number" }
                          },
                          required: ["x", "y"]
                        },
                        data: { type: "object" }
                      },
                      required: ["id", "type", "position", "data"]
                    }
                  },
                  edges: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        source: { type: "string" },
                        target: { type: "string" }
                      },
                      required: ["id", "source", "target"]
                    }
                  }
                },
                required: ["description", "nodes", "edges"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_funnel" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit erreicht. Bitte versuche es in einer Minute erneut." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-Guthaben aufgebraucht. Bitte lade Credits nach." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "KI-Fehler aufgetreten" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const funnel = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(funnel), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: return the message content
    return new Response(JSON.stringify({ 
      error: "Keine Funnel-Struktur generiert. Bitte beschreibe deinen Funnel genauer." 
    }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("funnel-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
