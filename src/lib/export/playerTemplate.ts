// Player Template für Standalone HTML Export
// Generiert einen vollständigen Video-Funnel-Player als Vanilla JS

export interface FunnelNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label?: string;
    videoUrl?: string;
    overlayText?: string;
    answerType?: string;
    answers?: string[];
    buttonColor?: string;
    delayBeforeButtons?: number;
    nextNodes?: Record<string, string>;
    title?: string;
    description?: string;
    fields?: string[];
    optInText?: string;
    message?: string;
    redirectUrl?: string;
  };
}

export interface FunnelEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface FunnelData {
  name: string;
  nodes: FunnelNode[];
  edges: FunnelEdge[];
}

export function generatePlayerStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #000;
      color: #fff;
      min-height: 100vh;
    }
    
    .funnel-container {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
    }
    
    .funnel-player {
      width: 100%;
      max-width: 400px;
      height: 100%;
      max-height: 711px;
      background: #000;
      border-radius: 24px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    @media (max-width: 430px) {
      .funnel-player {
        max-width: 100%;
        max-height: 100%;
        border-radius: 0;
      }
    }
    
    .video-container {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
    }
    
    .progress-bar {
      height: 4px;
      background: rgba(255,255,255,0.2);
      position: relative;
      z-index: 20;
    }
    
    .progress-fill {
      height: 100%;
      background: var(--button-color, #facc15);
      transition: width 0.1s linear;
    }
    
    video {
      flex: 1;
      width: 100%;
      object-fit: cover;
    }
    
    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
      background: linear-gradient(transparent 50%, rgba(0,0,0,0.8) 100%);
      z-index: 10;
    }
    
    .overlay-text {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    }
    
    .buttons-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease;
    }
    
    .buttons-container.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .funnel-button {
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .funnel-button:hover {
      transform: scale(1.02);
      filter: brightness(1.1);
    }
    
    .funnel-button:active {
      transform: scale(0.98);
    }
    
    .funnel-button.primary {
      background: var(--button-color, #facc15);
      color: #000;
    }
    
    .funnel-button.secondary {
      background: rgba(255,255,255,0.15);
      color: #fff;
      backdrop-filter: blur(10px);
    }
    
    .yes-no-container {
      display: flex;
      gap: 0.75rem;
    }
    
    .yes-no-container .funnel-button {
      flex: 1;
    }
    
    /* Lead Capture Form */
    .lead-form {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      z-index: 30;
    }
    
    .lead-form h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .lead-form p {
      color: rgba(255,255,255,0.7);
      margin-bottom: 1.5rem;
    }
    
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }
    
    .form-field label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .form-field input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.1);
      color: #fff;
      font-size: 1rem;
    }
    
    .form-field input:focus {
      outline: none;
      border-color: var(--button-color, #facc15);
    }
    
    .opt-in-container {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    
    .opt-in-container input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.125rem;
    }
    
    .opt-in-container label {
      font-size: 0.875rem;
      color: rgba(255,255,255,0.8);
    }
    
    /* End Screen */
    .end-screen {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      z-index: 30;
    }
    
    .end-screen .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      animation: scaleIn 0.5s ease;
    }
    
    .end-screen .checkmark svg {
      width: 40px;
      height: 40px;
      color: #fff;
    }
    
    .end-screen h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    
    .end-screen p {
      color: rgba(255,255,255,0.7);
      font-size: 1rem;
      max-width: 280px;
    }
    
    /* Start Screen */
    .start-screen {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 30;
      cursor: pointer;
    }
    
    .start-button {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--button-color, #facc15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }
    
    .start-button:hover {
      transform: scale(1.1);
      box-shadow: 0 0 40px var(--button-color, #facc15);
    }
    
    .start-button svg {
      width: 40px;
      height: 40px;
      color: #000;
      margin-left: 5px;
    }
    
    /* Unmute Button */
    .unmute-button {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 25;
      transition: all 0.3s ease;
    }
    
    .unmute-button:hover {
      background: rgba(255,255,255,0.25);
    }
    
    .unmute-button svg {
      width: 24px;
      height: 24px;
      color: #fff;
    }
    
    /* Animations */
    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease;
    }
  `;
}

export function generatePlayerScript(data: FunnelData, webhookUrl?: string): string {
  return `
// Funnel Player - Generated Code
// Funnel: ${data.name}
// Generated: ${new Date().toISOString()}

const FUNNEL_DATA = ${JSON.stringify(data, null, 2)};
const WEBHOOK_URL = ${webhookUrl ? `'${webhookUrl}'` : 'null'};
const SESSION_ID = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

class FunnelPlayer {
  constructor(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.nodes = FUNNEL_DATA.nodes;
    this.edges = FUNNEL_DATA.edges;
    this.currentNodeId = null;
    this.responses = [];
    this.leadData = null;
    this.isMuted = true;
    this.videoElement = null;
    this.progress = 0;
    this.buttonsVisible = false;
    
    this.init();
  }
  
  init() {
    this.container.innerHTML = '<div class="funnel-player" id="funnel-player"></div>';
    this.playerEl = this.container.querySelector('.funnel-player');
    
    // Find start node
    const startNode = this.nodes.find(n => n.type === 'start');
    if (startNode) {
      this.showStartScreen(startNode);
    } else {
      // No start node, go to first video
      const firstVideo = this.nodes.find(n => n.type === 'video');
      if (firstVideo) {
        this.goToNode(firstVideo.id);
      }
    }
  }
  
  showStartScreen(startNode) {
    // Find first video to show as background preview
    const firstVideoNode = this.getNextNode(startNode.id);
    const previewUrl = firstVideoNode?.data?.videoUrl || '';
    
    this.playerEl.innerHTML = \`
      <div class="start-screen" onclick="window.funnelPlayer.startFunnel()">
        \${previewUrl ? \`<video src="\${previewUrl}" muted loop autoplay style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.3;"></video>\` : ''}
        <button class="start-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    \`;
    
    // Store reference for onclick
    window.funnelPlayer = this;
  }
  
  startFunnel() {
    const startNode = this.nodes.find(n => n.type === 'start');
    const nextNode = this.getNextNode(startNode?.id);
    if (nextNode) {
      this.goToNode(nextNode.id);
    }
  }
  
  getNextNode(nodeId) {
    const edge = this.edges.find(e => e.source === nodeId);
    if (edge) {
      return this.nodes.find(n => n.id === edge.target);
    }
    return null;
  }
  
  goToNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    this.currentNodeId = nodeId;
    this.buttonsVisible = false;
    
    switch (node.type) {
      case 'video':
        this.renderVideoNode(node);
        break;
      case 'leadCapture':
        this.renderLeadCaptureNode(node);
        break;
      case 'end':
        this.renderEndNode(node);
        break;
      default:
        console.warn('Unknown node type:', node.type);
    }
  }
  
  renderVideoNode(node) {
    const { videoUrl, overlayText, answerType, answers, buttonColor, delayBeforeButtons } = node.data;
    const delay = delayBeforeButtons || 0;
    const color = buttonColor || '#facc15';
    
    this.playerEl.style.setProperty('--button-color', color);
    
    this.playerEl.innerHTML = \`
      <div class="video-container fade-in">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
        </div>
        <video 
          id="funnel-video" 
          src="\${videoUrl}" 
          playsinline 
          \${this.isMuted ? 'muted' : ''}
        ></video>
        <div class="overlay">
          \${overlayText ? \`<div class="overlay-text">\${overlayText}</div>\` : ''}
          <div class="buttons-container" id="buttons-container">
            \${this.renderButtons(answerType, answers, color)}
          </div>
        </div>
        <button class="unmute-button" id="unmute-btn">
          \${this.isMuted ? this.getSpeakerOffIcon() : this.getSpeakerOnIcon()}
        </button>
      </div>
    \`;
    
    this.videoElement = this.playerEl.querySelector('#funnel-video');
    const progressFill = this.playerEl.querySelector('#progress-fill');
    const buttonsContainer = this.playerEl.querySelector('#buttons-container');
    const unmuteBtn = this.playerEl.querySelector('#unmute-btn');
    
    // Play video
    this.videoElement.play().catch(e => console.log('Autoplay blocked:', e));
    
    // Progress bar
    this.videoElement.addEventListener('timeupdate', () => {
      if (this.videoElement.duration) {
        const progress = (this.videoElement.currentTime / this.videoElement.duration) * 100;
        progressFill.style.width = progress + '%';
        
        // Show buttons after delay
        const delayProgress = (delay / this.videoElement.duration) * 100;
        if (progress >= delayProgress && !this.buttonsVisible) {
          this.buttonsVisible = true;
          buttonsContainer.classList.add('visible');
        }
      }
    });
    
    // Video ended - auto-advance if no buttons
    this.videoElement.addEventListener('ended', () => {
      if (!answers || answers.length === 0) {
        const nextNode = this.getNextNode(node.id);
        if (nextNode) {
          this.goToNode(nextNode.id);
        }
      }
    });
    
    // Unmute button
    unmuteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isMuted = !this.isMuted;
      this.videoElement.muted = this.isMuted;
      unmuteBtn.innerHTML = this.isMuted ? this.getSpeakerOffIcon() : this.getSpeakerOnIcon();
    });
    
    // Store reference for button clicks
    window.funnelPlayer = this;
  }
  
  renderButtons(answerType, answers, color) {
    if (!answers || answers.length === 0) return '';
    
    if (answerType === 'yesNo') {
      return \`
        <div class="yes-no-container">
          <button class="funnel-button primary" onclick="window.funnelPlayer.handleAnswer('Ja')">
            ✓ Ja
          </button>
          <button class="funnel-button secondary" onclick="window.funnelPlayer.handleAnswer('Nein')">
            ✗ Nein
          </button>
        </div>
      \`;
    }
    
    if (answerType === 'cta') {
      const ctaText = answers[0] || 'Weiter';
      return \`
        <button class="funnel-button primary" onclick="window.funnelPlayer.handleAnswer('\${ctaText}')">
          \${ctaText} →
        </button>
      \`;
    }
    
    // Multiple choice / button
    return answers.map((answer, i) => \`
      <button class="funnel-button \${i === 0 ? 'primary' : 'secondary'}" onclick="window.funnelPlayer.handleAnswer('\${answer}')">
        \${answer}
      </button>
    \`).join('');
  }
  
  handleAnswer(answer) {
    const node = this.nodes.find(n => n.id === this.currentNodeId);
    if (!node) return;
    
    // Save response
    this.responses.push({
      nodeId: this.currentNodeId,
      answer: answer,
      timestamp: new Date().toISOString()
    });
    
    // Send to webhook
    this.sendToWebhook({
      type: 'answer',
      payload: {
        nodeId: this.currentNodeId,
        question: node.data.overlayText || node.data.label,
        answer: answer,
        answerType: node.data.answerType
      }
    });
    
    // Find next node
    let nextNodeId = node.data.nextNodes?.[answer];
    
    if (!nextNodeId) {
      // Find from edges
      const edge = this.edges.find(e => e.source === this.currentNodeId);
      nextNodeId = edge?.target;
    }
    
    if (nextNodeId) {
      this.goToNode(nextNodeId);
    }
  }
  
  renderLeadCaptureNode(node) {
    const { title, description, fields, optInText } = node.data;
    const fieldLabels = {
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      age: 'Alter'
    };
    
    this.playerEl.innerHTML = \`
      <div class="lead-form fade-in">
        <h2>\${title || 'Kontaktdaten'}</h2>
        <p>\${description || 'Bitte geben Sie Ihre Daten ein'}</p>
        <form id="lead-form" class="form-fields">
          \${(fields || ['firstName', 'lastName', 'email']).map(field => \`
            <div class="form-field">
              <label>\${fieldLabels[field] || field}</label>
              <input type="\${field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'age' ? 'number' : 'text'}" 
                     name="\${field}" 
                     required="\${['firstName', 'email'].includes(field)}"
                     placeholder="\${fieldLabels[field] || field}">
            </div>
          \`).join('')}
          \${optInText ? \`
            <div class="opt-in-container">
              <input type="checkbox" name="optIn" id="optIn">
              <label for="optIn">\${optInText}</label>
            </div>
          \` : ''}
          <button type="submit" class="funnel-button primary" style="margin-top: auto;">
            Absenden →
          </button>
        </form>
      </div>
    \`;
    
    const form = this.playerEl.querySelector('#lead-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      this.leadData = Object.fromEntries(formData);
      
      // Send to webhook
      this.sendToWebhook({
        type: 'lead',
        payload: this.leadData
      });
      
      // Go to next node
      const nextNode = this.getNextNode(node.id);
      if (nextNode) {
        this.goToNode(nextNode.id);
      }
    });
  }
  
  renderEndNode(node) {
    const { title, message, redirectUrl } = node.data;
    
    this.playerEl.innerHTML = \`
      <div class="end-screen fade-in">
        <div class="checkmark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2>\${title || 'Vielen Dank!'}</h2>
        <p>\${message || 'Sie haben den Funnel erfolgreich abgeschlossen.'}</p>
      </div>
    \`;
    
    // Send completion
    this.sendToWebhook({
      type: 'completed',
      payload: {
        responses: this.responses,
        leadData: this.leadData
      }
    });
    
    // Redirect if specified
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
    }
  }
  
  async sendToWebhook(data) {
    if (!WEBHOOK_URL) return;
    
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnel_name: FUNNEL_DATA.name,
          session_id: SESSION_ID,
          timestamp: new Date().toISOString(),
          ...data
        })
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }
  
  getSpeakerOffIcon() {
    return \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>\`;
  }
  
  getSpeakerOnIcon() {
    return \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>\`;
  }
}

// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#funnel-root') || document.querySelector('.funnel-container');
  if (container) {
    new FunnelPlayer(container);
  }
});
  `;
}

export function generateStandaloneHTML(data: FunnelData, webhookUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${data.name} - Video Funnel</title>
  <style>
${generatePlayerStyles()}
  </style>
</head>
<body>
  <div class="funnel-container">
    <div id="funnel-root"></div>
  </div>

  <script>
${generatePlayerScript(data, webhookUrl)}
  </script>
</body>
</html>`;
}
