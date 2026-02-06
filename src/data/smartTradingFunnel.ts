import { Node, Edge } from '@xyflow/react';

// ========================================
// 🎬 SMART TRADING VIDEO FUNNEL V11 - FINAL
// 24 Videos | 2 Pfade (Anfänger + Fortgeschritten)
// Jede Antwort wird im nächsten Video aufgefangen
// ========================================

export const SMART_TRADING_FUNNEL_NAME = 'smart-trading-v11';

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

// Pfad Start Y (nach Intro)
const PFAD_START_Y = V2_Y + ROW_HEIGHT * 1.5;

// Auffang-Video Offset (horizontal spread for options)
const OPTION_SPREAD = 180;

// Abschluss Y
const ABSCHLUSS_Y = PFAD_START_Y + ROW_HEIGHT * 8;

// ========================================
// 📹 PHASE 1: INTRO (3 Videos)
// ========================================

const introNodes: Node[] = [
  // Start Node
  {
    id: 'start',
    type: 'start',
    position: { x: CENTER_X, y: START_Y - ROW_HEIGHT },
    data: { label: 'Start' }
  },
  // V1: Begrüßung + Weiche
  {
    id: 'v1-begruessung',
    type: 'video',
    position: { x: CENTER_X, y: V1_Y },
    data: {
      name: 'V1: Begrüßung',
      description: 'Hey ich bin Saif - Mehr wissen oder direkt los?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Erzähl mir mehr', 'Direkt los'],
      mcButtonWidth: 'large',
      mcButtonHeight: 'large',
      mcTextSize: 'medium',
      mcLayout: 'horizontal',
      delaySeconds: 30,
      nextNodes: {
        '0': 'v2a-story',
        '1': 'v2b-direkt'
      }
    }
  },
  // V2a: Story + Level-Frage
  {
    id: 'v2a-story',
    type: 'video',
    position: { x: CENTER_X - 200, y: V2_Y },
    data: {
      name: 'V2a: Story',
      description: 'Meine Geschichte - Anfänger oder Fortgeschritten?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Ich fang gerade erst an', 'Ich trade schon'],
      mcButtonWidth: 'large',
      mcButtonHeight: 'large',
      mcTextSize: 'medium',
      mcLayout: 'horizontal',
      delaySeconds: 85,
      nextNodes: {
        '0': 'a1-ausloeser',
        '1': 'f1-situation'
      }
    }
  },
  // V2b: Direkt los + Level-Frage
  {
    id: 'v2b-direkt',
    type: 'video',
    position: { x: CENTER_X + 200, y: V2_Y },
    data: {
      name: 'V2b: Direkt',
      description: 'Okay - Anfänger oder Fortgeschritten?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Ich fang gerade erst an', 'Ich trade schon'],
      mcButtonWidth: 'large',
      mcButtonHeight: 'large',
      mcTextSize: 'medium',
      mcLayout: 'horizontal',
      delaySeconds: 20,
      nextNodes: {
        '0': 'a1-ausloeser',
        '1': 'f1-situation'
      }
    }
  },
];

// Intro Edges
const introEdges: Edge[] = [
  { id: 'e-start-v1', source: 'start', target: 'v1-begruessung', type: 'custom' },
  { id: 'e-v1-v2a', source: 'v1-begruessung', target: 'v2a-story', type: 'custom', label: 'Erzähl mir mehr' },
  { id: 'e-v1-v2b', source: 'v1-begruessung', target: 'v2b-direkt', type: 'custom', label: 'Direkt los' },
  { id: 'e-v2a-a1', source: 'v2a-story', target: 'a1-ausloeser', type: 'custom', label: 'Anfänger' },
  { id: 'e-v2a-f1', source: 'v2a-story', target: 'f1-situation', type: 'custom', label: 'Fortgeschr.' },
  { id: 'e-v2b-a1', source: 'v2b-direkt', target: 'a1-ausloeser', type: 'custom', label: 'Anfänger' },
  { id: 'e-v2b-f1', source: 'v2b-direkt', target: 'f1-situation', type: 'custom', label: 'Fortgeschr.' },
];

// ========================================
// 🟢 ANFÄNGER-PFAD (10 Videos)
// ========================================

