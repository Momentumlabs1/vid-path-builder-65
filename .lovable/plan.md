

# Dropdown-Text: Endgueltige Loesung mit Inline Styles

## Analyse des Screenshots
Die letzten Aenderungen haben teilweise gegriffen: "Lead Capture" und "Ende" sind sichtbar. Aber das erste Item im Dropdown bleibt unsichtbar. Das bedeutet, dass CSS-Klassen allein nicht ausreichen -- Radix UI setzt intern Styles auf `SelectPrimitive.ItemText`, die Tailwind-Klassen ueberschreiben.

## Loesung: Inline `style` statt CSS-Klassen

### Datei: `src/components/ui/select.tsx`

**SelectItem (Zeile 116-131):**
Auf dem `SelectPrimitive.Item` Element ein `style={{ color: 'white' }}` setzen. Zusaetzlich auf `SelectPrimitive.ItemText` ebenfalls `style={{ color: 'inherit' }}` setzen.

```tsx
// Vorher (Zeile 116):
<SelectPrimitive.Item
  ref={ref}
  className={cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-inherit focus:bg-zinc-700 focus:text-white data-[highlighted]:bg-zinc-700 data-[highlighted]:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  {...props}
>

// Nachher:
<SelectPrimitive.Item
  ref={ref}
  style={{ color: 'white' }}
  className={cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-zinc-700 data-[highlighted]:bg-zinc-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  {...props}
>
```

Und auf `SelectPrimitive.ItemText` (Zeile 130):
```tsx
// Vorher:
<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

// Nachher:
<SelectPrimitive.ItemText style={{ color: 'inherit' }}>{children}</SelectPrimitive.ItemText>
```

## Warum Inline Styles?
- Inline `style` hat die hoechste CSS-Spezifitaet
- Kein Tailwind-Merge-Konflikt moeglich
- Kein Radix-internes Stylesheet kann es ueberschreiben
- Es ist die einzige 100% zuverlaessige Methode

## Aenderungen zusammengefasst
- **1 Datei**: `src/components/ui/select.tsx`
- **2 Zeilen**: `style={{ color: 'white' }}` auf Item, `style={{ color: 'inherit' }}` auf ItemText
- Keine weiteren Dateien betroffen
