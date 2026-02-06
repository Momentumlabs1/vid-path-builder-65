

# Export: Funnel-Code für externes Projekt vorbereiten

## Zusammenfassung

Du willst den fertigen Funnel-Player-Code nehmen und ihn dem anderen Projekt geben. Das andere Projekt baut dann ihren **eigenen "Funnel starten"-Button** - und DIESER Klick ist dann die User-Interaktion, die Sound erlaubt.

**JA - das ist umsetzbar!**

---

## Was das andere Projekt bekommt

Der Code besteht aus **3 Teilen**, die ich hier aus `src/lib/export/playerTemplate.ts` ziehe:

### 1. CSS Styles (`generatePlayerStyles`)
- Zeilen 50-475
- Enthält: `.funnel-player`, `.video-container`, `.funnel-button`, Animationen, etc.

### 2. JavaScript Player (`generatePlayerScript`)  
- Zeilen 478-1130
- Die komplette `FunnelPlayer` Klasse mit:
  - `startFunnel()` - Startet den Funnel
  - `goToNode()` - Navigation zwischen Videos
  - `renderVideoNode()` - Video-Rendering
  - `handleAnswer()` - Button-Klick Handling
  - `sendToWebhook()` - Daten an Webhook senden

### 3. Funnel-Daten (`smartTradingFunnel.ts`)
- 791 Zeilen mit allen Nodes, Edges, Video-URLs
- 39 Videos strukturiert in Intro + Anfänger + Fortgeschritten Pfade

---

## Wie das andere Projekt es integriert

```text
Externe Website                    Der Code den sie bekommen
=================                  =========================

<button id="start-btn">            styles.css
  Funnel starten                   player.js
</button>                          funnel-data.json
                                   
<div id="funnel-container">        
</div>
```

### Der wichtige Punkt: DEREN Start-Button

```javascript
// Im anderen Projekt:
document.getElementById('start-btn').addEventListener('click', () => {
  // 1. Container sichtbar machen
  document.getElementById('funnel-container').style.display = 'block';
  
  // 2. Player initialisieren
  const player = new FunnelPlayer('#funnel-container');
  
  // 3. DIREKT starten (kein zweiter Klick nötig)
  // Hier ist der Klick = User Gesture = Sound erlaubt!
  player.startFunnel();
});
```

---

## Anpassung am Export-Code (kleine Änderung)

Damit das funktioniert, braucht `startFunnel()` eine kleine Änderung:

### Aktuell (Zeile 555-561):
```javascript
startFunnel() {
  const startNode = this.nodes.find(n => n.type === 'start');
  const nextNode = this.findNextNode(startNode?.id);
  if (nextNode) {
    this.goToNode(nextNode.id);  // <- Hat 300ms Delay (verliert User Gesture!)
  }
}
```

### Neu:
```javascript
startFunnel() {
  // Sound aktivieren (User hat geklickt)
  this.isMuted = false;
  
  const startNode = this.nodes.find(n => n.type === 'start');
  const nextNode = this.findNextNode(startNode?.id);
  
  if (nextNode) {
    // SOFORT rendern (ohne 300ms Delay für erste Node!)
    this.currentNodeId = nextNode.id;
    this.buttonsVisible = false;
    this.selectedRating = 0;
    
    if (nextNode.type === 'video') {
      this.renderVideoNode(nextNode);
    } else {
      this.goToNode(nextNode.id);
    }
  }
}
```

### Zusätzlich in `renderVideoNode()` (Zeile 678-680):
```javascript
// Play video mit Fallback
if (this.videoElement && videoUrl) {
  this.videoElement.muted = this.isMuted;
  
  this.videoElement.play().catch(e => {
    console.log('Sound blocked, fallback to muted:', e);
    this.isMuted = true;
    this.videoElement.muted = true;
    this.videoElement.play();
  });
}
```

---

## Was ich jetzt mache

1. **`playerTemplate.ts` fixen** - Die zwei kleinen Änderungen oben einbauen
2. **Export-Funktion bleibt** - Du kannst weiterhin "Exportieren" im Builder klicken
3. **Der exportierte Code funktioniert dann sofort** - Anderes Projekt bekommt fertigen, funktionierenden Code

---

## Ablauf danach

```text
1. Du gehst in den Funnel-Builder
2. Du klickst "Exportieren" → "Standalone HTML" oder "Separate Dateien"
3. Du bekommst den fertigen Code
4. Du schickst den Code ans andere Projekt
5. Das andere Projekt baut ihren eigenen Start-Button
6. Deren Button ruft player.startFunnel() auf
7. Video startet MIT SOUND (weil deren Klick = User Gesture)
```

---

## Ergebnis

| Vorher | Nachher |
|--------|---------|
| iframe mit internem Start-Button | Direkter Code ohne iframe |
| 2 Klicks nötig (öffnen + starten) | 1 Klick reicht |
| Sound funktioniert nicht zuverlässig | Sound funktioniert (User Gesture erhalten) |
| Daten gehen über komplizierte Brücke | Webhook direkt im Player-Code |

---

## Technische Änderungen (für Entwickler)

### Datei: `src/lib/export/playerTemplate.ts`

| Zeile | Änderung |
|-------|----------|
| 555-561 | `startFunnel()` mit `isMuted = false` und sofortigem Rendern |
| 678-680 | `renderVideoNode()` mit dynamischem `video.muted` und Fallback |

### Keine Änderung an:
- `smartTradingFunnel.ts` (Daten bleiben gleich)
- `generateStandalonePlayer.ts` (Export-Logik bleibt gleich)
- `FunnelExporter.tsx` (UI bleibt gleich)

