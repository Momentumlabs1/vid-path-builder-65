
Ziel: Vorschau (Preview) soll stabil laufen (kein “Vibrieren”, kein “doppeltes Video”) und Interaktionen (Buttons/Inputs) zuverlässig sichtbar sein – ohne dass Editor/Preview/Live unterschiedliche Layout- oder Playback-Logik haben.

## Was ich im Code als Root-Causes sehe (konkret, reproduzierbar)
### A) Preview-Layout verursacht “doppeltes Video”/Overlays (Mobile)
In `src/components/funnel/VideoNode.tsx` wird bei `isPreview && window.innerWidth < 768` der äußere Wrapper auf **`fixed inset-0 bg-black`** gesetzt:
- `VideoFunnelPreview` ist bereits ein Fullscreen-Overlay (`fixed inset-0 ... z-50`)
- `VideoNode` erzeugt dann **nochmal** ein eigenes Fullscreen-Fixed-Layer (ohne eigenes z-index)
⇒ Ergebnis: zwei übereinanderliegende Vollbild-Layer, die je nach Stacking Context flackern/“vibrieren” und wie “doppeltes Video” wirken können. Außerdem kann das die Button-Overlays “verschlucken”, weil die Ebenen gegeneinander arbeiten.

### B) Autoplay/Muted ist aktuell “umgedreht” und bricht Preview-Laufzeit + TimedVisibility
In `VideoNode.tsx` beim `<video>`:
- `muted={!isPreview}`  → im Preview **unmuted**
- `autoPlay={!isPreview}` → im Preview **kein autoplay**
Gleichzeitig wird im Preview zwar in `onCanPlay/onLoadedData` `play()` aufgerufen, aber unmuted Autoplay wird sehr häufig blockiert.
⇒ Wenn Video nicht zuverlässig läuft, feuert `timeupdate` nicht sauber → TimedVisibility/Progress/“Buttons erscheinen zu Zeitpunkt X” wird unzuverlässig. Das führt für dich zu “ich sehe gar keine Buttons”.

### C) Background-Builder-Videos laufen weiter und können über dem Modal liegen
Im Builder-Modus (`isPreview = false`) ist aktuell `autoPlay` aktiv (weil `autoPlay={!isPreview}`), d.h. **im Canvas laufen Videos** während das Preview-Modal offen ist.
Zusammen mit einem relativ niedrigen Modal-z-index (`z-50`) kann das:
- wie ein zweites Video “oben drüber” aussehen (ReactFlow kann hohe z-index Werte haben)
- CPU/GPU Last erzeugen → “Vibrieren”, Jitter, Flackern

## Geplante Änderungen (ohne Feature-Diskussion, reine Bugfixes)
### 1) Preview-Layout: VideoNode darf niemals selbst “fixed fullscreen” sein
**Datei:** `src/components/funnel/VideoNode.tsx`  
**Änderung:** Wrapper-Klassen so umstellen, dass `isPreview` immer “container-driven” ist:
- Entfernen von `fixed inset-0` für Preview komplett
- Preview-Wrapper stattdessen immer: `w-full h-full relative bg-black overflow-hidden`
- Desktop/Mobile-Unterscheidung im VideoNode nicht über `window.innerWidth` im Render steuern (wenn nötig, dann rein über Props/Container)

**Erwarteter Effekt:** Kein doppeltes Vollbild-Layer mehr, Buttons liegen zuverlässig im selben Stacking-Kontext wie das Video.

### 2) Playback-Policy: Preview/Embed muss autoplay + muted starten (Browser-Regeln)
**Datei:** `src/components/funnel/VideoNode.tsx`  
**Änderung am `<video>`:**
- Preview: `autoPlay={true}` und `muted={true}` (initial), `playsInline`
- Builder: `autoPlay={false}` (damit der Canvas im Hintergrund nicht “läuft”)
- Zusätzlich: Play-Start in Preview zentralisieren (nicht doppelt in `onCanPlay` und `onLoadedData`), z.B. über einen einzigen, gut geclearten `useEffect`, der bei `data.videoUrl` + `isPreview` genau einmal `video.play()` versucht (muted), und bei Fail nicht in einen Loop gerät.

