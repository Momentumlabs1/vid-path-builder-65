import { Node, Edge } from '@xyflow/react';

// ========================================
// 🎬 SMART TRADING VIDEO FUNNEL V6.0
// 39 Videos | 2 Pfade (Anfänger + Fortgeschritten)
// ========================================

export const SMART_TRADING_FUNNEL_NAME = 'smart-trading-v6';

// Layout Constants
const CENTER_X = 0;
const ANFAENGER_X = -500;
const FORTGESCHRITTEN_X = 500;

// Y-Positionen
const START_Y = 0;
const ROW_HEIGHT = 200;

// Intro Phase Y-Positionen
const V1_Y = START_Y;
const V2_Y = V1_Y + ROW_HEIGHT;
const V3_Y = V2_Y + ROW_HEIGHT;
const V4_Y = V3_Y + ROW_HEIGHT;

// Pfad Start Y
const PFAD_START_Y = V4_Y + ROW_HEIGHT;

// Auffang-Video Offset (horizontal spread for options)
const OPTION_SPREAD = 150;

// Abschluss Y
const ABSCHLUSS_Y = PFAD_START_Y + ROW_HEIGHT * 10;
const LEAD_Y = ABSCHLUSS_Y + ROW_HEIGHT;
const END_Y = LEAD_Y + ROW_HEIGHT;

// ========================================
// 📹 PHASE 1: INTRO & WEICHE (6 Videos)
// ========================================

const introNodes: Node[] = [
  // Start Node
  {
    id: 'start',
    type: 'start',
    position: { x: CENTER_X, y: START_Y - ROW_HEIGHT },
    data: { label: 'Start' }
  },
  // V1: Begrüßung
  {
    id: 'v1-begruessung',
    type: 'video',
    position: { x: CENTER_X, y: V1_Y },
    data: {
      name: 'V1: Begrüßung',
      description: 'Hey ich bin Saif - Mehr Info? Ja/Nein',
      videoUrl: '',
      overlayText: 'Willst du erstmal mehr über mich wissen? Oder sollen wir direkt zum Trading-Part?',
      answerType: 'multipleChoice',
      answers: ['Erzähl mir mehr', 'Direkt los'],
      buttonText: 'Weiter',
      delaySeconds: 30,
    }
  },
  // V2a: Saif Story (wenn "Erzähl mir mehr")
  {
    id: 'v2a-story',
    type: 'video',
    position: { x: CENTER_X - 200, y: V2_Y },
    data: {
      name: 'V2a: Saif Story',
      description: 'Meine Geschichte - 10 Jahre Trading, 2 Jahre Katastrophe, dann der Durchbruch',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 50,
    }
  },
  // V2b: Direkt los (wenn "Direkt los")
  {
    id: 'v2b-direkt',
    type: 'video',
    position: { x: CENTER_X + 200, y: V2_Y },
    data: {
      name: 'V2b: Direkt los',
      description: 'Okay okay – da hats jemand eilig!',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 15,
    }
  },
  // V3a: Überleitung nach Story
  {
    id: 'v3a-ueberleitung',
    type: 'video',
    position: { x: CENTER_X - 200, y: V3_Y },
    data: {
      name: 'V3a: Überleitung Story',
      description: 'Jetzt weißt du wer ich bin. Jetzt bist du dran.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 10,
    }
  },
  // V3b: Überleitung Direkt
  {
    id: 'v3b-ueberleitung',
    type: 'video',
    position: { x: CENTER_X + 200, y: V3_Y },
    data: {
      name: 'V3b: Überleitung Direkt',
      description: 'Also, sag mir: Wo stehst du gerade?',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 10,
    }
  },
  // V4: Level-Frage (Die Weiche)
  {
    id: 'v4-level-frage',
    type: 'video',
    position: { x: CENTER_X, y: V4_Y },
    data: {
      name: 'V4: Level-Frage',
      description: 'Anfänger oder schon dabei? Die große Weiche.',
      videoUrl: '',
      overlayText: 'Fängst du gerade erst an mit Trading? Oder tradest du schon?',
      answerType: 'multipleChoice',
      answers: ['🟢 Ich fang gerade erst an', '🟡 Ich trade schon, aber noch nicht profitabel'],
      buttonText: 'Weiter',
      delaySeconds: 20,
    }
  },
];

