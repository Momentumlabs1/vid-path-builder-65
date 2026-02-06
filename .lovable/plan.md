

# Smart Trading Video Funnel V11 - Implementierungsplan

## Zusammenfassung

Komplett neue Funnel-Version mit 24 Videos, optimierter Struktur und einem neuen **Budget-Slider** Interaktionstyp. Die alte V6 (39 Videos) wird ersetzt.

---

## Hauptänderungen

| Aspekt | V6 (alt) | V11 (neu) |
|--------|----------|-----------|
| Videos gesamt | 39 | 24 |
| Intro | 6 Videos | 3 Videos |
| Anfänger | 16 Videos | 10 Videos |
| Fortgeschritten | 16 Videos | 10 Videos |
| Abschluss | 1 Video | 1 Video |
| Budget-Frage | Keine | Slider (€0-€10.000) |

---

## Neue Funktion: Budget-Slider

Es wird ein neuer `answerType: 'budgetSlider'` implementiert mit:
- Slider von €0 bis €10.000
- 5 Farbbereiche mit Labels:
  - €0-500: Wenig (rot)
  - €500-1.500: Starter (orange)  
  - €1.500-4.000: Solide (grün)
  - €4.000-7.000: Platin (cyan)
  - €7.000-10.000: Gold (gold)
- Anzeige des aktuellen Wertes
- "Weiter"-Button

---

## Technische Änderungen

### 1. Neue Datei: `src/data/smartTradingFunnel.ts`

Kompletter Neubau mit 24 Nodes:

**Intro (3 Videos):**
- V1: Begrüßung + Weiche (Erzähl mir mehr / Direkt los)
- V2a: Story + Level-Frage
- V2b: Direkt + Level-Frage

**Anfänger-Pfad (10 Videos):**
- A1: Anfänger auffangen + Frage Auslöser (3 Antworten)
- A2a/A2b/A2c: 3 Auffang-Videos + Frage Ziel
- A3a/A3b/A3c: 3 Auffang-Videos + Frage Blockade
- A4a/A4b: 2 Auffang-Videos + Budget-Slider
- A5: Resümee + Call-Buchung

**Fortgeschritten-Pfad (10 Videos):**
- F1: Fortgeschritten auffangen + Frage Situation (3 Antworten)
- F2a/F2b/F2c: 3 Auffang-Videos + Frage Problem
- F3a/F3b: 2 Auffang-Videos + Frage Ziel
- F4a/F4b/F4c: 3 Auffang-Videos + Budget-Slider
- F5: Resümee + Call-Buchung

**Abschluss (1 Video):**
- V-END: Bestätigung nach Call

### 2. VideoNode.tsx erweitern

Neuer `case 'budgetSlider':` im `renderAnswerButtons()`:

```text
- Slider-Element (€0-€10.000)
- Dynamische Farbänderung basierend auf Wert
- Label-Anzeige (Wenig/Starter/Solide/Platin/Gold)
- Aktueller Wert in €
- "Weiter"-Button
```

### 3. NodePropertiesPanel.tsx erweitern

- SelectItem für "budgetSlider" hinzufügen
- Konfigurationsoptionen:
  - Min/Max Wert
  - Schrittweite
  - Submit-Button Styling

### 4. playerTemplate.ts aktualisieren

Budget-Slider im Standalone-Export unterstützen mit:
- CSS für Slider-Styling
- JavaScript für Wertberechnung und Farbänderung

---

## Flow-Diagramm

```text
                    V1 (Begrüßung)
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
    V2a (Story)                   V2b (Direkt)
          │                             │
          └──────────────┬──────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
   A1 (Anfänger)               F1 (Fortgeschr.)
       │                             │
   ┌───┼───┐                    ┌───┼───┐
   ▼   ▼   ▼                    ▼   ▼   ▼
  A2a A2b A2c                  F2a F2b F2c
   └───┼───┘                    └───┼───┘
       │                            │
   ┌───┼───┐                    ┌───┴───┐
   ▼   ▼   ▼                    ▼       ▼
  A3a A3b A3c                  F3a     F3b
   └───┼───┘                    └───┬───┘
       │                            │
   ┌───┴───┐                ┌───────┼───────┐
   ▼       ▼                ▼       ▼       ▼
  A4a     A4b              F4a     F4b     F4c
   └───┬───┘                └───────┼───────┘
       │                            │
       ▼                            ▼
  A5 (Resümee)              F5 (Resümee)
       │                            │
       └────────────┬───────────────┘
                    ▼
               V-END (Bestätigung)
```

---

## Layout im Builder

| Bereich | X-Position | Y-Start |
|---------|------------|---------|
| Intro | CENTER (0) | 0-400 |
| Anfänger | LEFT (-500) | 600+ |
| Fortgeschritten | RIGHT (+500) | 600+ |
| Abschluss | CENTER (0) | 3000+ |

---

## Dateien die geändert werden

1. **`src/data/smartTradingFunnel.ts`** - Komplett neu schreiben
2. **`src/components/funnel/VideoNode.tsx`** - Budget-Slider hinzufügen
3. **`src/components/funnel/NodePropertiesPanel.tsx`** - Slider-Konfiguration
4. **`src/lib/export/playerTemplate.ts`** - Slider im Export

---

## Daten die gesammelt werden

**Anfänger:**
- Auslöser (Zeit/Unzufriedenheit/Inspiration)
- Ziel (Nebeneinkommen/Freiheit/Verstehen)
- Blockade (Angst/Überforderung)
- Budget (€0-€10.000)

**Fortgeschritten:**
- Situation (Verlust/Break-Even/Random)
- Problem (Strategie/Emotionen)
- Ziel (Profitabel/Prop-Firm/Vollzeit)
- Budget (€0-€10.000)

---

## Resümee-Anzeige

Am Ende jedes Pfades (A5/F5) werden die gesammelten Antworten als Overlay angezeigt, bevor zur Call-Buchung weitergeleitet wird.

