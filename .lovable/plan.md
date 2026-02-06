

## WYSIWYG Fix: Editor zeigt jetzt echte Größen

### Das Problem (kurz)
Der Editor zeigt dir Buttons **bis zu 26% größer** als sie wirklich sind:
- **`scale-105`** bei ausgewählten Nodes → +5% Vergrößerung
- **`maxZoom: 1.2`** beim Anklicken → +20% Zoom
- **Zusammen: 1.05 × 1.2 = 1.26** → deine "2XL" Buttons wirken im Editor riesig, aber in Vorschau/Website sind sie echt

### Die Lösung

#### 1. scale-105 entfernen (VideoNode.tsx, Zeile 465-466)
```
VORHER:
!isPreview && selected 
  ? 'border-purple-500 shadow-xl shadow-purple-500/30 scale-105'

NACHHER:
!isPreview && selected 
  ? 'border-purple-500 shadow-xl shadow-purple-500/30'
```

#### 2. maxZoom auf 1.0 setzen (FunnelBuilder.tsx, Zeile 103-108)
```
VORHER:
reactFlowInstance.fitView({ 
  nodes: [{ id: node.id }], 
  duration: 800,
  padding: 0.3,
  maxZoom: 1.2
});

NACHHER:
reactFlowInstance.fitView({ 
  nodes: [{ id: node.id }], 
  duration: 800,
  padding: 0.5,
  maxZoom: 1.0,
  minZoom: 1.0
});
```

#### 3. Zoom-Anzeige + "100%" Button hinzufügen (FunnelBuilder.tsx)
In der Header-Leiste ein kleiner Indikator:
- Zeigt aktuellen Zoom-Level an (z.B. "100%")
- Button um sofort auf 100% zu springen

---

### Technischer Hintergrund

| Datei | Zeile | Was passiert | Fix |
|-------|-------|-------------|-----|
| `VideoNode.tsx` | 465-466 | `scale-105` bei `selected` | Entfernen |
| `FunnelBuilder.tsx` | 103-108 | `maxZoom: 1.2` | Auf `1.0` setzen |
| `FunnelBuilder.tsx` | Header | Kein Zoom-Indikator | Hinzufügen |

---

### Ergebnis nach Umsetzung
- Editor zeigt **exakt dieselbe Größe** wie Vorschau und Website
- Wenn du "2XL (280px)" wählst, siehst du überall 280px
- Kein verstecktes Zoom/Scale mehr
- WYSIWYG ist endlich Realität

