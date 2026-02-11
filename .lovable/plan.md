
Zielbild
- Vorschau (Modal) ist absolut stabil: kein “Vibrieren”, kein Ghosting/Picture-in-picture, keine zweite Player-Instanz sichtbar.
- Interaktionen (Buttons/Inputs) sind in Vorschau/Embed zuverlässig sichtbar (auch wenn Autoplay blockiert).
- “Editor vs Vorschau” wird eindeutig und nachvollziehbar: Der Builder-Node ist eine Miniatur, aber es gibt eine echte 1:1 Preview im Editor (pixelgenau).

Was ich anhand des aktuellen Codes + Screenshot als Ursachen sehe

1) “Doppeltes Video” / Ghosting im Preview
- Dein Screenshot (großes Video + kleiner Player unten links) sieht nach zwei gleichzeitig sichtbaren Player-Instanzen aus:
  - Instanz A: Preview-Modal (VideoFunnelPreview → VideoNode isPreview=true).
  - Instanz B: Builder-Canvas (ReactFlow NodeCards), der weiterhin im DOM ist (und ggf. weiterhin sichtbar/komposited), obwohl das Modal darüber liegt.
- Auch wenn das Modal z-[9999] hat, können GPU-Compositing/Stacking-Kontexte + Video-Layer (Hardware Acceleration) dazu führen, dass ein Video-Layer “durchblutet” bzw. als “Ghost” sichtbar bleibt (besonders wenn am <video> `willChange`/`transition` gesetzt ist).

2) “Vibrieren” des gesamten Videos
Das ist sehr häufig eine Kombination aus:
- Zu viele Repaints auf einer Video-Layer-Komposition (z.B. durch animierte Schatten/Filter/Backdrops über dem Video).
- Dauer-Updates aus `timeupdate` (setState) + zusätzliche CSS-Animationen auf Overlay-Text.
- In deinem globalen CSS animiert `.text-shadow-glow` permanent (`animation: text-pulse ... infinite`). Diese Animation liegt bei Overlay-Text über dem Video und zwingt häufige Repaints. Das kann sich so anfühlen, als “zittert” das ganze Video.

3) “Buttons im Editor anders als in Vorschau”
- Im Builder-Canvas wird der VideoNode bewusst als Mini-Karte gerendert: `style={{ width: '240px', height: '426px' }}`.
- In der Vorschau ist die “Phone Simulation” deutlich größer (`400x711`), bzw. auf Mobile sogar full-screen.
- Bei festen Pixel-Buttons (z.B. XL = 240px) ist die absolute Größe zwar gleich, aber:
  - Bei “full width” (w-full) ist es zwangsläufig anders, weil “full” die Containerbreite nutzt (240 vs 400).
  - Selbst bei festen Größen wirkt es visuell anders, weil die Videofläche/Framing anders ist.
=> Wenn du wirklich “Editor = Preview”, brauchst du im Editor eine echte 1:1 Preview-Ansicht (nicht nur die Node-Karte im Flow).

Konkreter Umsetzungsplan

A) Preview technisch vollständig vom Builder isolieren (beseitigt doppeltes Video zuverlässig)
Dateien: 
- src/components/funnel/FunnelBuilder.tsx
- src/components/funnel/VideoFunnelPreview.tsx

Schritte:
1) Preview-Modal per React Portal in `document.body` rendern
   - Statt das Modal als normales JSX unter dem Builder zu rendern, in ein Portal auslagern.
   - Effekt: Das Modal ist garantiert außerhalb aller ReactFlow/Canvas/Transform/Stacking-Kontexte.
   - Damit verschwindet in der Praxis das “kleiner Player auf dem großen Video”-Artefakt.

2) Builder während Preview “inert” setzen
   - Wenn `showPreview` true:
     - ReactFlow-Container: `aria-hidden="true"` + `pointer-events-none` + optional `opacity-0` oder `visibility-hidden`
   - Effekt: Kein Klick/Focus/Scroll im Builder, keine Überlagerung, weniger Repaints.

3) Body Scroll Lock + stabile Viewport-Basis
   - Während Preview offen ist: `document.body.style.overflow = 'hidden'`
   - Beim Close: sauber zurücksetzen.
   - Effekt: keine Scrollbar-Layout-Shifts (die oft als “Jitter” wahrgenommen werden).

B) Background-Videos im Builder hart pausieren (Performance + verhindert Ghost-Layer)
Datei:
- src/components/funnel/VideoNode.tsx

Schritte:
1) In Builder-Mode (isPreview false) sicherstellen, dass Video nie spielt:
   - Bereits vorhanden: `autoPlay={!!isPreview}` und `onLoadedData` pausiert.
   - Ergänzen: ein `useEffect`, der bei `!isPreview` immer `videoRef.current?.pause()` ausführt (auch wenn das Video schon geladen ist).
   - Zusätzlich `videoRef.current.currentTime = 0` oder ein stabiler Frame (z.B. 0 oder 2s) nur einmal setzen.

