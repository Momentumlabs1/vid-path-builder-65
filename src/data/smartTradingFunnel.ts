// Smart Trading Video Funnel V3.0 - Optimiert & Schlank
// 12-14 Videos total, 3 klare Pfade, bessere Psychologie
// LAYOUT: Pfade sind horizontal getrennt um Überlappung zu vermeiden

import { Node, Edge } from '@xyflow/react';

export const SMART_TRADING_FUNNEL_NAME = 'smart-trading-v3';

// ============= LAYOUT KONSTANTEN =============
// Horizontale Bereiche für jeden Pfad (verhindert Überlappung)
const ANFAENGER_X = 0;         // 🟢 Anfänger: linke Spalte
const FORTGESCHRITTEN_X = 500; // 🟡 Fortgeschritten: mittlere Spalte  
const PROFI_X = 1000;          // 🔴 Profi: rechte Spalte
const CENTER_X = 500;          // Gemeinsamer Start in der Mitte

// Vertikale Abstände
const ROW_HEIGHT = 200;

// Gemeinsame Videos (oben)
const GEMEINSAM_Y = 100;

// Pfad-Start Y (nach der Weiche)
const PFAD_START_Y = 500;

// Abschluss (unten, mittig)
const ABSCHLUSS_Y = 1400;
const LEAD_Y = 1600;
const END_Y = 1800;

// ============= NODE DEFINITIONS =============

