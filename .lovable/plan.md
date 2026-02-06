
# Funnel-Export Feature implementieren

## Überblick

Erstelle eine Export-Funktion im Builder, die den aktuellen Funnel als eigenständigen Code generiert. Der Code greift auf die öffentlich gehosteten Videos zu und sendet Lead-Daten per Webhook an dein Backend.

---

## Technische Details

### Neue Dateien

#### 1. `src/components/funnel/FunnelExporter.tsx`
Export-Dialog mit folgenden Features:
- Button "Als Code exportieren" im Builder
- Eingabefeld für Webhook-URL (wohin Leads gesendet werden)
- Auswahl: Standalone HTML oder separate Dateien
- Download-Generierung

#### 2. `src/lib/export/generateStandalonePlayer.ts`
Generator-Funktion die:
- Nodes und Edges des Funnels sammelt
- Video-URLs extrahiert (bleiben die öffentlichen Supabase-URLs)
- Player-Logik als Vanilla JS/React generiert
- Tailwind-Styles inline einbettet
- Webhook-Integration für Lead-Erfassung hinzufügt

#### 3. `src/lib/export/playerTemplate.ts`
HTML/JS Template das enthält:
- Minimaler Video-Player (basierend auf VideoNode-Logik)
- Button-Rendering (Multiple Choice, Yes/No, etc.)
- Lead-Capture-Formular
- Webhook-Sender für Daten

### Änderungen an bestehenden Dateien

#### `src/components/funnel/FunnelBuilder.tsx`
- Import FunnelExporter Komponente
- "Export"-Button in der Toolbar hinzufügen
- Props für aktuelle Nodes/Edges weitergeben

---

## Export-Ablauf

```text
1. User klickt "Als Code exportieren"
        ↓
2. Dialog öffnet sich
   - Webhook-URL eingeben (optional)
   - Format wählen (HTML oder ZIP)
        ↓
3. Generator sammelt:
   - Alle Nodes mit Video-URLs
   - Alle Edges (Verbindungen)
   - Button-Konfigurationen
        ↓
4. Template wird gefüllt:
   - Player-Code (JS)
   - Styles (CSS)
   - Funnel-Daten (JSON inline)
        ↓
5. Download startet
```

---

## Datenfluss im exportierten Code

```text
Deine Website                    Supabase Storage
     │                                  │
     │  1. Player lädt                  │
     ├──────────────────────────────────┤
     │                                  │
     │  2. Video-URLs werden geladen    │
     │     (public URLs, kein Auth)     │
     │◄─────────────────────────────────┤
     │                                  │
     │  3. User interagiert             │
     │                                  │
     │  4. Lead-Daten per Webhook       │
     ├─────────────────────────────────►│ Dein Backend
     │                                  │
```

---

## Exportierter Code - Struktur

### Option A: Standalone HTML (eine Datei)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Tailwind-Subset + Custom Styles */
  </style>
</head>
<body>
  <div id="funnel-root"></div>
  
  <script>
    // Funnel-Daten (Nodes, Edges, Video-URLs)
    const FUNNEL_DATA = {...};
    
    // Webhook-URL für Lead-Daten
    const WEBHOOK_URL = 'https://deine-website.com/api/leads';
    
    // Player-Logik
    class FunnelPlayer {
      // Video-Rendering
      // Button-Handling
      // Lead-Capture
      // Webhook-Sender
    }
    
    // Start
    new FunnelPlayer('#funnel-root', FUNNEL_DATA);
  </script>
</body>
</html>
```

### Option B: Separate Dateien (ZIP)

```text
funnel-export/
├── index.html      (Beispiel-Integration)
├── player.js       (Player-Logik, ~40KB)
├── styles.css      (Styles)
└── funnel.json     (Nodes, Edges, Video-URLs)
```

---

## Video-URL Handling

Die Video-URLs im Export sind die originalen öffentlichen URLs:

```javascript
// So sieht ein Node im Export aus:
{
  id: 'video-intro',
  type: 'video',
  data: {
    videoUrl: 'https://rqjwroreqihyqyktucvj.supabase.co/storage/v1/object/public/videos/intro.mp4',
    overlayText: 'Willkommen!',
    buttons: [...]
  }
}
```

Der Browser lädt die Videos direkt von der öffentlichen URL - kein Supabase-Client nötig.

---

## Webhook-Integration

```javascript
// Im exportierten Code:
async function sendToWebhook(data) {
  if (!WEBHOOK_URL) return;
  
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: data.type, // 'answer' oder 'lead'
      funnel_name: 'smart-trading-v6',
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      payload: data.payload
    })
  });
}

// Bei jeder Antwort:
sendToWebhook({ type: 'answer', payload: { nodeId, answer, answerType } });

// Bei Lead-Erfassung:
sendToWebhook({ type: 'lead', payload: { first_name, last_name, email, phone } });
```

---

## UI im Builder

```text
┌─────────────────────────────────────────────────┐
│  Funnel Builder - smart-trading-v6              │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Save] [Preview] [Export als Code ▾]           │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │        Funnel-Canvas                    │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘

Klick auf "Export als Code":

┌──────────────────────────────────────┐
│  Funnel exportieren                  │
├──────────────────────────────────────┤
│                                      │
│  Webhook-URL (optional):             │
│  ┌──────────────────────────────┐   │
│  │ https://...                  │   │
│  └──────────────────────────────┘   │
│                                      │
│  Format:                             │
│  ○ Standalone HTML (eine Datei)     │
│  ○ Separate Dateien (ZIP)           │
│                                      │
│  [Abbrechen]  [Exportieren]         │
│                                      │
└──────────────────────────────────────┘
```

---

## Zusammenfassung

| Aspekt | Lösung |
|--------|--------|
| Videos | Bleiben in Supabase Storage, öffentliche URLs im Export |
| Player-Code | Wird als eigenständiges JS generiert |
| Lead-Daten | Per Webhook an dein Backend |
| Integration | Eine HTML-Datei oder separate Dateien |
| Audio-Problem | Gelöst, da kein iFrame mehr nötig |
