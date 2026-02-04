
# Plan: Einfachen, funktionierenden Embed-Code im Dashboard bereitstellen

## Problem

Der aktuelle "Embed Code" Button im Dashboard öffnet einen komplexen Generator, der:
1. Die falsche URL verwendet (Preview-URL statt Published URL)
2. Zu viele Optionen zeigt, obwohl man oft nur schnell kopieren will

## Lösung

Eine neue "Schnell-Kopieren" Funktion im Funnel-Dropdown-Menü hinzufügen, die sofort einen funktionierenden Embed-Code in die Zwischenablage kopiert - mit der **korrekten Production-URL**.

## Technische Umsetzung

### 1. Neue Funktion im Dashboard (Dashboard.tsx)

Eine neue Funktion `copyEmbedCode` hinzufügen, die:
- Die **Published URL** (`https://vid-path-builder-65.lovable.app`) als Base-URL verwendet (nicht `window.location.origin`)
- Einen einfachen, sofort funktionierenden Widget-Embed-Code generiert
- Diesen direkt in die Zwischenablage kopiert

```text
┌─────────────────────────────────────────────┐
│          Dropdown-Menü (Funnel)             │
├─────────────────────────────────────────────┤
│ 🔗 Link kopieren                            │
│ 📋 Embed Code kopieren    ← NEU (schnell)   │
│ 📄 Duplizieren                              │
│ 🌍 Öffentlich/Privat                        │
│ ⚙️ Embed Generator        ← bleibt (detail) │
│ ───────────────────────                     │
│ 🗑️ Löschen                                  │
└─────────────────────────────────────────────┘
```

### 2. Generierter Embed-Code

Der kopierte Code sieht so aus:

```html
<!-- Funnel Embed: smart-trading-v6 -->
<script src="https://vid-path-builder-65.lovable.app/embed.js"></script>
<script>
window.FUNNEL_EMBED_CONFIG = {
  "funnelId": "smart-trading-v6",
  "type": "widget",
  "position": "bottom-right",
  "autoOpen": false
};
</script>
```

### 3. EmbedCodeGenerator korrigieren

Auch im detaillierten Generator die Production-URL verwenden statt Preview-URL.

## Dateien die geändert werden

| Datei | Änderung |
|-------|----------|
| `src/pages/Dashboard.tsx` | Neue `copyEmbedCode()` Funktion + neuer Menüpunkt "Embed Code kopieren" |
| `src/components/funnel/EmbedCodeGenerator.tsx` | `baseUrl` auf Production-URL ändern |

## Ergebnis

- **Ein Klick** auf "Embed Code kopieren" → funktionierender Code in Zwischenablage
- Der Code funktioniert sofort auf jeder Website
- Für erweiterte Optionen bleibt der "Embed Generator" Dialog verfügbar
