
Ziel (konkret)
- Die Button-Größen (Breite/Höhe/Textgröße) sollen in allen Kontexten identisch wirken: Builder-Editor, Builder-Vorschau und iFrame-Embed (/embed/… auf deiner Website).
- Aktuell ist es so, dass die Größen im Builder “so wie eingestellt” wirken, aber in Vorschau + iFrame-Embed sichtbar kleiner gerendert werden.

Was aktuell (sehr wahrscheinlich) der echte Grund ist
1) Die in den Einstellungen angezeigten Pixelwerte stimmen nicht mit der tatsächlichen CSS-Umsetzung überein
- In `NodePropertiesPanel.tsx` stehen die Labels z.B.:
  - Breite: XS (80px), S (120px), M (160px), L (200px), XL (240px), 2XL (280px)
  - Höhe: XS (24px), S (28px), M (36px), L (44px), XL (52px), 2XL (60px)
- In `VideoNode.tsx` werden aber aktuell deutlich kleinere Tailwind-Werte gemappt:
  - Breite: xs=60, small=100, medium=140, large=180, xl=220, 2xl=260
  - Höhe: xs≈20/24, small≈24/28, medium≈32/36, large≈40/44, xl≈48/52, 2xl≈56/60
=> Ergebnis: Egal ob Vorschau oder Embed – die Buttons sind faktisch kleiner als das, was der Editor in den Dropdowns verspricht.

2) Zusätzlich gibt es “Preview-spezifische” Breitenlogik (vw/min()), die je nach Container/iframe-Kontext nochmal anders wirken kann
- In `VideoNode.tsx` gibt es getrennte Breiten-Maps für Builder vs Preview (`getWidthClassesPreview` vs Builder).
- Im iFrame kann “vw” anders wirken als erwartet (weil sich vw auf den iFrame-Viewport bezieht). Das kann die Optik zwischen Editor und Embed weiter auseinanderziehen.

3) Preview/Embed Container-Layout ist künstlich auf “Telefongröße” begrenzt (Desktop)
- `VideoFunnelPreview.tsx` nutzt auf Desktop aktuell eine fixe “Device-Simulation”: `w-[400px] h-[711px]`.
- Das ist ok für Builder-Vorschau, aber im echten Embed willst du oft “so groß wie möglich” innerhalb der iFrame-Höhe/Breite – sonst wirkt alles kleiner.

Warum du es “überall” siehst (auch in Lovable Vorschau und extern)
- Weil dieselbe Runtime-Komponente `VideoNode.tsx` + die falschen Mappings + Preview/Embed Layout-Constraints in beiden Fällen greifen.

Vorgehen zur Lösung (ohne weitere Trial-and-Error-Schleifen)

A) Größen-Mappings korrigieren (Single Button, Multiple Choice, Text/Email Submit, Rating Submit)
Datei: `src/components/funnel/VideoNode.tsx`
- Breiten-Mapping auf exakt die Werte anpassen, die im Editor angezeigt werden:
  - xs 80px, small 120px, medium 160px, large 200px, xl 240px, 2xl 280px, full = 100% (mit sinnvoller max-width Begrenzung)
- Höhen-Mapping auf exakt die Werte anpassen:
  - xs 24px, small 28px, medium 36px, large 44px, xl 52px, 2xl 60px
- Textgrößen-Mapping: xs 10px, small 12px, medium 14px, large 16px (passt bereits, wird aber sauber vereinheitlicht)

Technischer Hinweis (wichtig für Stabilität)
- Damit “exakte Höhe” wirklich stimmt, wird nicht mehr gleichzeitig “h-…” und “py-…” gemischt, weil Padding die effektive Höhe verfälschen kann.
- Stattdessen: feste Height + `px-…` + `leading-none`/`leading-tight` je nach Textgröße, und die Vertikalzentrierung über `flex items-center justify-center` (die ist bei UniversalButton ohnehin da).

B) Preview- und Builder-Logik vereinheitlichen (keine zwei unterschiedlichen Breiten-Systeme)
Datei: `src/components/funnel/VideoNode.tsx`
- `getWidthClassesPreview` entfernen bzw. so umbauen, dass Preview und Builder dieselbe “Pixel-Truth” nutzen.
- Für “full” und Multiple-Choice-Layouts wird stattdessen der Container begrenzt:
  - z.B. `w-full` plus `max-w-[520px]` (damit es auf sehr großen Screens nicht unendlich breit wird, aber trotzdem groß genug ist).
- Das verhindert, dass Preview/Embed heimlich “anders” skaliert als Editor.

