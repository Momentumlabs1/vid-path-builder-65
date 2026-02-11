

# Dropdown-Text endgueltig sichtbar machen

## Was bisher schief lief
Die CSS-Overrides in `index.css` werden von Tailwind-Klassen in der `SelectItem`-Komponente ueberschrieben. Konkret: `focus:bg-accent focus:text-accent-foreground` und `data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground` setzen helle Theme-Farben, die hoehere Spezifitaet haben als die globalen CSS-Regeln.

## Was jetzt geaendert wird

### 1. SelectItem in `src/components/ui/select.tsx` (Zeile 119)
Die problematischen Tailwind-Klassen werden durch dunkle Farben ersetzt:

Vorher:
```
focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground
```

Nachher:
```
focus:bg-zinc-700 focus:text-white data-[highlighted]:bg-zinc-700 data-[highlighted]:text-white
```

### 2. Alle SelectContent in `src/components/funnel/NodePropertiesPanel.tsx`
Jede `SelectContent className="bg-zinc-800 border-zinc-700"` bekommt zusaetzlich `text-white`, damit die Textfarbe direkt vererbt wird -- als doppelte Absicherung.

## Ergebnis
- Alle Dropdown-Eintraege zeigen weissen Text auf dunklem Hintergrund
- Hover/Focus zeigt `zinc-700` mit weissem Text
- Kein Ueberschreiben durch Theme-Farben mehr moeglich
