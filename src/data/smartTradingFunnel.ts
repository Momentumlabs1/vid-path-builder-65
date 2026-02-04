// Smart Trading Video Funnel V4.0 - FINAL
// 16 Videos, perfekter psychologischer Aufbau
// 3 gemeinsame Videos + 4 Videos pro Pfad + Social Proof Screen

import { Node, Edge } from '@xyflow/react';

export const SMART_TRADING_FUNNEL_NAME = 'smart-trading-v4';

// ============= LAYOUT KONSTANTEN =============
const ANFAENGER_X = 0;
const FORTGESCHRITTEN_X = 500;
const PROFI_X = 1000;
const CENTER_X = 500;

const ROW_HEIGHT = 200;
const GEMEINSAM_Y = 100;
const SOCIAL_PROOF_Y = 500;
const PFAD_START_Y = 700;
const ABSCHLUSS_Y = 1600;
const LEAD_Y = 1800;
const END_Y = 2000;

// ============= NODE DEFINITIONS =============

export const smartTradingNodes: Node[] = [
  // ============ START ============
  {
    id: 'start',
    type: 'start',
    position: { x: CENTER_X, y: 0 },
    data: { label: 'Start' }
  },

  // ============ GEMEINSAME VIDEOS (ALLE SEHEN) ============
  
  // V1: HOOK / PATTERN INTERRUPT (40 Sek)
  {
    id: 'v1-hook',
    type: 'video',
    position: { x: CENTER_X, y: GEMEINSAM_Y },
    data: {
      label: 'V1: Hook / Pattern Interrupt',
      videoUrl: '',
      overlayText: 'Stop. Das hier ist kein "Werde reich in 30 Tagen" Bullshit. Trading ist verdammt schwer. Wenn du nach einem Shortcut suchst – schließ das Video.',
      interactionType: 'singleButton',
      singleButtonText: 'Ich bin bereit 💪',
      buttonColor: 'purple',
      buttonStyle: 'glassmorphism',
      buttonSize: 'large',
      buttonPosition: 'bottom-center',
      delaySeconds: 40,
      nextNodes: { default: 'v2-story' }
    }
  },

  // V2: SAIF'S STORY + CREDENTIALS (60 Sek)
  {
    id: 'v2-story',
    type: 'video',
    position: { x: CENTER_X, y: GEMEINSAM_Y + ROW_HEIGHT },
    data: {
      label: 'V2: Saif\'s Story',
      videoUrl: '',
      overlayText: 'Ich hab am Anfang ALLES falsch gemacht. Mein erstes Konto? Innerhalb von 3 Monaten zerstört. Bis ich kapiert hab: Es lag nicht an mir – es lag daran, WIE ich es gelernt hab.',
      interactionType: 'singleButton',
      singleButtonText: 'Weiter →',
      buttonColor: 'blue',
      buttonStyle: 'glassmorphism',
      buttonSize: 'medium',
      buttonPosition: 'bottom-center',
      delaySeconds: 60,
      nextNodes: { default: 'v3-weiche' }
    }
  },

  // V3: DIE WEICHE – LEVEL-FRAGE (30 Sek)
  {
    id: 'v3-weiche',
    type: 'video',
    position: { x: CENTER_X, y: GEMEINSAM_Y + ROW_HEIGHT * 2 },
    data: {
      label: 'V3: Level-Frage (Die Weiche)',
      videoUrl: '',
      overlayText: 'Wie lange tradest du schon AKTIV? Nicht YouTube schauen – echtes Geld im Markt.',
      interactionType: 'multipleChoice',
      answers: [
        '🟢 Noch gar nicht oder gerade erst angefangen',
        '🟡 Ich trade schon, aber bin noch nicht konstant profitabel',
        '🔴 Über 1 Jahr – ich hab Erfahrung und will aufs nächste Level'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'orange',
      mcColor_2: 'red',
      delaySeconds: 30,
      nextNodes: {
        0: 'social-proof',
        1: 'social-proof',
        2: 'social-proof'
      }
    }
  },

  // SOCIAL PROOF ZWISCHENSCREEN
  {
    id: 'social-proof',
    type: 'video',
    position: { x: CENTER_X, y: SOCIAL_PROOF_Y },
    data: {
      label: 'Social Proof Screen',
      videoUrl: '',
      overlayText: '⭐⭐⭐⭐⭐ Über 1.247 Trader haben diesen Check schon gemacht. "Endlich jemand der ehrlich ist." – Max K.',
      interactionType: 'singleButton',
      singleButtonText: 'Weiter →',
      buttonColor: 'purple',
      buttonStyle: 'glassmorphism',
      buttonSize: 'medium',
      buttonPosition: 'bottom-center',
      delaySeconds: 4,
      nextNodes: {
        // Diese werden dynamisch basierend auf der vorherigen Antwort gesetzt
        default: 'a1-traum'
      }
    }
  },

  // ============ 🟢 ANFÄNGER-PFAD (4 Videos) ============
  
  // A1: TRAUM AKTIVIEREN (45 Sek)
  {
    id: 'a1-traum',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y },
    data: {
      label: '🟢 A1: Traum aktivieren',
      videoUrl: '',
      overlayText: 'Du stehst am Anfang – und das ist gut so! Du hast noch nichts falsch gelernt. Was willst du mit Trading erreichen?',
      interactionType: 'multipleChoice',
      answers: [
        '💰 Nebeneinkommen – 500-2000€ extra wären geil',
        '🚀 Langfristig finanziell frei sein',
        '🧠 Erstmal verstehen wie das funktioniert'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'purple',
      mcColor_2: 'blue',
      delaySeconds: 45,
      nextNodes: { default: 'a2-schmerz' }
    }
  },

  // A2: SCHMERZ / BLOCKADE (50 Sek)
  {
    id: 'a2-schmerz',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      label: '🟢 A2: Schmerz/Blockade',
      videoUrl: '',
      overlayText: 'Was hält dich WIRKLICH davon ab, anzufangen? Jeder hat diese eine Blockade. Bei mir war\'s: "Du bist nicht schlau genug."',
      interactionType: 'multipleChoice',
      answers: [
        '😰 Angst vor Verlusten – ich will kein Geld verlieren',
        '🤯 Überforderung – das Thema ist so riesig',
        '⏰ Keine Zeit – mein Alltag ist schon voll',
        '🕵️ Misstrauen – ich glaub keinem Kurs oder Coach'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'red',
      mcColor_1: 'orange',
      mcColor_2: 'blue',
      mcColor_3: 'purple',
      delaySeconds: 50,
      nextNodes: { default: 'a3-aha' }
    }
  },

  // A3: AHA-MOMENT / VALUE BOMB (60 Sek)
  {
    id: 'a3-aha',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      label: '🟢 A3: Aha-Moment',
      videoUrl: '',
      overlayText: 'Der EINE Grund warum 90% der Anfänger scheitern: Sie starten mit echtem Geld, bevor sie bereit sind. Der Fix: Demo → Klein Live → Normal Live.',
      interactionType: 'singleButton',
      singleButtonText: 'Zeig mir mehr 🔥',
      buttonColor: 'purple',
      buttonStyle: 'glassmorphism',
      buttonSize: 'large',
      buttonPosition: 'bottom-center',
      delaySeconds: 60,
      nextNodes: { default: 'a4-loesung' }
    }
  },

  // A4: LÖSUNG + PRODUKT + SOCIAL PROOF (75 Sek)
  {
    id: 'a4-loesung',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      label: '🟢 A4: Lösung + Produkt',
      videoUrl: '',
      overlayText: 'Mein Starter-Programm: Komplette Grundlage, Anfänger-Strategie, Demo-zu-Live Plan, Community-Zugang. Oder erstmal kostenlos: 5-Tage E-Mail-Kurs.',
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
      delaySeconds: 75,
      nextNodes: { default: 'v-abschluss' }
    }
  },

  // ============ 🟡 FORTGESCHRITTENEN-PFAD (4 Videos) ============
  
  // B1: SITUATION CHECKEN + VALIDIEREN (45 Sek)
  {
    id: 'b1-situation',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y },
    data: {
      label: '🟡 B1: Situation checken',
      videoUrl: '',
      overlayText: 'Du tradest schon, aber noch nicht profitabel. Diese Phase ist die härteste. Wie würdest du deine Situation beschreiben?',
      interactionType: 'multipleChoice',
      answers: [
        '📉 Ich verliere unterm Strich – mein Konto schrumpft',
        '⚖️ Ich bin bei Break-Even – mal Plus, mal Minus',
        '🎢 Ich bin komplett inkonsistent'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'red',
      mcColor_1: 'orange',
      mcColor_2: 'purple',
      delaySeconds: 45,
      nextNodes: { default: 'b2-traum' }
    }
  },

  // B2: TRAUM + ZIEL (40 Sek)
  {
    id: 'b2-traum',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      label: '🟡 B2: Traum + Ziel',
      videoUrl: '',
      overlayText: 'Stell dir vor, das Problem wäre gelöst. Konstant profitabel. Was ist dein Ziel für die nächsten 12 Monate?',
      interactionType: 'multipleChoice',
      answers: [
        '✅ Endlich konstant profitabel werden',
        '💼 Trading zum Vollzeit-Job machen',
        '📋 Eine Prop-Firm Challenge bestehen',
        '📈 Meine Performance verdoppeln'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'purple',
      mcColor_2: 'blue',
      mcColor_3: 'orange',
      delaySeconds: 40,
      nextNodes: { default: 'b3-problem' }
    }
  },

  // B3: DAS EINE PROBLEM + AHA-MOMENT (60 Sek)
  {
    id: 'b3-problem',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      label: '🟡 B3: Das EINE Problem',
      videoUrl: '',
      overlayText: 'Es gibt nur DREI Gründe warum Trader nicht profitabel sind: 1. Strategie 2. Ausführung 3. Risk Management. Welcher ist deiner?',
      interactionType: 'multipleChoice',
      answers: [
        '🎯 Strategie – ich hab keine die funktioniert',
        '🧠 Ausführung – ich weiß was ich tun soll, tu\'s aber nicht',
        '💸 Risk Management – wenn ich falsch liege, verlier ich zu viel',
        '❓ Ich bin mir ehrlich gesagt nicht sicher'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'blue',
      mcColor_1: 'orange',
      mcColor_2: 'red',
      mcColor_3: 'purple',
      delaySeconds: 60,
      nextNodes: { default: 'b4-loesung' }
    }
  },

  // B4: LÖSUNG + PRODUKT + SOCIAL PROOF (80 Sek)
  {
    id: 'b4-loesung',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      label: '🟡 B4: Lösung + Produkt',
      videoUrl: '',
      overlayText: 'Gruppen-Coaching: 8 Wochen live, meine Strategie, wöchentliche Calls, persönliches Feedback. Oder: Kostenloser Live-Workshop nächste Woche.',
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
      delaySeconds: 80,
      nextNodes: { default: 'v-abschluss' }
    }
  },

  // ============ 🔴 PROFI-PFAD (4 Videos) ============
  
  // C1: RESPEKT + STATUS CHECK (40 Sek)
  {
    id: 'c1-status',
    type: 'video',
    position: { x: PROFI_X, y: PFAD_START_Y },
    data: {
      label: '🔴 C1: Status Check',
      videoUrl: '',
      overlayText: 'Über ein Jahr aktiv – Respekt. Du bist weiter als 95% der Leute. Direkte Frage: Bist du profitabel?',
      interactionType: 'multipleChoice',
      answers: [
        '✅ Ja – ich bin profitabel',
        '⚖️ Ungefähr Break-Even',
        '📉 Noch nicht konstant – trotz der Erfahrung'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'orange',
      mcColor_2: 'red',
      delaySeconds: 40,
      nextNodes: { default: 'c2-engpass' }
    }
  },

  // C2: ENGPASS IDENTIFIZIEREN (45 Sek)
  {
    id: 'c2-engpass',
    type: 'video',
    position: { x: PROFI_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      label: '🔴 C2: Engpass',
      videoUrl: '',
      overlayText: 'Was ist der Engpass? Das EINE Ding das dich vom nächsten Level abhält?',
      interactionType: 'multipleChoice',
      answers: [
        '📈 Skalierung – größere Positionen, mehr Kapital',
        '📋 Prop-Firm – ich will eine Challenge bestehen',
        '🧠 Psychologie – ich handle unter meinem Potential',
        '🤝 Isolation – mir fehlt Austausch auf meinem Level',
        '🔧 Mein System funktioniert nicht mehr wie früher'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'medium',
      mcLayout: 'vertical',
      mcColor_0: 'green',
      mcColor_1: 'blue',
      mcColor_2: 'orange',
      mcColor_3: 'purple',
      mcColor_4: 'red',
      delaySeconds: 45,
      nextNodes: { default: 'c3-aha' }
    }
  },

  // C3: AHA-MOMENT FÜR PROFIS (55 Sek)
  {
    id: 'c3-aha',
    type: 'video',
    position: { x: PROFI_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      label: '🔴 C3: Aha-Moment',
      videoUrl: '',
      overlayText: 'Ab einem gewissen Level geht\'s nicht mehr um Wissen. Es geht um: 1. Feintuning 2. Accountability 3. Umfeld. Das kann ich dir bieten.',
      interactionType: 'singleButton',
      singleButtonText: 'Zeig mir wie 🚀',
      buttonColor: 'purple',
      buttonStyle: 'glassmorphism',
      buttonSize: 'large',
      buttonPosition: 'bottom-center',
      delaySeconds: 55,
      nextNodes: { default: 'c4-loesung' }
    }
  },

  // C4: LÖSUNG + PRODUKT + SOCIAL PROOF (75 Sek)
  {
    id: 'c4-loesung',
    type: 'video',
    position: { x: PROFI_X, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      label: '🔴 C4: Lösung + Produkt',
      videoUrl: '',
      overlayText: '1:1 Mentoring: Persönliche Zusammenarbeit, wir finden den Engpass und fixen ihn. Oder: Elite Mastermind mit anderen Profis. Oder erstmal 15 Min reden.',
      interactionType: 'multipleChoice',
      answers: [
        '🚀 Zeig mir das 1:1 Mentoring',
        '👥 Zeig mir die Elite Mastermind',
        '📞 Erstmal 15 Min reden'
      ],
      mcPosition: 'bottom-center',
      mcButtonSize: 'large',
      mcLayout: 'vertical',
      mcColor_0: 'purple',
      mcColor_1: 'blue',
      mcColor_2: 'green',
      delaySeconds: 75,
      nextNodes: { default: 'v-abschluss' }
    }
  },

  // ============ ABSCHLUSS-VIDEO (50 Sek) – ALLE ============
  {
    id: 'v-abschluss',
    type: 'video',
    position: { x: CENTER_X, y: ABSCHLUSS_Y },
    data: {
      label: 'V16: Abschluss + Open Loop',
      videoUrl: '',
      overlayText: 'Du hast mehr über deine Trading-Situation gelernt als die meisten in Monaten. Ich schau mir jede Antwort persönlich an. Check deine Mails – ich melde mich.',
      interactionType: 'singleButton',
      singleButtonText: 'Fertig ✅',
      buttonColor: 'green',
      buttonStyle: 'glassmorphism',
      buttonSize: 'large',
      buttonPosition: 'bottom-center',
      delaySeconds: 50,
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
      title: 'Deine Trading-Analyse 📊',
      description: 'Trag dich ein – ich schau mir deine Antworten persönlich an.',
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
      title: 'Check deine Mails! 📧',
      message: 'Wenn ich Potential sehe, melde ich mich persönlich. DMs sind offen – bis bald!',
      redirectUrl: ''
    }
  }
];

// ============= EDGE DEFINITIONS =============

export const smartTradingEdges: Edge[] = [
  // Start → Hook
  { id: 'e-start-hook', source: 'start', target: 'v1-hook', type: 'smoothstep' },
  
  // Hook → Story → Weiche
  { id: 'e-hook-story', source: 'v1-hook', target: 'v2-story', type: 'smoothstep' },
  { id: 'e-story-weiche', source: 'v2-story', target: 'v3-weiche', type: 'smoothstep' },
  
  // Weiche → Social Proof (alle Pfade)
  { id: 'e-weiche-social', source: 'v3-weiche', target: 'social-proof', type: 'smoothstep' },
  
  // Social Proof → 3 Pfade
  { id: 'e-social-anfaenger', source: 'social-proof', target: 'a1-traum', type: 'smoothstep', label: '🟢 Anfänger' },
  { id: 'e-social-fortgeschr', source: 'social-proof', target: 'b1-situation', type: 'smoothstep', label: '🟡 Fortgeschr.' },
  { id: 'e-social-profi', source: 'social-proof', target: 'c1-status', type: 'smoothstep', label: '🔴 Profi' },
  
  // ============ 🟢 ANFÄNGER-PFAD ============
  { id: 'e-a1-a2', source: 'a1-traum', target: 'a2-schmerz', type: 'smoothstep' },
  { id: 'e-a2-a3', source: 'a2-schmerz', target: 'a3-aha', type: 'smoothstep' },
  { id: 'e-a3-a4', source: 'a3-aha', target: 'a4-loesung', type: 'smoothstep' },
  { id: 'e-a4-abschluss', source: 'a4-loesung', target: 'v-abschluss', type: 'smoothstep' },
  
  // ============ 🟡 FORTGESCHRITTENEN-PFAD ============
  { id: 'e-b1-b2', source: 'b1-situation', target: 'b2-traum', type: 'smoothstep' },
  { id: 'e-b2-b3', source: 'b2-traum', target: 'b3-problem', type: 'smoothstep' },
  { id: 'e-b3-b4', source: 'b3-problem', target: 'b4-loesung', type: 'smoothstep' },
  { id: 'e-b4-abschluss', source: 'b4-loesung', target: 'v-abschluss', type: 'smoothstep' },
  
  // ============ 🔴 PROFI-PFAD ============
  { id: 'e-c1-c2', source: 'c1-status', target: 'c2-engpass', type: 'smoothstep' },
  { id: 'e-c2-c3', source: 'c2-engpass', target: 'c3-aha', type: 'smoothstep' },
  { id: 'e-c3-c4', source: 'c3-aha', target: 'c4-loesung', type: 'smoothstep' },
  { id: 'e-c4-abschluss', source: 'c4-loesung', target: 'v-abschluss', type: 'smoothstep' },
  
  // ============ ABSCHLUSS → LEAD → END ============
  { id: 'e-abschluss-lead', source: 'v-abschluss', target: 'lead-capture', type: 'smoothstep' },
  { id: 'e-lead-end', source: 'lead-capture', target: 'end', type: 'smoothstep' }
];