C) Desktop Embed größer machen (ohne Builder-Vorschau kaputt zu machen)
Dateien:
- `src/components/funnel/VideoFunnelPreview.tsx`
- `src/pages/EmbedViewer.tsx`
- (optional) `src/pages/FunnelViewer.tsx`

Plan:
1. `VideoFunnelPreview` bekommt einen Modus/Flag, z.B. `mode: 'builderPreview' | 'embed'`.
2. Builder-Vorschau (im FunnelBuilder) nutzt weiterhin “Device-Simulation” (400x711), weil das fürs Bauen praktisch ist.
3. Embed (/embed/…) nutzt “Fit-to-iframe”:
   - Container wird so groß wie möglich, z.B. `h-[100dvh] w-full` (oder bei inline iFrame: `h-full w-full`)
   - und optional mit `max-width`/`aspect-[9/16]`, damit es “wie ein Telefon” bleibt, aber maximal groß innerhalb der iFrame-Höhe wird.
=> Dadurch wird der Embed nicht künstlich klein gehalten, vor allem auf Desktop.

D) “Fixed inset-0” in `VideoNode` Preview entschärfen (iFrame-Kompatibilität)
Datei: `src/components/funnel/VideoNode.tsx`
- Aktuell nutzt `VideoNode` in bestimmten Preview-Fällen `fixed inset-0`.
- In iFrames (inline embeds) ist “fixed” oft der Startpunkt für Layout-Überraschungen.
- Anpassung: In Preview/Embed soll `VideoNode` primär `w-full h-full relative` sein und die Größe immer vom Parent (VideoFunnelPreview/EmbedViewer) bekommen.
=> Das macht die Rendergröße deterministisch.

E) Debug-Schalter (nur kurzfristig), um endlich 100% sicher zu sehen was passiert
Dateien: `VideoNode.tsx` und/oder `VideoFunnelPreview.tsx`
- Per Query Param `?debugSizing=1` wird ein kleines Overlay angezeigt:
  - Container-Breite/Höhe
  - aktuelle buttonWidth/buttonHeight/buttonTextSize Werte
  - resultierende CSS-Klassen
=> Damit können wir in 1 Durchlauf verifizieren, dass Editor-Einstellung == Preview == Embed.

Abnahmekriterien (was “gelöst” bedeutet)
- Wenn du im Editor z.B. “2XL (280px)” wählst, ist die Button-Breite in Preview und im iFrame-Embed ebenfalls 280px (bzw. bei “full” 100% bis max-w).
- Höhe “2XL (60px)” ist sichtbar identisch in Preview + Embed.
- Desktop Embed ist nicht mehr künstlich in 400x711 “klein” gefangen, sondern füllt sinnvoll den iFrame (bzw. den Viewport), ohne dass Buttons wieder kleiner wirken.

Testplan (End-to-End, damit wir nicht wieder im Kreis laufen)
1) Builder:
- Im Builder einen Video-Node mit gut sichtbaren Settings nehmen (z.B. 2XL Breite, 2XL Höhe, large Text).
- Screenshot vom Node (Editor) + “Vorschau” Modal.

2) Embed intern:
- Direkt `/embed/smart-trading-v6` öffnen auf Desktop und Mobile.
- Prüfen: Button/Opacity (falls noch vorhanden) und Button-Größen identisch.

3) Externe Website iFrame:
- iFrame mit z.B. 600px Höhe und einmal mit 100vh (wenn möglich) testen.
- Prüfen: Buttons bleiben gleich groß gemäß Settings; Container nutzt den verfügbaren Platz.

Welche Dateien ich im Implementierungs-Schritt anfassen werde
- `src/components/funnel/VideoNode.tsx` (Hauptfix: korrekte Pixel-Mappings + Preview/Embed Vereinheitlichung + fixed-Layout entschärfen)
- `src/components/funnel/VideoFunnelPreview.tsx` (Embed vs BuilderPreview Containerlogik)
- `src/pages/EmbedViewer.tsx` (Embed-Modus aktivieren)
- optional `src/pages/FunnelViewer.tsx` (falls /funnel/… ebenfalls konsistent sein soll)

Risiken / Edge Cases (eingerechnet)
- Tailwind hat nicht für alle Zwischenwerte (44/52/60) Standardklassen: wir nutzen dann `h-[44px]` etc.
- iFrame-Height (600px) begrenzt immer das Gesamtlayout; wir sorgen aber dafür, dass innerhalb dieser Begrenzung die Buttons korrekt groß sind, statt “heimlich” kleiner.

Nächster Schritt nach deiner Freigabe
- Ich implementiere exakt diese Vereinheitlichung (A–D) und lasse den Debug-Schalter (E) kurz drin, bis du bestätigst, dass Editor == Preview == Embed wirklich identisch sind. Danach kann der Debug-Schalter wieder raus.