// Intro Edges
const introEdges: Edge[] = [
  // Start → V1
  { id: 'e-start-v1', source: 'start', target: 'v1-begruessung', type: 'custom' },
  // V1 branches
  { id: 'e-v1-v2a', source: 'v1-begruessung', target: 'v2a-story', type: 'custom', label: 'Erzähl mir mehr' },
  { id: 'e-v1-v2b', source: 'v1-begruessung', target: 'v2b-direkt', type: 'custom', label: 'Direkt los' },
  // V2 → V3
  { id: 'e-v2a-v3a', source: 'v2a-story', target: 'v3a-ueberleitung', type: 'custom' },
  { id: 'e-v2b-v3b', source: 'v2b-direkt', target: 'v3b-ueberleitung', type: 'custom' },
  // V3 → V4
  { id: 'e-v3a-v4', source: 'v3a-ueberleitung', target: 'v4-level-frage', type: 'custom' },
  { id: 'e-v3b-v4', source: 'v3b-ueberleitung', target: 'v4-level-frage', type: 'custom' },
];

// ========================================
// 🟢 ANFÄNGER-FUNNEL (16 Videos)
// ========================================

const anfaengerNodes: Node[] = [
  // A1: Level auffangen
  {
    id: 'a1-level',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y },
    data: {
      name: 'A1: Level auffangen',
      description: 'Du fängst gerade erst an – perfekt. Das ist ein Vorteil.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 20,
    }
  },
  // A2: Frage Motivation
  {
    id: 'a2-motivation',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'A2: Frage Motivation',
      description: 'Was willst du mit Trading erreichen?',
      videoUrl: '',
      overlayText: 'Was ist dein Ziel?',
      answerType: 'multipleChoice',
      answers: ['Nebeneinkommen 500-2000€', 'Finanzielle Freiheit', 'Erstmal verstehen'],
      buttonText: 'Weiter',
      delaySeconds: 15,
    }
  },
  // A3a-c: Auffangen Motivation
  {
    id: 'a3a-nebeneinkommen',
    type: 'video',
    position: { x: ANFAENGER_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'A3a: Nebeneinkommen',
      description: '500-2000€ extra – solider Plan, realistisch, machbar.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  {
    id: 'a3b-freiheit',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'A3b: Finanzielle Freiheit',
      description: 'Großes Ziel. Respekt. Ist möglich – ich leb davon.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  {
    id: 'a3c-verstehen',
    type: 'video',
    position: { x: ANFAENGER_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'A3c: Verstehen',
      description: 'Bester Startpunkt überhaupt. Keine Gier, keine unrealistischen Erwartungen.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  // A4: Frage Blockade
  {
    id: 'a4-blockade',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      name: 'A4: Frage Blockade',
      description: 'Was hält dich aktuell zurück?',
      videoUrl: '',
      overlayText: 'Was ist die Blockade?',
      answerType: 'multipleChoice',
      answers: ['Angst vor Verlusten', 'Überforderung', 'Keine Zeit', 'Vertraue keinem Coach'],
      buttonText: 'Weiter',
      delaySeconds: 15,
    }
  },
  // A5a-d: Auffangen Blockade
  {
    id: 'a5a-angst',
    type: 'video',
    position: { x: ANFAENGER_X - OPTION_SPREAD * 1.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'A5a: Angst',
      description: 'Angst ist berechtigt. Du WIRST verlieren – aber kontrolliert.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  {
    id: 'a5b-ueberforderung',
    type: 'video',
    position: { x: ANFAENGER_X - OPTION_SPREAD * 0.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'A5b: Überforderung',
      description: '10 Mio YouTube Videos die sich widersprechen. Du brauchst EINEN Pfad.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  {
    id: 'a5c-zeit',
    type: 'video',
    position: { x: ANFAENGER_X + OPTION_SPREAD * 0.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'A5c: Zeit',
      description: 'Swing Trading: 30 Min am Tag reichen. Morgens oder abends Charts checken.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  {
    id: 'a5d-vertrauen',
    type: 'video',
    position: { x: ANFAENGER_X + OPTION_SPREAD * 1.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'A5d: Vertrauen',
      description: 'Gut so. Trading-Industrie voll mit Betrügern. Ich muss mir dein Vertrauen verdienen.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  // A6: Frage Ressourcen
  {
    id: 'a6-ressourcen',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 5 },
    data: {
      name: 'A6: Frage Ressourcen',
      description: 'Wie viel Zeit und Geld könntest du investieren?',
      videoUrl: '',
      overlayText: 'Klein starten, mittel, oder all-in?',
      answerType: 'multipleChoice',
      answers: ['Klein – wenig Zeit, wenig Geld', 'Mittel – paar Stunden, bisschen Kapital', 'All-in – ich bin ready'],
      buttonText: 'Weiter',
      delaySeconds: 15,
    }
  },
  // A7a-c: Auffangen Ressourcen
  {
    id: 'a7a-klein',
    type: 'video',
    position: { x: ANFAENGER_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 6 },
    data: {
      name: 'A7a: Klein',
      description: 'Absolut okay. Erstmal Demo, kostet nichts. 30 Min am Tag reichen.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  {
    id: 'a7b-mittel',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 6 },
    data: {
      name: 'A7b: Mittel',
      description: 'Perfekte Ausgangslage. Genug zum Lernen, nicht genug um alles zu verlieren.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  {
    id: 'a7c-allin',
    type: 'video',
    position: { x: ANFAENGER_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 6 },
    data: {
      name: 'A7c: All-in',
      description: 'Liebe die Energie. ABER: Auch mit viel Ressourcen – langsam aufbauen.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  // A8: Lösung
  {
    id: 'a8-loesung',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 7 },
    data: {
      name: 'A8: Lösung',
      description: 'Zusammenfassung: Grundlagen, simple Strategie, Demo-zu-Live Plan.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Zeig mir die Lösung',
      delaySeconds: 40,
    }
  },
  // A9: Produkt
  {
    id: 'a9-produkt',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 8 },
    data: {
      name: 'A9: Produkt',
      description: 'Starter Programm + kostenloser 5-Tage E-Mail-Kurs',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Zeig mir das Starter-Programm', 'Erstmal kostenloser E-Mail-Kurs', 'Ich hab noch Fragen'],
      buttonText: 'Auswählen',
      delaySeconds: 45,
    }
  },
];

// Anfänger Edges
const anfaengerEdges: Edge[] = [
  // V4 → A1
  { id: 'e-v4-a1', source: 'v4-level-frage', target: 'a1-level', type: 'custom', label: 'Anfänger' },
  // A1 → A2
  { id: 'e-a1-a2', source: 'a1-level', target: 'a2-motivation', type: 'custom' },
  // A2 branches
  { id: 'e-a2-a3a', source: 'a2-motivation', target: 'a3a-nebeneinkommen', type: 'custom', label: 'Nebeneink.' },
  { id: 'e-a2-a3b', source: 'a2-motivation', target: 'a3b-freiheit', type: 'custom', label: 'Freiheit' },
  { id: 'e-a2-a3c', source: 'a2-motivation', target: 'a3c-verstehen', type: 'custom', label: 'Verstehen' },
  // A3 → A4
  { id: 'e-a3a-a4', source: 'a3a-nebeneinkommen', target: 'a4-blockade', type: 'custom' },
  { id: 'e-a3b-a4', source: 'a3b-freiheit', target: 'a4-blockade', type: 'custom' },
  { id: 'e-a3c-a4', source: 'a3c-verstehen', target: 'a4-blockade', type: 'custom' },
  // A4 branches
  { id: 'e-a4-a5a', source: 'a4-blockade', target: 'a5a-angst', type: 'custom', label: 'Angst' },
  { id: 'e-a4-a5b', source: 'a4-blockade', target: 'a5b-ueberforderung', type: 'custom', label: 'Überford.' },
  { id: 'e-a4-a5c', source: 'a4-blockade', target: 'a5c-zeit', type: 'custom', label: 'Zeit' },
  { id: 'e-a4-a5d', source: 'a4-blockade', target: 'a5d-vertrauen', type: 'custom', label: 'Vertrauen' },
  // A5 → A6
  { id: 'e-a5a-a6', source: 'a5a-angst', target: 'a6-ressourcen', type: 'custom' },
  { id: 'e-a5b-a6', source: 'a5b-ueberforderung', target: 'a6-ressourcen', type: 'custom' },
  { id: 'e-a5c-a6', source: 'a5c-zeit', target: 'a6-ressourcen', type: 'custom' },
  { id: 'e-a5d-a6', source: 'a5d-vertrauen', target: 'a6-ressourcen', type: 'custom' },
  // A6 branches
  { id: 'e-a6-a7a', source: 'a6-ressourcen', target: 'a7a-klein', type: 'custom', label: 'Klein' },
  { id: 'e-a6-a7b', source: 'a6-ressourcen', target: 'a7b-mittel', type: 'custom', label: 'Mittel' },
  { id: 'e-a6-a7c', source: 'a6-ressourcen', target: 'a7c-allin', type: 'custom', label: 'All-in' },
  // A7 → A8
  { id: 'e-a7a-a8', source: 'a7a-klein', target: 'a8-loesung', type: 'custom' },
  { id: 'e-a7b-a8', source: 'a7b-mittel', target: 'a8-loesung', type: 'custom' },
  { id: 'e-a7c-a8', source: 'a7c-allin', target: 'a8-loesung', type: 'custom' },
  // A8 → A9
  { id: 'e-a8-a9', source: 'a8-loesung', target: 'a9-produkt', type: 'custom' },
];

// ========================================
// 🟡 FORTGESCHRITTEN-FUNNEL (16 Videos)
// ========================================

const fortgeschrittenNodes: Node[] = [
  // F1: Level auffangen
  {
    id: 'f1-level',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y },
    data: {
      name: 'F1: Level auffangen',
      description: 'Du tradest schon, bist aber noch nicht profitabel. Die härteste Phase.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  // F2: Frage Situation
  {
    id: 'f2-situation',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'F2: Frage Situation',
      description: 'Wie siehts bei dir gerade aus?',
      videoUrl: '',
      overlayText: 'Verlierst du, Break-Even, oder random?',
      answerType: 'multipleChoice',
      answers: ['Ich verliere mehr als ich gewinne', 'Break-Even – mal plus, mal minus', 'Komplett inkonsistent'],
      buttonText: 'Weiter',
      delaySeconds: 15,
    }
  },
  // F3a-c: Auffangen Situation
  {
    id: 'f3a-verlust',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'F3a: Verlust',
      description: 'Hart aber gut – es gibt ein KLARES Problem das wir finden können.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 30,
    }
  },
  {
    id: 'f3b-breakeven',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'F3b: Break-Even',
      description: 'Du bist besser als 80% der Trader. Oft nur ein kleiner Shift nötig.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 30,
    }
  },
  {
    id: 'f3c-inkonsistent',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'F3c: Inkonsistent',
      description: 'Keine klare Strategie oder du hältst dich nicht dran. Beides lösbar.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 30,
    }
  },
  // F4: Frage Problem
  {
    id: 'f4-problem',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      name: 'F4: Frage Problem',
      description: 'Was ist dein größtes Problem?',
      videoUrl: '',
      overlayText: 'Strategie, Emotionen, oder Risk Management?',
      answerType: 'multipleChoice',
      answers: ['Strategie – hab keine die funktioniert', 'Emotionen – halt mich nicht an Regeln', 'Risk Management – verlier zu viel', 'Weiß ich nicht'],
      buttonText: 'Weiter',
      delaySeconds: 15,
    }
  },
  // F5a-d: Auffangen Problem
  {
    id: 'f5a-strategie',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X - OPTION_SPREAD * 1.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'F5a: Strategie',
      description: 'Du springst von System zu System. Du brauchst EIN System.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  {
    id: 'f5b-emotionen',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X - OPTION_SPREAD * 0.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'F5b: Emotionen',
      description: 'Das HÄRTESTE Problem. Du brauchst Accountability.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  {
    id: 'f5c-risk',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X + OPTION_SPREAD * 0.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'F5c: Risk Management',
      description: 'Der EINFACHSTE Fix. Klare Regeln, konsequent durchziehen.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  {
    id: 'f5d-weissnicht',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X + OPTION_SPREAD * 1.5, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'F5d: Weiß nicht',
      description: 'Blinder Fleck. Mit Blick von außen oft in 5 Min klar.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 35,
    }
  },
  // F6: Frage Ziel
  {
    id: 'f6-ziel',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 5 },
    data: {
      name: 'F6: Frage Ziel',
      description: 'Was ist dein Ziel für die nächsten 12 Monate?',
      videoUrl: '',
      overlayText: 'Profitabel, Prop-Firm, oder Vollzeit?',
      answerType: 'multipleChoice',
      answers: ['Endlich profitabel werden', 'Prop-Firm Challenge bestehen', 'Trading zum Hauptjob machen'],
      buttonText: 'Weiter',
      delaySeconds: 15,
    }
  },
  // F7a-c: Auffangen Ziel
  {
    id: 'f7a-profitabel',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 6 },
    data: {
      name: 'F7a: Profitabel',
      description: 'Der Klassiker. Komplett erreichbar mit Strategie und Disziplin.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  {
    id: 'f7b-propfirm',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 6 },
    data: {
      name: 'F7b: Prop-Firm',
      description: 'Smarter Move. ABER: Challenges sind designed damit du scheiterst.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  {
    id: 'f7c-vollzeit',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 6 },
    data: {
      name: 'F7c: Vollzeit',
      description: 'Großer Schritt. Mind. 12 Monate profitabel + 6 Monate Rücklagen.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Weiter',
      delaySeconds: 25,
    }
  },
  // F8: Lösung
  {
    id: 'f8-loesung',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 7 },
    data: {
      name: 'F8: Lösung',
      description: 'Du brauchst: EIN System, Feedback, Accountability.',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Zeig mir die Lösung',
      delaySeconds: 40,
    }
  },
  // F9: Produkt
  {
    id: 'f9-produkt',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 8 },
    data: {
      name: 'F9: Produkt',
      description: '8-Wochen Coaching + kostenloser Live-Workshop',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Zeig mir das Coaching', 'Zum kostenlosen Workshop', 'Ich will erstmal reden'],
      buttonText: 'Auswählen',
      delaySeconds: 50,
    }
  },
];

