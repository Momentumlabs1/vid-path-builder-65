

# Plan: Smooth Video Transitions + Progress Bar + Gelbe Button-Farbe

## Übersicht

Du möchtest drei Verbesserungen:
1. **Smoothere Übergänge** zwischen Videos
2. **Video Progress Bar** oben, passend zur Videolänge und in der gleichen Farbe wie die Buttons
3. **Gelb** als zusätzliche Button-Farbe

## Technische Umsetzung

### 1. Smooth Video Transitions

**Problem**: Beim Wechsel zwischen Videos gibt es einen kurzen "Flicker" weil das neue Video erst laden muss.

**Lösung in `VideoFunnelPreview.tsx`**:
- Crossfade-Animation beim Node-Wechsel implementieren
- Das alte Video kurz ausblenden während das neue eingeblendet wird
- CSS-Transition mit `opacity` und `transform` für einen eleganten Übergang
- `preload="auto"` für schnelleres Laden

**Neue CSS-Klassen in `index.css`**:
```css
.video-crossfade-enter {
  animation: video-fade-in 0.5s ease-out forwards;
}

@keyframes video-fade-in {
  from { opacity: 0; transform: scale(1.02); }
  to { opacity: 1; transform: scale(1); }
}
```

### 2. Video Progress Bar

**Implementation in `VideoNode.tsx`**:
- Progress Bar am oberen Rand des Videos (während Preview)
- Berechnung: `(currentTime / duration) * 100`
- Farbe dynamisch basierend auf `data.buttonColor`
- Höhe: 3px, abgerundete Ecken
- Sanfte Animation beim Fortschritt

```text
┌────────────────────────────────────┐
│ ████████████░░░░░░░░░░░ Progress   │  ← 3px hoch, Farbe = Button-Farbe
│                                    │
│          [VIDEO]                   │
│                                    │
│        [Button]                    │
└────────────────────────────────────┘
```

**Farbzuordnung**:
| Button Color | Progress Bar Color |
|-------------|-------------------|
| purple | bg-purple-500 |
| blue | bg-blue-500 |
| green | bg-green-500 |
| orange | bg-orange-500 |
| red | bg-red-500 |
| white | bg-white |
| yellow (NEU) | bg-yellow-500 |

### 3. Gelb als Button-Farbe

**Datei 1: `UniversalButton.tsx`**
- TypeScript-Type erweitern: `'purple' | 'blue' | 'green' | 'orange' | 'red' | 'white' | 'yellow'`
- Neue `colorClasses` für yellow:
```typescript
yellow: 'bg-yellow-500/30 border-yellow-400/50 text-white hover:bg-yellow-400/40 hover:border-yellow-300 shadow-lg shadow-yellow-500/25'
```
- Gradient-Variante für yellow hinzufügen

**Datei 2: `NodePropertiesPanel.tsx`**
- `<SelectItem value="yellow">Gelb</SelectItem>` an 4 Stellen hinzufügen:
  1. Button-Farbe (Zeile ~540)
  2. Submit-Button-Farbe (Zeile ~887)
  3. Multiple Choice Button-Farbe (Zeile ~1123)
  4. Rating Submit-Button-Farbe (falls vorhanden)

**Datei 3: `index.css`**
- Neue CSS-Klasse für Multiple Choice gelb:
```css
.mc-button-yellow {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(234, 179, 8, 0.2));
  border: 1px solid rgba(234, 179, 8, 0.4);
  color: rgba(255, 255, 255, 0.95);
}
```

## Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/funnel/VideoNode.tsx` | Progress Bar + video duration tracking + smoother transitions |
| `src/components/funnel/VideoFunnelPreview.tsx` | Crossfade-Animation beim Node-Wechsel |
| `src/components/funnel/UniversalButton.tsx` | Yellow color hinzufügen |
| `src/components/funnel/NodePropertiesPanel.tsx` | "Gelb" zu allen Farb-Dropdowns |
| `src/index.css` | Neue Animations-Klassen + .mc-button-yellow |

## Erwartetes Ergebnis

1. **Transitions**: Videos faden smooth ineinander über (0.5s crossfade)
2. **Progress Bar**: Zeigt Videofortschritt oben, passt sich der Button-Farbe an
3. **Gelbe Buttons**: Verfügbar für alle Button-Typen im Builder