2) Video CSS entschärfen (verhindert GPU-Compositing Artefakte)
   - Aktuell hat das <video> inline:
     - `willChange: 'transform, opacity'`
     - `transition: 'opacity 0.5s ... transform 0.5s ...'`
   - Entfernen bzw. auf “minimal” reduzieren (keine transform-transition am Video).
   - Effekt: deutlich weniger “Ghosting” / doppelte Frames bei Hardwarebeschleunigung.

C) “Vibrieren” abstellen, indem permanente Animationen im Preview deaktiviert werden
Dateien:
- src/index.css
- src/components/funnel/VideoNode.tsx (optional)
- src/components/funnel/SynchronizedPreview.tsx (optional)

Schritte:
1) `.text-shadow-glow` Animation im Player-Kontext abschalten
   Optionen (eine wählen):
   - (Empfohlen) Player-spezifische Klasse: z.B. am Preview-Root `data-player="true"` setzen und CSS:
     - `[data-player="true"] .text-shadow-glow { animation: none; }`
   - oder in den Komponenten im Preview-Modus den ClassName `text-shadow-glow` weglassen/ersetzen.
   Effekt: Keine kontinuierlichen Text-Shadow-Repaints über dem Video.

2) Optional: `prefers-reduced-motion` respektieren
   - Unter `@media (prefers-reduced-motion: reduce)` alle nicht notwendigen Animationen deaktivieren.
   - Das ist ein Bonus, hilft aber auch bei schwächeren Geräten.

D) Editor vs Vorschau: echte 1:1 Preview im Editor anbieten (statt Flow-Node als Referenz)
Dateien:
- src/components/funnel/NodePropertiesPanel.tsx
- (optional) src/components/funnel/SynchronizedPreview.tsx

Schritte:
1) In NodePropertiesPanel eine “Pixelgenaue Vorschau” hinzufügen
   - Statt SynchronizedPreview (vereinfachte Vorschau) eine echte VideoNode-Instanz im isPreview-Modus rendern, eingebettet in einen festen Container:
     - Desktop: 400x711
     - Mobile Toggle: w-full h-full oder 400x711 weiterhin (je nach Ziel)
   - Diese Preview nutzt exakt dieselben Dimension-Funktionen und Overlays wie der echte Player.

2) Klarer Hinweis im UI:
   - “Flow-Karte ist eine Miniatur; für 1:1 Größen bitte die Pixel-Preview nutzen.”
   - Damit ist die Erwartung sauber: du vergleichst nicht mehr “Mini-Karte” vs “Phone Player”.

E) Button-Größen-Diskrepanz bei “full width” erklären/absichern
Dateien:
- src/components/funnel/VideoNode.tsx
- src/components/funnel/NodePropertiesPanel.tsx

Schritte:
1) Wenn buttonWidth === 'full':
   - Optional: Anzeige im Editor “full = Containerbreite; im Flow-Node kleiner” (Info-Label).
2) Optional: In Pixel-Preview zusätzlich die effektive Renderbreite anzeigen (z.B. “Button: 400px in Preview”).

Test-Checkliste (End-to-End)
1) /builder?funnel=smart-trading-v6 → “Vorschau”
   - Es darf nur ein Player sichtbar sein (kein kleiner Overlay-Player).
   - Video wirkt stabil (kein Zittern).
2) Während Preview offen ist:
   - Builder ist nicht klickbar/scrollbar-shifted.
3) Buttons:
   - Im Preview erscheinen Buttons zuverlässig (bei timedVisibility im Window, sonst via Fallback).
4) Editor-Vergleich:
   - Pixel-Preview im Properties Panel vs Preview-Modal: Buttons sind identisch (selbe Breite/Höhe/Textgröße).
5) Mobile Viewport:
   - Keine GPU-Artefakte, kein Ghosting.

Risiko / Nebenwirkungen
- Portal + inert/pointer-events kann erfordern, dass Close/ESC sauber gehandhabt wird (Focus Management).
- Deaktivieren von Text-Glow-Animation reduziert “Glow-Effekt”, erhöht aber massiv Stabilität.
- Pixel-Preview in Properties Panel kann Performance kosten; daher nur rendern, wenn ein Node selektiert ist (und optional nur, wenn “Preview anzeigen” Toggle aktiv ist).

Umfang (welche Dateien ich anfassen werde)
- src/components/funnel/FunnelBuilder.tsx (Builder während Preview inert + optional Portal-Wrapper Trigger)
- src/components/funnel/VideoFunnelPreview.tsx (Portal-Rendering, data-player Flag, Scroll-Lock)
- src/components/funnel/VideoNode.tsx (Builder-Pause-Hardening, Video inline-style entschärfen, optional Preview-spezifische Klassen)
- src/components/funnel/NodePropertiesPanel.tsx (Pixelgenaue Preview mit echter VideoNode)
- src/index.css (Player-spezifisches Disable für text-shadow Animation)

Ergebnis
- Kein “Doppel-Video” mehr (Portal + Inert + Pause).
- Kein “Vibrieren” mehr (Animations-Disable + weniger GPU/Video-Transitions).
- Kein endloses “Editor vs Vorschau” Missverständnis mehr (pixelgenaue Preview direkt im Editor).