export const smartTradingNodes: Node[] = [
  // ============ START ============
  {
    id: 'start',
    type: 'start',
    position: { x: CENTER_X, y: 0 },
    data: { label: 'Start' }
  },

  // ============ GEMEINSAME VIDEOS ============
  // V1: Welcome (45 Sek) – ALLE
  {
    id: 'v1-welcome',
    type: 'video',
    position: { x: CENTER_X, y: GEMEINSAM_Y },
    data: {
      label: 'V1: Welcome',
      videoUrl: '',
      overlayText: 'Hey, ich bin Saif. Das hier ist anders als das was du sonst so siehst...',
      interactionType: 'singleButton',
      singleButtonText: 'Deal – Let\'s go 🤝',
      buttonColor: 'purple',
      buttonStyle: 'glassmorphism',
      buttonSize: 'large',
      buttonPosition: 'bottom-center',
      delaySeconds: 45,
      nextNodes: { default: 'v2-weiche' }
    }
  },

  // V2: Die Weiche (30 Sek) – ALLE
  {
    id: 'v2-weiche',
    type: 'video',
    position: { x: CENTER_X, y: GEMEINSAM_Y + ROW_HEIGHT },
    data: {
      label: 'V2: Level-Frage (Die Weiche)',
      videoUrl: '',
      overlayText: 'Wie viel Erfahrung hast du mit Trading? Nicht YouTube schauen – echtes Geld im Markt.',
      interactionType: 'multipleChoice',
      answers: [
        '🟢 Keine bis wenig – ich fang gerade erst an',
        '🟡 Ich trade schon, aber bin noch nicht profitabel',
        '🔴 Ich trade seit über einem Jahr und hab Erfahrung'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'orange',
      mcColor_2: 'red',
      delaySeconds: 30,
      nextNodes: {
        0: 'a1-traum',
        1: 'b1-situation',
        2: 'c1-status'
      }
    }
  },

  // ============ 🟢 ANFÄNGER-PFAD (3 Videos) ============
  
  // A1: Traum aktivieren (40 Sek)
  {
    id: 'a1-traum',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y },
    data: {
      label: '🟢 A1: Traum aktivieren',
      videoUrl: '',
      overlayText: 'Cool, du startest gerade. Das ist eigentlich ein Vorteil – keine schlechten Gewohnheiten. Was ist dein Traum?',
      interactionType: 'multipleChoice',
      answers: [
        '💰 Nebeneinkommen – 500-2000€ extra im Monat',
        '🚀 Finanzielle Freiheit – irgendwann unabhängig sein',
        '🧠 Erstmal verstehen wie das funktioniert'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'purple',
      mcColor_2: 'blue',
      delaySeconds: 40,
      nextNodes: { default: 'a2-problem' }
    }
  },

  // A2: Problem identifizieren (45 Sek)
  {
    id: 'a2-problem',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      label: '🟢 A2: Problem identifizieren',
      videoUrl: '',
      overlayText: 'Was hält dich davon ab, JETZT schon anzufangen? Sei ehrlich – jeder hat so eine Blockade.',
      interactionType: 'multipleChoice',
      answers: [
        '😰 Angst vor Verlusten – ich will kein Geld verlieren',
        '🤯 Überforderung – ich weiß nicht wo ich anfangen soll',
        '⏰ Zeit – ich hab nicht viel davon',
        '🕵️ Vertrauen – ich glaub keinem Coach/Kurs'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'red',
      mcColor_1: 'orange',
      mcColor_2: 'blue',
      mcColor_3: 'purple',
      delaySeconds: 45,
      nextNodes: { default: 'a3-loesung' }
    }
  },

  // A3: Lösung + Produkt (60 Sek)
  {
    id: 'a3-loesung',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      label: '🟢 A3: Lösung + Produkt',
      videoUrl: '',
      overlayText: 'Hier ist was ich für Leute wie dich gebaut hab: Starter-Programm oder kostenloser E-Mail-Kurs.',
      interactionType: 'multipleChoice',
      answers: [
        '🎓 Zeig mir das Starter-Programm',
        '📧 Erstmal der kostenlose E-Mail-Kurs',
        '💬 Ich hab noch Fragen'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'large',
      mcLayout: 'vertical',
      mcColor_0: 'purple',
      mcColor_1: 'blue',
      mcColor_2: 'green',
      delaySeconds: 60,
      nextNodes: { default: 'v-abschluss' }
    }
  },

  // ============ 🟡 FORTGESCHRITTENEN-PFAD (4 Videos) ============
  
  // B1: Situation checken (35 Sek)
  {
    id: 'b1-situation',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y },
    data: {
      label: '🟡 B1: Situation checken',
      videoUrl: '',
      overlayText: 'Du tradest schon, aber noch nicht profitabel. Das ist die härteste Phase. Wie sieht\'s bei dir gerade aus?',
      interactionType: 'multipleChoice',
      answers: [
        '📉 Ich verliere mehr als ich gewinne',
        '⚖️ Ich bin so bei Break-Even – mal plus, mal minus',
        '🎢 Ich bin inkonsistent – keine Ahnung was los ist'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'red',
      mcColor_1: 'orange',
      mcColor_2: 'purple',
      delaySeconds: 35,
      nextNodes: { default: 'b2-traum' }
    }
  },

  // B2: Traum aktivieren (35 Sek)
  {
    id: 'b2-traum',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      label: '🟡 B2: Traum aktivieren',
      videoUrl: '',
      overlayText: 'Was willst du in den nächsten 12 Monaten erreichen?',
      interactionType: 'multipleChoice',
      answers: [
        '✅ Endlich konstant profitabel werden',
        '💼 Trading zum Hauptjob machen',
        '📋 Eine Prop-Firm Challenge bestehen'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'purple',
      mcColor_2: 'blue',
      delaySeconds: 35,
      nextNodes: { default: 'b3-problem' }
    }
  },

  // B3: Problem identifizieren (40 Sek)
  {
    id: 'b3-problem',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      label: '🟡 B3: Problem identifizieren',
      videoUrl: '',
      overlayText: 'Was ist das EINE Ding das dich zurückhält? Es gibt eigentlich nur 3 echte Probleme...',
      interactionType: 'multipleChoice',
      answers: [
        '🎯 Strategie – ich hab keine die funktioniert',
        '🧠 Emotionen – ich halt mich nicht an meine Regeln',
        '💸 Risk Management – ich verliere zu viel pro Trade'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'blue',
      mcColor_1: 'orange',
      mcColor_2: 'red',
      delaySeconds: 40,
      nextNodes: { default: 'b4-loesung' }
    }
  },

  // B4: Lösung + Produkt (70 Sek)
  {
    id: 'b4-loesung',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      label: '🟡 B4: Lösung + Produkt',
      videoUrl: '',
      overlayText: 'Für Trader in deiner Situation: Gruppen-Coaching oder kostenloser Live-Workshop.',
      interactionType: 'multipleChoice',
      answers: [
        '🎓 Zeig mir das Gruppen-Coaching',
        '🆓 Zum kostenlosen Workshop anmelden',
        '📞 Ich will erstmal mit jemandem sprechen'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'large',
      mcLayout: 'vertical',
      mcColor_0: 'purple',
      mcColor_1: 'green',
      mcColor_2: 'blue',
      delaySeconds: 70,
      nextNodes: { default: 'v-abschluss' }
    }
  },

  // ============ 🔴 PROFI-PFAD (3 Videos) ============
  
  // C1: Status Check (35 Sek)
  {
    id: 'c1-status',
    type: 'video',
    position: { x: PROFI_X, y: PFAD_START_Y },
    data: {
      label: '🔴 C1: Status Check',
      videoUrl: '',
      overlayText: 'Über ein Jahr Erfahrung – Respekt. Du bist weiter als 95% der Leute. Bist du profitabel?',
      interactionType: 'multipleChoice',
      answers: [
        '✅ Ja – ich verdiene mit Trading',
        '⚖️ Ungefähr Break-Even',
        '📉 Noch nicht wirklich'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'orange',
      mcColor_2: 'red',
      delaySeconds: 35,
      nextNodes: { default: 'c2-ziel' }
    }
  },

  // C2: Ziel + Engpass (45 Sek)
  {
    id: 'c2-ziel',
    type: 'video',
    position: { x: PROFI_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      label: '🔴 C2: Ziel + Engpass',
      videoUrl: '',
      overlayText: 'Was ist dein Ziel – und was ist der Engpass?',
      interactionType: 'multipleChoice',
      answers: [
        '📈 Ich will skalieren – größere Positionen, mehr Kapital',
        '📋 Ich will eine Prop-Firm Challenge bestehen',
        '🧠 Mein Mindset hält mich zurück',
        '🤝 Mir fehlt Austausch mit anderen Profis'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'blue',
      mcColor_2: 'orange',
      mcColor_3: 'purple',
      delaySeconds: 45,
      nextNodes: { default: 'c3-loesung' }
    }
  },

  // C3: Lösung + Produkt (60 Sek)
  {
    id: 'c3-loesung',
    type: 'video',
    position: { x: PROFI_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      label: '🔴 C3: Lösung + Produkt',
      videoUrl: '',
      overlayText: 'Für Trader auf deinem Level: 1:1 Mentoring, Elite-Gruppe, oder erstmal ein Gespräch.',
      interactionType: 'multipleChoice',
      answers: [
        '🚀 Zeig mir das 1:1 Mentoring',
        '👥 Zeig mir die Elite-Gruppe',
        '📞 Erstmal ein kurzes Gespräch'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'large',
      mcLayout: 'vertical',
      mcColor_0: 'purple',
      mcColor_1: 'blue',
      mcColor_2: 'green',
      delaySeconds: 60,
      nextNodes: { default: 'v-abschluss' }
    }
  },

  // ============ ABSCHLUSS (45 Sek) – ALLE ============
  {
    id: 'v-abschluss',
    type: 'video',
    position: { x: CENTER_X, y: ABSCHLUSS_Y },
    data: {
      label: 'V13: Abschluss',
      videoUrl: '',
      overlayText: 'Du weißt jetzt wo du stehst und was dein nächster Schritt wäre. Check deine Mails – bis bald!',
      interactionType: 'singleButton',
      singleButtonText: 'Fertig ✅',
      buttonColor: 'green',
      buttonStyle: 'glassmorphism',
      buttonSize: 'large',
      buttonPosition: 'bottom-center',
      delaySeconds: 45,
      nextNodes: { default: 'lead-capture' }
    }
  },

  // ============ LEAD CAPTURE ============
  {
    id: 'lead-capture',
    type: 'leadCapture',
    position: { x: CENTER_X, y: LEAD_Y },
    data: {
      label: 'Lead Capture',
      title: 'Fast geschafft! 📧',
      description: 'Trag dich ein für deine persönliche Trading-Analyse',
      fields: ['firstName', 'lastName', 'email', 'phone'],
      optInText: 'Ich möchte weitere Informationen erhalten'
    }
  },

  // ============ END ============
  {
    id: 'end',
    type: 'end',
    position: { x: CENTER_X, y: END_Y },
    data: {
      label: 'Ende',
      title: 'Vielen Dank! 🎉',
      message: 'Du hast heute mehr über deine Trading-Situation gelernt als die meisten in Monaten. Wir melden uns!',
      redirectUrl: ''
    }
  }
];

// ============= EDGE DEFINITIONS =============

export const smartTradingEdges: Edge[] = [
  // Start → Welcome
  { id: 'e-start-welcome', source: 'start', target: 'v1-welcome', type: 'smoothstep' },
  
  // Welcome → Weiche
  { id: 'e-welcome-weiche', source: 'v1-welcome', target: 'v2-weiche', type: 'smoothstep' },
  
  // ============ WEICHE → 3 PFADE ============
  { id: 'e-weiche-anfaenger', source: 'v2-weiche', target: 'a1-traum', type: 'smoothstep', label: '🟢 Anfänger' },
  { id: 'e-weiche-fortgeschr', source: 'v2-weiche', target: 'b1-situation', type: 'smoothstep', label: '🟡 Fortgeschr.' },
  { id: 'e-weiche-profi', source: 'v2-weiche', target: 'c1-status', type: 'smoothstep', label: '🔴 Profi' },
  
  // ============ 🟢 ANFÄNGER-PFAD ============
  { id: 'e-a1-a2', source: 'a1-traum', target: 'a2-problem', type: 'smoothstep' },
  { id: 'e-a2-a3', source: 'a2-problem', target: 'a3-loesung', type: 'smoothstep' },
  { id: 'e-a3-abschluss', source: 'a3-loesung', target: 'v-abschluss', type: 'smoothstep' },
  
  // ============ 🟡 FORTGESCHRITTENEN-PFAD ============
  { id: 'e-b1-b2', source: 'b1-situation', target: 'b2-traum', type: 'smoothstep' },
  { id: 'e-b2-b3', source: 'b2-traum', target: 'b3-problem', type: 'smoothstep' },
  { id: 'e-b3-b4', source: 'b3-problem', target: 'b4-loesung', type: 'smoothstep' },
  { id: 'e-b4-abschluss', source: 'b4-loesung', target: 'v-abschluss', type: 'smoothstep' },
  
  // ============ 🔴 PROFI-PFAD ============
  { id: 'e-c1-c2', source: 'c1-status', target: 'c2-ziel', type: 'smoothstep' },
  { id: 'e-c2-c3', source: 'c2-ziel', target: 'c3-loesung', type: 'smoothstep' },
  { id: 'e-c3-abschluss', source: 'c3-loesung', target: 'v-abschluss', type: 'smoothstep' },
  
  // ============ ABSCHLUSS → LEAD → END ============
  { id: 'e-abschluss-lead', source: 'v-abschluss', target: 'lead-capture', type: 'smoothstep' },
  { id: 'e-lead-end', source: 'lead-capture', target: 'end', type: 'smoothstep' }
];
