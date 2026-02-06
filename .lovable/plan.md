
## Was gerade passiert (warum du nur 1 Video siehst)
Der aktuelle Standalone-Export ist im Player-Template noch “zu simpel” im Vergleich zur echten Funnel-Logik im Builder.

Konkret:
- In deinem Builder sind Video-Nodes oft **`answerType: "button"`** (ein einzelner CTA-Button) und die Weiterleitung läuft über **`nextNodes.default`** oder andere Keys.
- Das exportierte Template rendert Buttons aktuell aber fast nur, wenn **`answers[]`** gefüllt ist – bei `answerType: "button"` ist `answers` normalerweise leer → **kein Button sichtbar**.
- Beim Video-Ende springt der Export nur dann weiter, wenn es eine **Edge** gibt. Viele Funnels haben aber **keine Edges**, sondern nur `nextNodes` → dann bleibt er nach dem ersten Video stehen.

Ergebnis: Du siehst ein Video, und danach passiert nichts.

## Ziel
Der exportierte Standalone-Player soll die **gleiche Funnel-Logik** unterstützen wie eure Preview:
- `answerType`: `button`, `multipleChoice`, `yesno`, `text`, `email`, `rating`, `none`
- Routing:
  - primär über `nextNodes` (z.B. `default`, `yes`, `no`, `0`, `1`, …, `low/medium/high`)
  - sekundär über Edges
  - letzter Fallback: “nächstes Video” anhand einer stabilen Reihenfolge (Positionen)

## Umsetzung (Änderungen)
### 1) `src/lib/export/playerTemplate.ts` (Hauptfix)
#### A) Button-Rendering vollständig machen
Erweitern von `renderButtons(...)` bzw. Umbau zu `renderInteraction(node)`:
- **answerType = "button"**
  - Button-Text: `node.data.buttonText || "Weiter"`
  - Klick ruft `handleAnswer("continue", "button")` auf
  - Keine Abhängigkeit von `answers[]`

- **answerType = "multipleChoice"**
  - Buttons aus `node.data.answers[]`
  - Klick übergibt **Index** (0,1,2…) wie im echten Funnel
  - Routing nutzt `nextNodes[index]`

- **answerType = "yesno"**
  - Zwei Buttons: Text aus `yesText/noText` (Fallback “Ja/Nein”)
  - Klick übergibt boolean `true/false`
  - Routing nutzt `nextNodes["yes"]` oder `nextNodes["no"]`

- **answerType = "text" | "email"**
  - Input + Submit
  - Submit übergibt den tatsächlichen Text
  - Routing nutzt `nextNodes.default` (oder Edge/Fallback)

- **answerType = "rating"**
  - Sterne + Submit
  - Routing unterstützt `nextNodes.low` (1–2), `nextNodes.medium` (3–4), `nextNodes.high` (5) – sonst `default`

- **answerType = "none"**
  - Keine Buttons. Video soll am Ende automatisch weiter.

#### B) Routing-Algorithmus “wie im Builder”
Ersetzen/Erweitern von `handleAnswer()`:
1. Bestimme `nextNodeId` über `nextNodes` passend zum `answerType`:
   - multipleChoice: `nextNodes[index]`
   - yesno: `nextNodes[answer ? "yes" : "no"]`
   - rating: `low/medium/high` oder `default`
   - sonst: `default`
2. Wenn nicht gefunden: nimm **Edge** (erste outgoing Edge)
3. Wenn immer noch nicht gefunden: nimm **sequenziellen Fallback** (nächster Node in einer sortierten Reihenfolge)
4. Wenn gar nichts: zeige End-Screen/Completed

#### C) Autoadvance korrekt machen
Aktuell: Autoadvance passiert, wenn `answers[]` leer ist – das ist falsch bei `answerType="button"` (da will man klicken).
Neu:
- Autoadvance nur, wenn `answerType === "none"` (oder wenn wirklich keine Interaktion konfiguriert ist, z.B. multipleChoice ohne answers).
- Bei `button/multipleChoice/yesno/text/email/rating`: **nicht** automatisch weiterlaufen, außer du willst optional eine “auto-advance after end” Option.

#### D) Button-Timing (wichtig bei dir)
Im Builder gibt es:
- `delaySeconds`
- `timedVisibility + visibilityStartTime + visibilityDuration`

Der Export nutzt aktuell `delayBeforeButtons` (anderer Key).
Neu:
- Player liest vorrangig `delaySeconds`
- Unterstützt zusätzlich `timedVisibility`-Fenster
- `delayBeforeButtons` bleibt als Fallback kompatibel

### 2) `src/lib/export/generateStandalonePlayer.ts` (Stabilere Reihenfolge für Fallback)
Damit der sequenzielle Fallback sinnvoll ist, definieren wir eine robuste Reihenfolge:
- `nodeOrder = nodes ohne start`, sortiert nach `position.y` dann `position.x`
- Im Player wird “nächster Node” über diese Reihenfolge bestimmt (nicht über zufällige Array-Reihenfolge)

(Keine Änderungen an Funnel-Daten nötig – Positionen sind ja bereits drin.)

### 3) Optional: bessere Kompatibilität für Farben/Styles
Viele Nodes nutzen Farbnamen (purple/green/blue…) oder pro-Option Keys (`mcColor_0`, …).
Minimal (funktional): Standardfarben wie jetzt.
Optional Upgrade:
- Mapping Farbnamen → Hex
- multipleChoice: pro-Option background setzen

## Test-Checkliste (End-to-End)
1. Funnel mit `answerType="button"` exportieren:
   - CTA-Button erscheint
   - Klick geht zum nächsten Video (über `nextNodes.default` oder Edge)
2. Funnel mit `multipleChoice`:
   - Buttons erscheinen
   - Klick auf Option A/B führt korrekt in unterschiedliche Nodes
3. Funnel mit `yesno`:
   - Ja/Nein führt zu den konfigurierten Nodes
4. `delaySeconds`:
   - Buttons erscheinen erst nach der eingestellten Zeit
5. `timedVisibility`:
   - Buttons erscheinen nur im Zeitfenster + optional Countdown (kann später ergänzt werden)
6. Ohne Edges (nur nextNodes):
   - Funnel läuft trotzdem vollständig durch
7. Webhook:
   - Bei jedem Klick kommt ein `type: "answer"` Event
   - Bei LeadCapture ein `type: "lead"`
   - Am Ende `type: "completed"`

## Ergebnis danach
Du kannst den Funnel wirklich “fertig als Code” exportieren, einfügen – und er verhält sich wie hier im Builder:
- gleiche Buttons
- gleiche Verzweigungen
- gleiche Delay/Timing-Logik
- Daten gehen sauber per Webhook raus
