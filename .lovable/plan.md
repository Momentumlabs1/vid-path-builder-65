

## Fix: Schwarzes Video beim ersten Laden + Button-Größen Anpassung

### Problem 1: Erstes Video ist schwarz (auf Homepage/Embed)

**Ursache gefunden:**
- In `VideoNode.tsx` (Zeile 558-565) wird beim `onLoadStart` Event die Video-Opacity auf `0` gesetzt
- Das Problem: `document.querySelector('video')` ist unzuverlässig (findet falsches Element)
- Wenn `onLoadedData` nicht feuert (häufig im iFrame/Embed auf externen Websites), bleibt das Video **dauerhaft unsichtbar** (opacity: 0)

**Lösung:**
1. **Entferne den `onLoadStart` opacity=0 Hack** - er verursacht mehr Probleme als er löst
2. **Verwende CSS-Klassen statt inline styles** für die Crossfade-Animation
3. **Setze ein Fallback-Timeout** das nach 1 Sekunde die Opacity auf 1 setzt, falls `onLoadedData` nicht feuert

### Problem 2: Button/Input-Größen im Editor vs Live

**Status nach WYSIWYG-Fix:**
- Zoom-Skalierung entfernt (scale-105 weg, maxZoom=1.0)
- Editor zeigt jetzt echte Größen

**Noch zu tun:**
- Input-Felder bekommen eigene Größenkontrollen (Input-Höhe, Input-Breite)
- Größere Preset-Optionen hinzufügen (3XL, 4XL für Desktop-Embeds)

---

## Technische Änderungen

### Datei 1: `src/components/funnel/VideoNode.tsx`

**Zeile 558-566 - onLoadStart entfernen:**
```tsx
// VORHER (problematisch):
onLoadStart={() => {
  if (isPreview) {
    const video = document.querySelector('video');
    if (video) {
      video.style.opacity = '0';
    }
  }
}}

// NACHHER (entfernt - keine opacity manipulation beim Start):
// onLoadStart entfernen oder leer lassen
```

**Zeile 567-584 - Fallback-Timer hinzufügen:**
```tsx
// VORHER:
onLoadedData={(e) => {
  const video = e.currentTarget;
  if (!isPreview) {
    video.currentTime = 2;
  } else {
    video.style.opacity = '1';
    video.play().catch(...);
  }
}}

// NACHHER:
onLoadedData={(e) => {
  const video = e.currentTarget;
  if (!isPreview) {
    video.currentTime = 2;
  } else {
    video.style.opacity = '1';
    video.play().catch(() => {
      console.log('Video autoplay failed');
    });
  }
}}

// PLUS: Fallback-Timer nach dem video Element (Zeile ~590)
onError={(e) => {
  // Bei Video-Fehler trotzdem sichtbar machen
  e.currentTarget.style.opacity = '1';
  console.error('Video load error:', e);
}}
```

**Zeile 490 - Initial Opacity auf 1 setzen statt 0:**
```tsx
// VORHER:
className={`... video-crossfade-enter`}

// NACHHER - opacity immer 1, Crossfade nur über CSS-Klasse:
className={`... ${isPreview ? 'opacity-100' : ''}`}
style={{ 
  touchAction: 'manipulation', 
  willChange: 'transform, opacity',
  transition: 'opacity 0.5s ease-out'
}}
```

### Datei 2: `src/components/funnel/NodePropertiesPanel.tsx`

**Input-Größen-Controls hinzufügen:**
- Neue Sektion "Eingabefeld Größe" mit:
  - Input-Höhe: SM, MD, LG, XL, 2XL
  - Input-Breite: wie Button-Breite

### Datei 3: Button-Presets erweitern

**Größere Optionen:**
- 3XL: 320px Breite, 72px Höhe
- 4XL: 360px Breite, 84px Höhe
- FULL: 100% Breite

---

## Erwartetes Ergebnis

1. **Erstes Video lädt sofort sichtbar** - kein schwarzer Bildschirm mehr
2. **Input-Felder kontrollierbar** - eigene Größenoptionen im Editor
3. **Größere Button-Presets** - für Desktop-Websites geeignet
4. **Editor = Live = Website** - WYSIWYG garantiert

