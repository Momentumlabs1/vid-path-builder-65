

## Plan: Start-Button ins iFrame verlagern

### Ziel
Der "Jetzt starten"-Button kommt aus dem Funnel (im iFrame), nicht von der externen Website. Damit zählt der Klick als User-Geste im iFrame und iOS erlaubt das Video.

### Ablauf NEU
1. Externe Website: Zeigt nur Placeholder/Thumbnail für den iFrame
2. iFrame lädt Funnel → zeigt Start-Screen mit "Jetzt starten" Button
3. User klickt 1x (IM iFrame) → Video 1 startet sofort

### Technische Umsetzung

#### Datei: `src/components/funnel/VideoFunnelPreview.tsx`

**1. Start-Node nicht mehr überspringen**

Aktuell (Zeile 40-60): Der Code findet den Start-Node und springt sofort zum ersten Video-Node.

Änderung: Im Embed-Modus den Start-Node als echten Screen anzeigen.

**2. Start-Screen rendern (vor dem Video-Render-Block)**

Wenn `currentNode.type === 'start'` und `mode === 'embed'`:
- Fullscreen-Overlay mit Gradient-Hintergrund
- Play-Icon (grün, groß)
- "Jetzt starten" Button
- Klick auf Button → `setCurrentNodeId(nächsterVideoNode)`

```text
┌─────────────────────────────┐
│                             │
│         [▶ Play]            │
│                             │
│      "Jetzt starten"        │
│                             │
└─────────────────────────────┘
```

**3. Navigation zum ersten Video**

Beim Klick auf "Jetzt starten":
- Hole Edges aus `window.funnelEdges`
- Finde Edge die vom Start-Node ausgeht
- Navigiere zu `edge.target` (= erstes Video)

### Externe Website (deine Seite)

Du entfernst den "Jetzt starten" Button und lässt nur den Placeholder/Thumbnail. Der iFrame übernimmt ab da.

### Ergebnis
- 1 Klick total (nicht 2)
- Klick passiert IM iFrame
- iOS akzeptiert die Geste
- Video 1 startet sofort sichtbar