// Fortgeschritten Edges
const fortgeschrittenEdges: Edge[] = [
  // V4 → F1
  { id: 'e-v4-f1', source: 'v4-level-frage', target: 'f1-level', type: 'custom', label: 'Fortgeschr.' },
  // F1 → F2
  { id: 'e-f1-f2', source: 'f1-level', target: 'f2-situation', type: 'custom' },
  // F2 branches
  { id: 'e-f2-f3a', source: 'f2-situation', target: 'f3a-verlust', type: 'custom', label: 'Verlust' },
  { id: 'e-f2-f3b', source: 'f2-situation', target: 'f3b-breakeven', type: 'custom', label: 'Break-Even' },
  { id: 'e-f2-f3c', source: 'f2-situation', target: 'f3c-inkonsistent', type: 'custom', label: 'Inkonsist.' },
  // F3 → F4
  { id: 'e-f3a-f4', source: 'f3a-verlust', target: 'f4-problem', type: 'custom' },
  { id: 'e-f3b-f4', source: 'f3b-breakeven', target: 'f4-problem', type: 'custom' },
  { id: 'e-f3c-f4', source: 'f3c-inkonsistent', target: 'f4-problem', type: 'custom' },
  // F4 branches
  { id: 'e-f4-f5a', source: 'f4-problem', target: 'f5a-strategie', type: 'custom', label: 'Strategie' },
  { id: 'e-f4-f5b', source: 'f4-problem', target: 'f5b-emotionen', type: 'custom', label: 'Emotionen' },
  { id: 'e-f4-f5c', source: 'f4-problem', target: 'f5c-risk', type: 'custom', label: 'Risk' },
  { id: 'e-f4-f5d', source: 'f4-problem', target: 'f5d-weissnicht', type: 'custom', label: 'Unsicher' },
  // F5 → F6
  { id: 'e-f5a-f6', source: 'f5a-strategie', target: 'f6-ziel', type: 'custom' },
  { id: 'e-f5b-f6', source: 'f5b-emotionen', target: 'f6-ziel', type: 'custom' },
  { id: 'e-f5c-f6', source: 'f5c-risk', target: 'f6-ziel', type: 'custom' },
  { id: 'e-f5d-f6', source: 'f5d-weissnicht', target: 'f6-ziel', type: 'custom' },
  // F6 branches
  { id: 'e-f6-f7a', source: 'f6-ziel', target: 'f7a-profitabel', type: 'custom', label: 'Profitabel' },
  { id: 'e-f6-f7b', source: 'f6-ziel', target: 'f7b-propfirm', type: 'custom', label: 'Prop-Firm' },
  { id: 'e-f6-f7c', source: 'f6-ziel', target: 'f7c-vollzeit', type: 'custom', label: 'Vollzeit' },
  // F7 → F8
  { id: 'e-f7a-f8', source: 'f7a-profitabel', target: 'f8-loesung', type: 'custom' },
  { id: 'e-f7b-f8', source: 'f7b-propfirm', target: 'f8-loesung', type: 'custom' },
  { id: 'e-f7c-f8', source: 'f7c-vollzeit', target: 'f8-loesung', type: 'custom' },
  // F8 → F9
  { id: 'e-f8-f9', source: 'f8-loesung', target: 'f9-produkt', type: 'custom' },
];

