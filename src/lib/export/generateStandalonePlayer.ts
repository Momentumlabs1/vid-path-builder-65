import { Node, Edge } from '@xyflow/react';
import { generateStandaloneHTML, generatePlayerStyles, generatePlayerScript, FunnelData } from './playerTemplate';

export interface ExportOptions {
  format: 'html' | 'zip';
  webhookUrl?: string;
  funnelName: string;
}

export function prepareFunnelData(nodes: Node[], edges: Edge[], funnelName: string): FunnelData {
  return {
    name: funnelName,
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type || 'video',
      position: node.position,
      data: node.data as any
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type
    }))
  };
}

export function generateExportBundle(nodes: Node[], edges: Edge[], options: ExportOptions) {
  const funnelData = prepareFunnelData(nodes, edges, options.funnelName);
  
  if (options.format === 'html') {
    return {
      type: 'html' as const,
      filename: `${options.funnelName}-standalone.html`,
      content: generateStandaloneHTML(funnelData, options.webhookUrl)
    };
  }
  
  // ZIP format - return individual files
  return {
    type: 'zip' as const,
    files: [
      {
        name: 'index.html',
        content: generateIndexHTML(options.funnelName)
      },
      {
        name: 'player.js',
        content: generatePlayerScript(funnelData, options.webhookUrl)
      },
      {
        name: 'styles.css',
        content: generatePlayerStyles()
      },
      {
        name: 'funnel.json',
        content: JSON.stringify(funnelData, null, 2)
      },
      {
        name: 'README.md',
        content: generateReadme(options.funnelName, options.webhookUrl)
      }
    ]
  };
}

function generateIndexHTML(funnelName: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${funnelName} - Video Funnel</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="funnel-container">
    <div id="funnel-root"></div>
  </div>

  <script src="player.js"></script>
</body>
</html>`;
}

function generateReadme(funnelName: string, webhookUrl?: string): string {
  return `# ${funnelName} - Standalone Video Funnel

## Dateien

- \`index.html\` - Hauptseite (lädt player.js und styles.css)
- \`player.js\` - Funnel-Player Logik
- \`styles.css\` - Styling
- \`funnel.json\` - Funnel-Daten (Nodes, Edges, Video-URLs)

## Integration

### Option 1: Standalone (empfohlen)

Lade alle Dateien auf deinen Webserver und öffne \`index.html\`.

### Option 2: In bestehende Website einbinden

\`\`\`html
<!-- CSS einbinden -->
<link rel="stylesheet" href="pfad/zu/styles.css">

<!-- Container für den Funnel -->
<div id="funnel-root"></div>

<!-- Player-Script -->
<script src="pfad/zu/player.js"></script>
\`\`\`

### Option 3: Inline in bestehende Seite

Kopiere den Inhalt von \`styles.css\` in ein \`<style>\`-Tag und den Inhalt von \`player.js\` in ein \`<script>\`-Tag.

## Webhook

${webhookUrl 
  ? `Die Webhook-URL ist konfiguriert: \`${webhookUrl}\`\n\nAlle Antworten und Lead-Daten werden automatisch dorthin gesendet.`
  : `Keine Webhook-URL konfiguriert. Um Daten zu erfassen, bearbeite \`player.js\` und setze \`WEBHOOK_URL\` auf deine Backend-URL.`
}

### Webhook-Payload Format

\`\`\`json
{
  "funnel_name": "${funnelName}",
  "session_id": "session_abc123_1234567890",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "type": "answer|lead|completed",
  "payload": {
    // Bei "answer":
    "nodeId": "video-1",
    "question": "Frage-Text",
    "answer": "Gewählte Antwort",
    "answerType": "button|yesNo|cta"
    
    // Bei "lead":
    "firstName": "Max",
    "lastName": "Mustermann",
    "email": "max@example.com",
    "phone": "+49123456789"
    
    // Bei "completed":
    "responses": [...],
    "leadData": {...}
  }
}
\`\`\`

## Video-URLs

Die Videos werden direkt von den öffentlichen URLs geladen:
${funnelName.includes('trading') ? '- Supabase Storage (öffentlicher Bucket)' : '- Konfigurierte Video-URLs'}

Keine Authentifizierung erforderlich.

## Support

Bei Fragen oder Problemen: Kontaktiere den Funnel-Ersteller.
`;
}

export function downloadFile(filename: string, content: string, mimeType: string = 'text/html') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAsZip(files: Array<{ name: string; content: string }>, zipName: string) {
  // Simple ZIP implementation without external library
  // For a proper ZIP, we'd use JSZip, but this creates a tar-like structure
  
  // For now, download files individually or use the HTML-only option
  // In production, you'd add JSZip dependency
  
  // Fallback: Download as single combined file
  const combined = files.map(f => `
// ========== ${f.name} ==========
${f.content}
`).join('\n\n');
  
  downloadFile(`${zipName}-bundle.txt`, combined, 'text/plain');
}
