

# Plan: KI-Assistent im Funnel Builder

## Was wird gebaut

Ein **AI Chat Panel** im Funnel Builder, über das Nutzer beschreiben können, welchen Funnel sie brauchen. Die KI generiert daraus automatisch die komplette Funnel-Struktur (Nodes + Edges) und lädt sie in den Editor.

## Komponenten

### 1. Backend: Edge Function `funnel-ai`
- Nimmt eine Nutzerbeschreibung entgegen (z.B. "Ich will einen Immobilien-Funnel mit 3 Videos")
- Nutzt Lovable AI Gateway (`google/gemini-3-flash-preview`) mit Tool-Calling
- Gibt strukturierte Nodes + Edges zurück (Start → Video → LeadCapture → End etc.)
- System-Prompt kennt alle Node-Typen (video, start, end, leadCapture, api) und deren `data`-Felder
- Braucht: `LOVABLE_API_KEY` (muss erst aktiviert werden)

### 2. Frontend: `FunnelAIChat` Komponente
- Slide-in Panel (rechte Seite) oder Sheet, toggle per Button in der Toolbar
- Chat-Interface: Nutzer tippt Beschreibung, KI antwortet mit Vorschlag
- "Funnel generieren" Button lädt die KI-generierten Nodes/Edges in den ReactFlow-Canvas
- Streaming-Antwort für UX

### 3. Integration in FunnelBuilder
- Neuer "KI" Button in der Toolbar (Sparkles Icon)
- `setNodes` / `setEdges` werden mit KI-Output befüllt
- Bestehende Nodes können optional beibehalten oder ersetzt werden

## Technischer Ablauf

```text
User beschreibt Funnel → Edge Function → Lovable AI (tool calling)
                                              ↓
                                     Strukturiertes JSON:
                                     { nodes: [...], edges: [...] }
                                              ↓
                              Frontend lädt in ReactFlow Canvas
```

## Schritte

1. **LOVABLE_API_KEY aktivieren** via `ai_gateway--enable`
2. **Edge Function `funnel-ai`** erstellen — System-Prompt mit Node-Schema, Tool-Calling für strukturierte Ausgabe
3. **`FunnelAIChat` Komponente** — Chat UI mit Streaming, "Anwenden" Button
4. **FunnelBuilder Integration** — KI-Button in Toolbar, Panel-Toggle, Nodes/Edges laden
5. **Vorschläge-Feature** — Beim Öffnen zeigt die KI 3-4 Funnel-Ideen als Quick-Actions (z.B. "Immobilien-Funnel", "Coaching-Funnel", "E-Commerce-Funnel")