const anfaengerNodes: Node[] = [
  // A1: Anfänger Auffangen + Frage 1: Auslöser
  {
    id: 'a1-ausloeser',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y },
    data: {
      name: 'A1: Auslöser',
      description: 'Du fängst gerade erst an – Was hat dich hierher gebracht?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Ich hab endlich Zeit', 'Ich bin unzufrieden', 'Ich hab Leute gesehen bei denen es funktioniert'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 35,
      nextNodes: {
        '0': 'a2a-zeit',
        '1': 'a2b-unzufrieden',
        '2': 'a2c-inspiration'
      }
    }
  },
  // A2a: Auffangen "Zeit" + Frage 2: Ziel
  {
    id: 'a2a-zeit',
    type: 'video',
    position: { x: ANFAENGER_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'A2a: Zeit',
      description: 'Du hast endlich Zeit – Was willst du erreichen?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Nebeneinkommen 500-2000€', 'Finanzielle Freiheit', 'Erstmal verstehen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 30,
      nextNodes: {
        '0': 'a3a-nebeneinkommen',
        '1': 'a3b-freiheit',
        '2': 'a3c-verstehen'
      }
    }
  },
  // A2b: Auffangen "Unzufriedenheit" + Frage 2: Ziel
  {
    id: 'a2b-unzufrieden',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'A2b: Unzufriedenheit',
      description: 'Du bist unzufrieden – Was willst du erreichen?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Nebeneinkommen 500-2000€', 'Finanzielle Freiheit', 'Erstmal verstehen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 30,
      nextNodes: {
        '0': 'a3a-nebeneinkommen',
        '1': 'a3b-freiheit',
        '2': 'a3c-verstehen'
      }
    }
  },
  // A2c: Auffangen "Inspiration" + Frage 2: Ziel
  {
    id: 'a2c-inspiration',
    type: 'video',
    position: { x: ANFAENGER_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'A2c: Inspiration',
      description: 'Du hast andere gesehen – Was willst du erreichen?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Nebeneinkommen 500-2000€', 'Finanzielle Freiheit', 'Erstmal verstehen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 30,
      nextNodes: {
        '0': 'a3a-nebeneinkommen',
        '1': 'a3b-freiheit',
        '2': 'a3c-verstehen'
      }
    }
  },
  // A3a: Auffangen "Nebeneinkommen" + Frage 3: Blockade
  {
    id: 'a3a-nebeneinkommen',
    type: 'video',
    position: { x: ANFAENGER_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'A3a: Nebeneinkommen',
      description: 'Nebeneinkommen aufbauen – Was hält dich zurück?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Angst vor Verlusten', 'Überforderung – weiß nicht wo anfangen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 35,
      nextNodes: {
        '0': 'a4a-angst',
        '1': 'a4b-ueberforderung'
      }
    }
  },
  // A3b: Auffangen "Freiheit" + Frage 3: Blockade
  {
    id: 'a3b-freiheit',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'A3b: Freiheit',
      description: 'Finanzielle Freiheit – Was hält dich zurück?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Angst vor Verlusten', 'Überforderung – weiß nicht wo anfangen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 35,
      nextNodes: {
        '0': 'a4a-angst',
        '1': 'a4b-ueberforderung'
      }
    }
  },
  // A3c: Auffangen "Verstehen" + Frage 3: Blockade
  {
    id: 'a3c-verstehen',
    type: 'video',
    position: { x: ANFAENGER_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'A3c: Verstehen',
      description: 'Erstmal verstehen – Was hält dich zurück?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Angst vor Verlusten', 'Überforderung – weiß nicht wo anfangen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 30,
      nextNodes: {
        '0': 'a4a-angst',
        '1': 'a4b-ueberforderung'
      }
    }
  },
  // A4a: Auffangen "Angst" + Frage 4: Budget-Slider
  {
    id: 'a4a-angst',
    type: 'video',
    position: { x: ANFAENGER_X - OPTION_SPREAD / 2, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      name: 'A4a: Angst',
      description: 'Angst vor Verlusten – Budget-Frage',
      videoUrl: '',
      overlayText: '',
      answerType: 'budgetSlider',
      sliderMin: 0,
      sliderMax: 10000,
      sliderStep: 100,
      sliderSubmitText: 'Weiter',
      sliderSubmitColor: 'purple',
      sliderSubmitStyle: 'glassmorphism',
      delaySeconds: 45,
      nextNodes: {
        'default': 'a5-resuemee'
      }
    }
  },
  // A4b: Auffangen "Überforderung" + Frage 4: Budget-Slider
  {
    id: 'a4b-ueberforderung',
    type: 'video',
    position: { x: ANFAENGER_X + OPTION_SPREAD / 2, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      name: 'A4b: Überforderung',
      description: 'Überforderung – Budget-Frage',
      videoUrl: '',
      overlayText: '',
      answerType: 'budgetSlider',
      sliderMin: 0,
      sliderMax: 10000,
      sliderStep: 100,
      sliderSubmitText: 'Weiter',
      sliderSubmitColor: 'purple',
      sliderSubmitStyle: 'glassmorphism',
      delaySeconds: 45,
      nextNodes: {
        'default': 'a5-resuemee'
      }
    }
  },
  // A5: Resümee + Call-Buchung
  {
    id: 'a5-resuemee',
    type: 'video',
    position: { x: ANFAENGER_X, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'A5: Resümee',
      description: 'Zusammenfassung + Call buchen',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Termin buchen',
      buttonColor: 'green',
      buttonStyle: 'gradient',
      buttonWidth: 'xl',
      buttonHeight: 'xl',
      buttonTextSize: 'large',
      delaySeconds: 45,
      nextNodes: {
        'default': 'v-end'
      }
    }
  },
];

