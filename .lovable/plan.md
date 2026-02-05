
## Ziel
Zwei Probleme zuverlässig lösen:
1) Änderungen am Funnel kommen auf der Website (Embed) nicht an (es bleibt “alt”).
2) Progressbar im Video-Embed funktioniert nicht.

---

## Was ich im Code/Backend gefunden habe (harte Fakten)
### 1) “Alt auf Website” ist sehr wahrscheinlich Caching + fehlende “Version/Updated”-Sichtbarkeit
- Du bettest per **iFrame** ein.
- Wenn du die **direkte Live-Embed-URL** öffnest, ist es ebenfalls “alt” → das ist nicht nur deine Website-Einbindung, sondern betrifft die Embed-Route selbst (sehr oft Browser/CDN Cache von `/embed/...` bzw. `index.html`).
- Aktuell gibt es **keinen** sichtbaren “welche Version wurde geladen?”-Hinweis im Embed, dadurch wirkt es wie “er speichert nicht”, auch wenn Daten/Code ggf. schon anders sind.

### 2) Progressbar: Video läuft im Embed nicht zuverlässig an → timeupdate feuert nicht → Progress bleibt 0
In `src/components/funnel/VideoNode.tsx`:
- `muted={!isPreview}` und `autoPlay={!isPreview}`
- Im Embed ist `isPreview: true` (kommt aus `VideoFunnelPreview`)
- Ergebnis: **im Embed ist das Video nicht muted und nicht autoplay**  
  Browser blocken Autoplay mit Audio, und da das Video außerdem `pointer-events-none` + `controls={false}` hat, kann der Nutzer nicht sauber starten → dadurch läuft das Video nicht → Progressbar bleibt stehen.

Das ist sehr wahrscheinlich der Hauptgrund, warum die Progressbar “nicht funktioniert”.

---

## Lösung-Design (robust, damit du nicht mehr raten musst)
Wir machen drei Dinge:

### A) “Immer neu laden” für Embeds (Cache-Busting)
Damit alte Cached-Versionen nicht hängen bleiben:
1. **EmbedCodeGenerator**: iFrame-Code bekommt automatisch einen `v=` Parameter (z.B. Timestamp oder Funnel-UpdatedAt), z.B.  
   `.../embed/smart-trading-v6?v=1700000000000`
2. **public/embed.js** (für Leute die JS-Widget nutzen): `createIframe()` hängt ebenfalls automatisch `v=` an (oder nutzt `config.version`).

Zusätzlich:
3. **EmbedViewer Debug-Overlay (optional per `?debug=1`)**: zeigt rechts oben:
   - funnel name
   - loaded `updated_at`
   - node/edge count  
   Damit ist sofort klar: “Welche Version sehe ich gerade?”

### B) Backend/DB: “updated_at” muss verlässlich mitlaufen + Upsert stabilisieren
Aktuell gibt es eine DB-Funktion `update_updated_at_column()`, aber **keinen Trigger**.
Wir ergänzen:
1. Trigger auf `funnels`, damit `updated_at` bei jedem Update automatisch korrekt ist.
2. Optional aber sehr empfohlen: **Unique-Constraint/Index** auf `funnels.name`, damit Upsert/Update nie in komische Zustände laufen kann und wir uns auf “genau 1 Funnel pro Name” verlassen können.

Warum das hilft:
- `updated_at` ist dann die echte “Version”. Perfekt für Cache-Busting und Debug.
- Unique auf `name` verhindert doppelte Records (die später “alt” wirken können, je nachdem welcher zuerst gelesen wird).

### C) Video/Progressbar fix (Autoplay-kompatibel, mit Unmute)
1. Im Embed/Preview-Mode:
   - `autoPlay` muss **true** sein
   - `muted` muss initial **true** sein (sonst blockt der Browser)
   - Danach bieten wir einen kleinen “Ton an”-Button (Unmute) an, wenn der User tippt/klickt.
2. Progressbar-Update nicht nur über `timeupdate`, sondern zusätzlich:
   - `loadedmetadata` / `durationchange` setzt Duration
   - `timeupdate` + optional `requestAnimationFrame` fallback während “playing”
3. `pointer-events-none` am Video im Preview entfernen oder mindestens einen Overlay-Play/Unmute CTA hinzufügen, damit es auf Mobile sicher startet.

---

## Konkrete Umsetzungsschritte (Dateien + Änderungen)
### 1) Datenbank-Migration (Lovable Cloud)
- Trigger für `updated_at` auf `public.funnels`
- Unique constraint/index auf `public.funnels(name)` (wenn noch nicht vorhanden)

SQL (Konzept):
- `create trigger set_timestamp before update on public.funnels for each row execute function public.update_updated_at_column();`
- `create unique index if not exists funnels_name_unique on public.funnels(name);`

### 2) EmbedViewer: Debug + “Version” laden
Datei: `src/pages/EmbedViewer.tsx`
- Query erweitert: `select('structure, is_public, updated_at')`
- State: `updatedAt`
- Wenn URL `?debug=1`: kleines Overlay rendern mit `updatedAt`, nodes/edges count

### 3) Cache-Busting in Embed Codes (wichtig für iFrame)
Datei: `src/components/funnel/EmbedCodeGenerator.tsx`
- iFrame URL: immer `v=` anhängen (z.B. `Date.now()` oder später `updated_at` aus Builder)
- Optional: Toggle “Cache-Busting aktiv” im UI

### 4) Cache-Busting im JS-Widget
Datei: `public/embed.js`
- In `createIframe()`:
  - `params.append('v', config.version || Date.now())` (ohne etwas kaputt zu machen)
- Damit werden auch JS-Embeds automatisch “frisch” geladen.

### 5) Video/Progressbar Fix
Datei: `src/components/funnel/VideoNode.tsx`
- Video props im Preview:
  - `muted={true}` (initial)
  - `autoPlay={true}`
  - `playsInline` beibehalten
- Fortschritt:
  - Duration in `onLoadedMetadata`/`onDurationChange` setzen
  - `timeupdate` bleibt, aber nicht ausschließlich davon abhängig sein
- Optional UI:
  - kleiner “Ton an”-Button (setzt `video.muted=false` nach User-Interaktion)
  - wenn Play fehlschlägt: Overlay “Tippe zum Starten”

---

## Testplan (End-to-End, ohne Ratespiel)
1. Im Builder: Funnel veröffentlichen.
2. Direkt öffnen:
   - `https://.../embed/smart-trading-v6?debug=1&v=123`
   - Prüfen, ob Overlay `updated_at` aktuell ist und Button-Design stimmt.
3. Deine Website iFrame aktualisieren:
   - iFrame `src` um `?v=...` ergänzen (oder neuen Code aus Generator kopieren).
4. Progressbar:
   - Embed auf Mobile + Desktop testen
   - Prüfen: Video startet (muted) automatisch, Progressbar läuft
   - Ton optional per Klick aktivierbar

---

## Risiken / Edge Cases
- Falls du aktuell auf deiner Website ein fixes iFrame ohne `v=` nutzt, kann der Browser die Seite sehr aggressiv cachen. Cache-Busting löst das dauerhaft.
- Autoplay mit Ton ist auf iOS/Chrome fast immer blockiert. Muted-Autoplay + Unmute-Button ist der Standard-Fix.

---

## Ergebnis
- Funnel-Änderungen erscheinen zuverlässig, auch bei aggressivem Cache.
- Du kannst jederzeit sehen, welche Version/`updated_at` du im Embed wirklich lädst.
- Video startet im Embed stabil, Progressbar funktioniert sauber.
