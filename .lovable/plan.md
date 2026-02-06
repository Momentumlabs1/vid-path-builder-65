
## ✅ ERLEDIGT: Fix Schwarzes Video + Button/Input Größen

### Problem 1: Erstes Video war schwarz ✅ GELÖST
**Änderungen in `VideoNode.tsx`:**
- Entfernt: `onLoadStart` mit dem problematischen `document.querySelector('video')` Hack
- Hinzugefügt: `onError` Handler der opacity auf 1 setzt bei Fehlern
- Geändert: Initial opacity ist jetzt `100` statt Crossfade-Animation

### Problem 2: Button/Input-Größen ✅ GELÖST
**Neue Presets hinzugefügt:**
- Höhe: XS(24px), S(28px), M(36px), L(44px), XL(52px), 2XL(60px), **3XL(72px)**, **4XL(84px)**
- Breite: Auto, XS(80px), S(120px), M(160px), L(200px), XL(240px), 2XL(280px), **3XL(320px)**, **4XL(360px)**, Full
- Textgröße: XS(10px), S(12px), M(14px), L(16px), **XL(18px)**, **2XL(20px)**

### Problem 3: Input-Felder Controls ✅ GELÖST
**Neue Sektion "Eingabefeld Größe" in NodePropertiesPanel:**
- Input-Höhe: XS bis 4XL
- Input-Breite: S(200px), M(280px), L(320px), XL(400px), Full
- Input-Textgröße: XS bis 2XL

---

## Betroffene Dateien
1. `src/components/funnel/VideoNode.tsx` - Video-Opacity Fix + Input-Sizing
2. `src/components/funnel/NodePropertiesPanel.tsx` - Neue Size-Presets + Input-Controls

## Erwartetes Ergebnis
1. **Erstes Video lädt sichtbar** - kein schwarzer Bildschirm mehr
2. **Größere Presets** - 3XL/4XL für Desktop-Websites
3. **Input-Felder kontrollierbar** - eigene Größenoptionen
4. **WYSIWYG** - Editor = Preview = Live Website
