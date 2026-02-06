

## Änderung: postMessage beim Start senden

### Was wird gemacht
Im bestehenden `handleStartClick` (Zeile 284-296) wird ein Event an die Parent-Website gesendet.

### Code-Änderung in `VideoFunnelPreview.tsx`

```tsx
const handleStartClick = () => {
  // NEU: Event an Parent-Website senden
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'funnel_started' }, '*');
  }
  
  // Bestehende Navigation...
  const edges = (window as any).funnelEdges || [];
  // ...
};
```

### Deine Website empfängt das Event

```javascript
window.addEventListener('message', (e) => {
  if (e.data.type === 'funnel_started') {
    // Zoom-Animation starten
  }
});
```

### Ergebnis
- User klickt im iFrame → Video mit Ton startet
- Deine Website bekommt Event → kann Zoom-Animation machen

