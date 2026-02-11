

# Dropdown-Text Fix: Die ECHTE Ursache

## Problem
In `SelectContent` (select.tsx, Zeile 76) steht die Basis-Klasse `text-popover-foreground`. Diese setzt die Textfarbe auf einen dunklen Wert aus dem hellen Theme (`hsl(222.2, 84%, 4.9%)` = fast schwarz).

Wenn per `className="... text-white"` die Farbe ueberschrieben werden soll, erkennt `tailwind-merge` (die `cn()`-Funktion) den Konflikt zwischen `text-popover-foreground` (Custom-Farbe) und `text-white` (Standard-Farbe) **nicht**. Beide Klassen bleiben im Output, und `text-popover-foreground` gewinnt wegen der CSS-Reihenfolge.

Dasselbe gilt fuer `bg-popover` vs `bg-zinc-800`.

## Loesung

### Datei: `src/components/ui/select.tsx` (SelectContent, Zeile 76)

Aus der Basis-Klasse die Theme-abhaengigen Farben entfernen:

**Vorher:**
```
"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ..."
```

**Nachher:**
```
"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md ..."
```

Ohne `bg-popover` und `text-popover-foreground` in der Basis greifen die per `className` uebergebenen Werte (`bg-zinc-800`, `text-white`) direkt und ohne Konflikt.

Als Fallback fuer den Fall, dass irgendwo kein explizites `className` gesetzt ist, werden stattdessen neutrale Defaults eingesetzt:

```
"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-zinc-900 text-white shadow-md ..."
```

### Warum das diesmal funktioniert
- Kein Tailwind-Merge-Konflikt mehr: `bg-zinc-900` vs `bg-zinc-800` und `text-white` vs `text-white` werden korrekt dedupliziert
- Die per `className` uebergebenen Werte gewinnen immer, weil `cn()` identische Utility-Typen korrekt merged
- Alle bestehenden `SelectContent className="bg-zinc-800 border-zinc-700 text-white"` im NodePropertiesPanel funktionieren sofort

### Kein weiterer Aenderungsbedarf
- `SelectItem` hat bereits `text-inherit` + `focus:bg-zinc-700 focus:text-white` (korrekt)
- `NodePropertiesPanel.tsx` hat bereits `text-white` auf allen SelectContent (korrekt)
- `index.css` CSS-Overrides bleiben als zusaetzliche Sicherheit bestehen

