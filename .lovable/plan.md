
# Plan: "Unbekannter Node-Typ: start" Fehler beheben

## Problem-Zusammenfassung

Der Funnel **"smart-trading-v6"** existiert und ist korrekt konfiguriert (is_public: true), aber:

1. **Edges werden nicht geladen**: `EmbedViewer.tsx` und `FunnelViewer.tsx` laden nur `structure.nodes`, ignorieren aber `structure.edges`
2. **Fehlende globale Variable**: `VideoFunnelPreview.tsx` erwartet Edges über `window.funnelEdges`, die nie gesetzt wird
3. **Falscher Fallback**: Ohne Edges springt der Preview zum Start-Node statt zum ersten Video-Node
4. **Kein Renderer für "start"**: Der `start` Node-Typ wird nicht gerendert, daher "Unbekannter Node-Typ"

## Technische Lösung

### Datei 1: `src/pages/EmbedViewer.tsx`

Edges aus der Struktur laden und global setzen:

```typescript
// Nach dem Laden der Nodes (ca. Zeile 53)
const loadedNodes = structure?.nodes || [];
const loadedEdges = structure?.edges || [];

// Edges global verfügbar machen für VideoFunnelPreview
(window as any).funnelEdges = loadedEdges;
```

### Datei 2: `src/pages/FunnelViewer.tsx`

Gleiche Änderung:

```typescript
// Nach dem Laden der Struktur (ca. Zeile 46)
const structure = data.structure as any;
setNodes(structure.nodes || []);

// Edges global verfügbar machen
(window as any).funnelEdges = structure.edges || [];
```

### Datei 3: `src/components/funnel/VideoFunnelPreview.tsx`

Start-Node überspringen und direkt zum verbundenen Video-Node navigieren:

```typescript
// Verbesserte Logik in useEffect (ca. Zeile 36-78)
// Wenn Start-Node gefunden UND Edges vorhanden:
//   → Folge der ersten Edge zum verbundenen Node
// Wenn Start-Node gefunden OHNE Edges:
//   → Überspringe Start-Node, suche erstes Video
// Fallback: Erstes Video oder erster nicht-start Node
```

## Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| `src/pages/EmbedViewer.tsx` | Edges laden + `window.funnelEdges` setzen |
| `src/pages/FunnelViewer.tsx` | Edges laden + `window.funnelEdges` setzen |
| `src/components/funnel/VideoFunnelPreview.tsx` | Start-Node korrekt überspringen |

## Erwartetes Ergebnis

Nach der Implementierung:
- Der Funnel startet beim **ersten Video** (v1-begruessung), nicht beim Start-Node
- Die Edge-Navigation funktioniert (z.B. "Erzähl mir mehr" → v2a-story)
- Kein "Unbekannter Node-Typ" Fehler mehr

## Funnel-Struktur Bestätigung

Der Funnel `smart-trading-v6` enthält:
- **55 Edges** (Verbindungen zwischen Nodes)
- **Start-Node** → verbunden mit `v1-begruessung` (erstes Video)
- **39+ Video-Nodes** mit korrekten Video-URLs
- **Lead-Capture** und **End-Nodes** am Schluss