// ========================================
// 🎬 ABSCHLUSS + LEAD CAPTURE + END
// ========================================

const abschlussNodes: Node[] = [
  {
    id: 'abschluss',
    type: 'video',
    position: { x: CENTER_X, y: ABSCHLUSS_Y },
    data: {
      name: 'Abschluss',
      description: 'Willkommen bei Smart Trading. Check deine Mails. DMs sind offen.',
      videoUrl: '',
      overlayText: 'Schon profitabel und willst aufs nächste Level? Schreib mir direkt.',
      answerType: 'button',
      buttonText: 'Fertig ✅',
      delaySeconds: 35,
    }
  },
  // Lead Capture
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
  // End
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

// Abschluss Edges
const abschlussEdges: Edge[] = [
  // A9 → Abschluss
  { id: 'e-a9-abschluss', source: 'a9-produkt', target: 'abschluss', type: 'custom' },
  // F9 → Abschluss
  { id: 'e-f9-abschluss', source: 'f9-produkt', target: 'abschluss', type: 'custom' },
  // Abschluss → Lead Capture
  { id: 'e-abschluss-lead', source: 'abschluss', target: 'lead-capture', type: 'custom' },
  // Lead Capture → End
  { id: 'e-lead-end', source: 'lead-capture', target: 'end', type: 'custom' },
];

// ========================================
// EXPORT: Alle Nodes und Edges
// ========================================

export const smartTradingNodes: Node[] = [
  ...introNodes,
  ...anfaengerNodes,
  ...fortgeschrittenNodes,
  ...abschlussNodes,
];

export const smartTradingEdges: Edge[] = [
  ...introEdges,
  ...anfaengerEdges,
  ...fortgeschrittenEdges,
  ...abschlussEdges,
];