**Erwarteter Effekt:** Video läuft stabil in Preview, `timeupdate` feuert stabil, TimedVisibility kann funktionieren, UI flackert nicht.

### 3) Buttons “nie sichtbar”: harte Sicherheits-Fallbacks für Preview
**Datei:** `src/components/funnel/VideoNode.tsx`  
**Änderung an der Button-Sichtbarkeitslogik:**
- Wenn `isPreview` und das Video nach kurzer Zeit nicht “playing” ist bzw. `timeupdate` nicht kommt: Buttons nicht dauerhaft blockieren.
- Für TimedVisibility: Wenn Autoplay/Playback scheitert, sollen Buttons **nicht** unsichtbar bleiben (du hattest das teilweise schon mit dem 1.5s Fallback, ich würde das robuster machen: statt nur `didReceiveTimeUpdate` zusätzlich `video.readyState`/`paused`/`currentTime` prüfen).
- Für Delay: Delay nur anwenden, wenn Video wirklich läuft (nicht nur `videoUrl` gesetzt). Sonst sofort sichtbar.

**Erwarteter Effekt:** In Preview siehst du immer Buttons; TimedVisibility/Delay verhalten sich nur dann “streng”, wenn Playback tatsächlich läuft.

### 4) Modal wirklich über alles legen (Z-Index / Stacking Context)
**Datei:** `src/components/funnel/VideoFunnelPreview.tsx`  
**Änderung:** Root-Wrapper von `z-50` auf sehr hoch (z.B. `z-[9999]`) + `isolation:isolate` (Tailwind: `isolate`) und explizit `pointer-events-auto`.
Optional: Body-Scroll lock während Preview offen ist (verhindert “Layout shift”/Jitter durch Scrollbars).

**Erwarteter Effekt:** ReactFlow-Canvas/Nodes können das Modal nicht mehr überdecken; “doppeltes Video” durch Überlagerung verschwindet.

### 5) Builder-Performance: Canvas-Videos nicht im Hintergrund abspielen
**Datei:** `src/components/funnel/VideoNode.tsx`  
**Änderung:** Im Builder-Modus kein Autoplay; optional nur ein Standbild oder Play-Overlay (wie ohnehin vorhanden).  
**Erwarteter Effekt:** Kein Background-Rendering, weniger GPU-Last, “Vibrieren” reduziert.

## Testplan (damit wir’s sicher abhaken können)
1) Im Builder auf “Preview” klicken:
   - Es darf nur **ein** Video sichtbar sein (kein zweites Canvas-Video drüber/drunter).
   - Buttons müssen sichtbar sein (sofort, wenn Delay/TImedVisibility nicht sinnvoll greifen kann).
2) Mobile Breite (Lovable Device Toggle) + Preview:
   - Kein Flackern/Jitter, Buttons weiterhin sichtbar.
3) Node mit TimedVisibility:
   - Wenn Video spielt: Buttons erscheinen im Fenster.
   - Wenn Video nicht spielt: Buttons werden nach kurzer Fallback-Zeit trotzdem sichtbar (keine “endlose Unsichtbarkeit”).
4) Live/Embed Route (`/embed/...`):
   - Autoplay startet (muted), UI stabil, keine doppelten Ebenen.

## Dateien, die ich anfassen werde
- `src/components/funnel/VideoNode.tsx` (Hauptfix: Layout + Autoplay/Muted + robuste Fallbacks)
- `src/components/funnel/VideoFunnelPreview.tsx` (Modal z-index + optional scroll lock)

## Risiko / Nebenwirkungen
- Sound startet nicht automatisch (Browser-Policy). Korrekt ist: Start muted, optional späterer Unmute-Button (kann ich als Folge-Task ergänzen, sobald Preview wieder stabil ist).
- TimedVisibility ist nur dann exakt simulierbar, wenn das Video wirklich läuft; sonst greifen Fallbacks (damit du nicht “blind” debuggen musst).