// Anfänger Edges
const anfaengerEdges: Edge[] = [
  // A1 → A2
  { id: 'e-a1-a2a', source: 'a1-ausloeser', target: 'a2a-zeit', type: 'custom', label: 'Zeit' },
  { id: 'e-a1-a2b', source: 'a1-ausloeser', target: 'a2b-unzufrieden', type: 'custom', label: 'Unzufrieden' },
  { id: 'e-a1-a2c', source: 'a1-ausloeser', target: 'a2c-inspiration', type: 'custom', label: 'Inspiration' },
  // A2 → A3
  { id: 'e-a2a-a3a', source: 'a2a-zeit', target: 'a3a-nebeneinkommen', type: 'custom', label: 'Nebenein.' },
  { id: 'e-a2a-a3b', source: 'a2a-zeit', target: 'a3b-freiheit', type: 'custom', label: 'Freiheit' },
  { id: 'e-a2a-a3c', source: 'a2a-zeit', target: 'a3c-verstehen', type: 'custom', label: 'Verstehen' },
  { id: 'e-a2b-a3a', source: 'a2b-unzufrieden', target: 'a3a-nebeneinkommen', type: 'custom' },
  { id: 'e-a2b-a3b', source: 'a2b-unzufrieden', target: 'a3b-freiheit', type: 'custom' },
  { id: 'e-a2b-a3c', source: 'a2b-unzufrieden', target: 'a3c-verstehen', type: 'custom' },
  { id: 'e-a2c-a3a', source: 'a2c-inspiration', target: 'a3a-nebeneinkommen', type: 'custom' },
  { id: 'e-a2c-a3b', source: 'a2c-inspiration', target: 'a3b-freiheit', type: 'custom' },
  { id: 'e-a2c-a3c', source: 'a2c-inspiration', target: 'a3c-verstehen', type: 'custom' },
  // A3 → A4
  { id: 'e-a3a-a4a', source: 'a3a-nebeneinkommen', target: 'a4a-angst', type: 'custom', label: 'Angst' },
  { id: 'e-a3a-a4b', source: 'a3a-nebeneinkommen', target: 'a4b-ueberforderung', type: 'custom', label: 'Überforder.' },
  { id: 'e-a3b-a4a', source: 'a3b-freiheit', target: 'a4a-angst', type: 'custom' },
  { id: 'e-a3b-a4b', source: 'a3b-freiheit', target: 'a4b-ueberforderung', type: 'custom' },
  { id: 'e-a3c-a4a', source: 'a3c-verstehen', target: 'a4a-angst', type: 'custom' },
  { id: 'e-a3c-a4b', source: 'a3c-verstehen', target: 'a4b-ueberforderung', type: 'custom' },
  // A4 → A5
  { id: 'e-a4a-a5', source: 'a4a-angst', target: 'a5-resuemee', type: 'custom' },
  { id: 'e-a4b-a5', source: 'a4b-ueberforderung', target: 'a5-resuemee', type: 'custom' },
  // A5 → END
  { id: 'e-a5-end', source: 'a5-resuemee', target: 'v-end', type: 'custom' },
];

// ========================================
// 🟡 FORTGESCHRITTEN-PFAD (10 Videos)
// ========================================

