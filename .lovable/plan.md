
## Ziel
Die Buttons sollen im Live-Embed “sauber ausgespielt” werden: Der schwarze/opacity Bereich (der Readability-Container) muss optisch zur tatsächlichen Button-Größe passen – ohne dass der Button optisch “über den Rand hinaus” skaliert.

## Was du auf den Screenshots siehst (und warum das passiert)
In deinem Funnel-Embed werden die Buttons **optisch skaliert/verschoben**, aber der Hintergrund-/Rand-Bereich richtet sich nach der **Layout-Größe** (nicht nach der optischen Transform-Größe).

Konkret passieren aktuell zwei Dinge gleichzeitig:

1) **`button-float` Animation skaliert den Button via `transform: ... scale(1.02)`**
- Das ist in `src/index.css` definiert:
  - `.button-float { animation: button-float ... }`
  - `@keyframes button-float { ... scale(1.02) }`
- Wichtig: `transform: scale(...)` macht den Button **visuell größer**, aber die “Box”, nach der sich andere Elemente ausrichten, bleibt gleich.
- Ergebnis: Der Button wirkt “zu groß” für den opacity Rand/Container.

2) **Der schwarze/opacity Hintergrund nutzt eine fixe Erweiterung `-m-4`**
- In `src/components/funnel/VideoNode.tsx` liegt hinter den Buttons ein Background-Overlay:
  - `absolute inset-0 ... -m-4 ...`
- Diese 16px “Puffer” sind fix und wirken bei größeren Buttons/Layouts proportional zu klein.

Das ist genau der Effekt “Rand ist zu klein skaliert”, auch wenn Button + Hintergrund für sich “richtig” aussehen.

## Lösung (robust, ohne Rumprobieren)
Wir machen zwei gezielte Anpassungen:

### A) Button darf nicht per Transform “größer” werden, wenn daneben ein fester Background sitzt
Option 1 (empfohlen): **`button-float` so ändern, dass er NICHT skaliert**
- Behalte nur das “Schweben” (translateY), entferne `scale(1.02)`.
- Dadurch bleibt der Button optisch innerhalb seiner Layout-Box und der Rand passt.

Option 2: `button-float` ganz entfernen (auch möglich, wenn du lieber “statisch” willst)

Zusätzlich: In `UniversalButton` die **Hover/Active-Scale** Effekte reduzieren/entfernen (z.B. `hover:scale-105`, `active:scale-95`), weil sie denselben “Button wächst, Background nicht”-Effekt erzeugen können (besonders beim Hover am Desktop).

### B) Background/Rand nicht mit `absolute + -m-4`, sondern als “echter Container” mit Padding
In `VideoNode.tsx` ersetzen wir das Overlay-Prinzip durch einen Container, der automatisch mit dem Inhalt skaliert:
- Statt:
  - Background als `absolute inset-0 -m-4`
- Neu:
  - Eine “Card” um die Interaktionen: `relative rounded-2xl p-4 (oder p-5/p-6 je nach Bedarf) bg-gradient-...`
  - Innen drin erst die Buttons/Inputs
- Vorteil: Egal ob 1 Button, 5 Buttons, Grid-Layout, 260px Breite – der Background passt immer.

## Konkrete Änderungen (Dateien)
### 1) `src/index.css`
- `@keyframes button-float` anpassen:
  - `scale(1.02)` entfernen
  - optional: translate etwas reduzieren (z.B. -4px statt -6px), damit es ruhiger ist

### 2) `src/components/funnel/UniversalButton.tsx`
- Transform-basierte Scale-Effekte entschärfen:
  - `hover:scale-105` entfernen
  - `active:scale-95` entfernen (oder durch reine Schatten/Color-Änderung ersetzen)
- Optional (falls du Animation behalten willst): `button-float` als optionalen Modus implementieren (Prop), damit man im Builder “show-off” haben kann, aber im Embed “sauber”.

### 3) `src/components/funnel/VideoNode.tsx`
- Für `button`, `multipleChoice`, `text/email`, `rating`:
  - Entferne das `absolute ... -m-4` Background-Div
  - Baue einen Wrapper:
    - `div` mit `relative`, `rounded-2xl`, `p-4/p-5/p-6`, `backdrop-blur`, und dem passenden `bg-gradient-to-*` abhängig von Position
  - Der Wrapper umschließt die Interaktionen (Buttons/Inputs) vollständig.

## Testplan (schnell & eindeutig)
1) Direkt im Live-Embed öffnen (mit Cache-Bust):
   - `/embed/<dein-funnel>?v=123`
2) Beobachten:
   - Der opacity Rand bleibt immer “größer” als die Buttons
   - Kein Moment mehr, wo Buttons optisch über den Rand hinauswachsen (auch nicht “pulsierend”)
3) Desktop: über Buttons hovern / klicken:
   - Keine Skalierung, die den Rand “sprengt”
4) Mobile:
   - Layout stabil, keine abgeschnittenen Ränder

## Ergebnis
- Buttons und Background sind visuell 1:1 “gekoppelt”
- Kein “Rand ist zu klein skaliert” mehr
- Live-Embed wirkt konsistent und professionell, unabhängig von Button-Größen/Layouts