const fortgeschrittenNodes: Node[] = [
  // F1: Fortgeschritten Auffangen + Frage 1: Situation
  {
    id: 'f1-situation',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y },
    data: {
      name: 'F1: Situation',
      description: 'Du tradest schon – Wie siehts bei dir aus?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Ich verliere unterm Strich', 'Break-Even – mal plus, mal minus', 'Komplett random'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 35,
      nextNodes: {
        '0': 'f2a-verlust',
        '1': 'f2b-breakeven',
        '2': 'f2c-random'
      }
    }
  },
  // F2a: Auffangen "Verlust" + Frage 2: Problem
  {
    id: 'f2a-verlust',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'F2a: Verlust',
      description: 'Du verlierst – Was ist das Problem?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Keine funktionierende Strategie', 'Emotionen – ich halt mich nicht an Regeln'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 40,
      nextNodes: {
        '0': 'f3a-strategie',
        '1': 'f3b-emotionen'
      }
    }
  },
  // F2b: Auffangen "Break-Even" + Frage 2: Problem
  {
    id: 'f2b-breakeven',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'F2b: Break-Even',
      description: 'Break-Even – Was ist das Problem?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Keine funktionierende Strategie', 'Emotionen – ich halt mich nicht an Regeln'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 40,
      nextNodes: {
        '0': 'f3a-strategie',
        '1': 'f3b-emotionen'
      }
    }
  },
  // F2c: Auffangen "Random" + Frage 2: Problem
  {
    id: 'f2c-random',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT },
    data: {
      name: 'F2c: Random',
      description: 'Komplett random – Was ist das Problem?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Keine funktionierende Strategie', 'Emotionen – ich halt mich nicht an Regeln'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 40,
      nextNodes: {
        '0': 'f3a-strategie',
        '1': 'f3b-emotionen'
      }
    }
  },
  // F3a: Auffangen "Strategie" + Frage 3: Ziel
  {
    id: 'f3a-strategie',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X - OPTION_SPREAD / 2, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'F3a: Strategie',
      description: 'Keine Strategie – Was ist dein Ziel?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Endlich profitabel werden', 'Prop-Firm Challenge bestehen', 'Trading zum Hauptjob machen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 45,
      nextNodes: {
        '0': 'f4a-profitabel',
        '1': 'f4b-propfirm',
        '2': 'f4c-vollzeit'
      }
    }
  },
  // F3b: Auffangen "Emotionen" + Frage 3: Ziel
  {
    id: 'f3b-emotionen',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X + OPTION_SPREAD / 2, y: PFAD_START_Y + ROW_HEIGHT * 2 },
    data: {
      name: 'F3b: Emotionen',
      description: 'Emotionen – Was ist dein Ziel?',
      videoUrl: '',
      overlayText: '',
      answerType: 'multipleChoice',
      answers: ['Endlich profitabel werden', 'Prop-Firm Challenge bestehen', 'Trading zum Hauptjob machen'],
      mcButtonWidth: 'xl',
      mcButtonHeight: 'large',
      mcTextSize: 'small',
      mcLayout: 'vertical',
      delaySeconds: 45,
      nextNodes: {
        '0': 'f4a-profitabel',
        '1': 'f4b-propfirm',
        '2': 'f4c-vollzeit'
      }
    }
  },
  // F4a: Auffangen "Profitabel" + Frage 4: Budget-Slider
  {
    id: 'f4a-profitabel',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X - OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      name: 'F4a: Profitabel',
      description: 'Endlich profitabel – Budget-Frage',
      videoUrl: '',
      overlayText: '',
      answerType: 'budgetSlider',
      sliderMin: 0,
      sliderMax: 10000,
      sliderStep: 100,
      sliderSubmitText: 'Weiter',
      sliderSubmitColor: 'purple',
      sliderSubmitStyle: 'glassmorphism',
      delaySeconds: 40,
      nextNodes: {
        'default': 'f5-resuemee'
      }
    }
  },
  // F4b: Auffangen "Prop-Firm" + Frage 4: Budget-Slider
  {
    id: 'f4b-propfirm',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      name: 'F4b: Prop-Firm',
      description: 'Prop-Firm Challenge – Budget-Frage',
      videoUrl: '',
      overlayText: '',
      answerType: 'budgetSlider',
      sliderMin: 0,
      sliderMax: 10000,
      sliderStep: 100,
      sliderSubmitText: 'Weiter',
      sliderSubmitColor: 'purple',
      sliderSubmitStyle: 'glassmorphism',
      delaySeconds: 40,
      nextNodes: {
        'default': 'f5-resuemee'
      }
    }
  },
  // F4c: Auffangen "Vollzeit" + Frage 4: Budget-Slider
  {
    id: 'f4c-vollzeit',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X + OPTION_SPREAD, y: PFAD_START_Y + ROW_HEIGHT * 3 },
    data: {
      name: 'F4c: Vollzeit',
      description: 'Trading als Hauptjob – Budget-Frage',
      videoUrl: '',
      overlayText: '',
      answerType: 'budgetSlider',
      sliderMin: 0,
      sliderMax: 10000,
      sliderStep: 100,
      sliderSubmitText: 'Weiter',
      sliderSubmitColor: 'purple',
      sliderSubmitStyle: 'glassmorphism',
      delaySeconds: 40,
      nextNodes: {
        'default': 'f5-resuemee'
      }
    }
  },
  // F5: Resümee + Call-Buchung
  {
    id: 'f5-resuemee',
    type: 'video',
    position: { x: FORTGESCHRITTEN_X, y: PFAD_START_Y + ROW_HEIGHT * 4 },
    data: {
      name: 'F5: Resümee',
      description: 'Zusammenfassung + Call buchen',
      videoUrl: '',
      overlayText: '',
      answerType: 'button',
      buttonText: 'Termin buchen',
      buttonColor: 'green',
      buttonStyle: 'gradient',
      buttonWidth: 'xl',
      buttonHeight: 'xl',
      buttonTextSize: 'large',
      delaySeconds: 45,
      nextNodes: {
        'default': 'v-end'
      }
    }
  },
];

// Fortgeschritten Edges
const fortgeschrittenEdges: Edge[] = [
  // F1 → F2
  { id: 'e-f1-f2a', source: 'f1-situation', target: 'f2a-verlust', type: 'custom', label: 'Verlust' },
  { id: 'e-f1-f2b', source: 'f1-situation', target: 'f2b-breakeven', type: 'custom', label: 'Break-Even' },
  { id: 'e-f1-f2c', source: 'f1-situation', target: 'f2c-random', type: 'custom', label: 'Random' },
  // F2 → F3
  { id: 'e-f2a-f3a', source: 'f2a-verlust', target: 'f3a-strategie', type: 'custom', label: 'Strategie' },
  { id: 'e-f2a-f3b', source: 'f2a-verlust', target: 'f3b-emotionen', type: 'custom', label: 'Emotionen' },
  { id: 'e-f2b-f3a', source: 'f2b-breakeven', target: 'f3a-strategie', type: 'custom' },
  { id: 'e-f2b-f3b', source: 'f2b-breakeven', target: 'f3b-emotionen', type: 'custom' },
  { id: 'e-f2c-f3a', source: 'f2c-random', target: 'f3a-strategie', type: 'custom' },
  { id: 'e-f2c-f3b', source: 'f2c-random', target: 'f3b-emotionen', type: 'custom' },
  // F3 → F4
  { id: 'e-f3a-f4a', source: 'f3a-strategie', target: 'f4a-profitabel', type: 'custom', label: 'Profitabel' },
  { id: 'e-f3a-f4b', source: 'f3a-strategie', target: 'f4b-propfirm', type: 'custom', label: 'Prop-Firm' },
  { id: 'e-f3a-f4c', source: 'f3a-strategie', target: 'f4c-vollzeit', type: 'custom', label: 'Vollzeit' },
  { id: 'e-f3b-f4a', source: 'f3b-emotionen', target: 'f4a-profitabel', type: 'custom' },
  { id: 'e-f3b-f4b', source: 'f3b-emotionen', target: 'f4b-propfirm', type: 'custom' },
  { id: 'e-f3b-f4c', source: 'f3b-emotionen', target: 'f4c-vollzeit', type: 'custom' },
  // F4 → F5
  { id: 'e-f4a-f5', source: 'f4a-profitabel', target: 'f5-resuemee', type: 'custom' },
  { id: 'e-f4b-f5', source: 'f4b-propfirm', target: 'f5-resuemee', type: 'custom' },
  { id: 'e-f4c-f5', source: 'f4c-vollzeit', target: 'f5-resuemee', type: 'custom' },
  // F5 → END
  { id: 'e-f5-end', source: 'f5-resuemee', target: 'v-end', type: 'custom' },
];

// ========================================
// 🏁 ABSCHLUSS (1 Video)
// ========================================

const abschlussNodes: Node[] = [
  // V-END: Bestätigung
  {
    id: 'v-end',
    type: 'video',
    position: { x: CENTER_X, y: ABSCHLUSS_Y },
    data: {
      name: 'V-END: Bestätigung',
      description: 'Willkommen bei Smart Trading – Check deine Mails',
      videoUrl: '',
      overlayText: '',
      answerType: 'none',
      delaySeconds: 0,
    }
  },
  // End Node
  {
    id: 'end',
    type: 'end',
    position: { x: CENTER_X, y: ABSCHLUSS_Y + ROW_HEIGHT },
    data: {
      title: 'Funnel abgeschlossen',
      message: 'Vielen Dank für deine Zeit. Wir melden uns bei dir!',
    }
  },
];

const abschlussEdges: Edge[] = [
  { id: 'e-vend-end', source: 'v-end', target: 'end', type: 'custom' },
];

// ========================================
// 📦 EXPORT
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
