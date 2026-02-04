// Smart Trading Video Funnel V2.0 - Extended Version
// Kompletter Funnel mit 3 Pfaden: Anfänger, Fortgeschritten, Profi
// LAYOUT: Pfade sind horizontal getrennt um Überlappung zu vermeiden

import { Node, Edge } from '@xyflow/react';

// ============= LAYOUT KONSTANTEN =============
// Horizontale Bereiche für jeden Pfad (verhindert Überlappung)
const ANFAENGER_X = 0;        // 🟢 Anfänger: linke Spalte
const FORTGESCHRITTEN_X = 700; // 🟡 Fortgeschritten: mittlere Spalte  
const PROFI_X = 1400;          // 🔴 Profi: rechte Spalte
const CENTER_X = 700;          // Gemeinsamer Start in der Mitte

// Vertikale Abstände
const ROW_HEIGHT = 220;        // Abstand zwischen Zeilen
const SUB_ROW_HEIGHT = 180;    // Kleinerer Abstand für Unter-Varianten

// ============= NODE DEFINITIONS =============

// Gemeinsamer Start (zentriert)
const startNode: Node = {
  id: 'start',
  type: 'start',
  position: { x: CENTER_X, y: 50 },
  data: { label: 'Start' }
};

// VIDEO 1: Welcome (Alle Pfade)
const video1Welcome: Node = {
  id: 'video-1-welcome',
  type: 'video',
  position: { x: CENTER_X, y: 50 + ROW_HEIGHT },
  data: {
    label: 'V1: Welcome',
    videoUrl: '',
    overlayText: 'Hey, schön dass du hier bist. Ich bin Saif...',
    answerType: 'button',
    buttonText: "Deal – Los geht's 👊",
    buttonColor: 'purple',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 45
  }
};

// VIDEO 2: Level-Frage (Die Weiche)
const video2Level: Node = {
  id: 'video-2-level',
  type: 'video',
  position: { x: CENTER_X, y: 50 + ROW_HEIGHT * 2 },
  data: {
    label: 'V2: Wie lange tradest du?',
    videoUrl: '',
    overlayText: 'Wie lange hast du schon ECHTES GELD im Markt?',
    answerType: 'multipleChoice',
    answers: [
      '🟢 Noch nie – ich starte gerade erst',
      '🟡 Unter 1 Jahr – noch nicht profitabel',
      '🔴 Über 1 Jahr – ich trade aktiv'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'green',
    mcColor_1: 'orange',
    mcColor_2: 'red',
    mcStyle_0: 'glassmorphism',
    mcStyle_1: 'glassmorphism',
    mcStyle_2: 'glassmorphism',
    delaySeconds: 35
  }
};

// ============= ANFÄNGER-PFAD (🟢) - LINKE SPALTE =============
const ANFAENGER_START_Y = 50 + ROW_HEIGHT * 3;

const videoA1: Node = {
  id: 'video-a1-welcome',
  type: 'video',
  position: { x: ANFAENGER_X, y: ANFAENGER_START_Y },
  data: {
    label: 'A1: Anfänger Willkommen',
    videoUrl: '',
    overlayText: 'Hey, cool dass du ehrlich warst. Du stehst ganz am Anfang – und weißt du was? Das ist eigentlich ein VORTEIL.',
    answerType: 'button',
    buttonText: 'Weiter',
    buttonColor: 'green',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 40
  }
};

const videoA2: Node = {
  id: 'video-a2-motivation',
  type: 'video',
  position: { x: ANFAENGER_X, y: ANFAENGER_START_Y + ROW_HEIGHT },
  data: {
    label: 'A2: Motivation',
    videoUrl: '',
    overlayText: 'Warum Trading? Was hat dich dazu gebracht?',
    answerType: 'multipleChoice',
    answers: [
      '💰 Nebeneinkommen – 500-2000€ extra',
      '🚀 Vollzeit-Trader werden',
      '📈 Geld vermehren – besser als Sparbuch',
      '🧠 Einfach neugierig'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'purple',
    mcColor_2: 'green',
    mcColor_3: 'orange',
    delaySeconds: 30
  }
};

// A3 Varianten - horizontal nebeneinander unter A2
const A3_Y = ANFAENGER_START_Y + ROW_HEIGHT * 2;
const A3_SPACING = 160; // Horizontaler Abstand zwischen A3 Varianten

const videoA3a: Node = {
  id: 'video-a3a-nebeneinkommen',
  type: 'video',
  position: { x: ANFAENGER_X - A3_SPACING, y: A3_Y },
  data: {
    label: 'A3a: Nach Nebeneinkommen',
    videoUrl: '',
    overlayText: 'Nebeneinkommen – solider Plan. 500-2000€ extra im Monat ist realistisch. ABER – nicht in den ersten 3 Monaten.',
    answerType: 'multipleChoice',
    answers: [
      '✅ Ja, ich bin bereit zu lernen',
      '⏰ Ich hab nicht viel Zeit',
      '😰 Nicht sicher ob ich Geld verlieren will'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'green',
    mcColor_1: 'orange',
    mcColor_2: 'blue',
    delaySeconds: 40
  }
};

const videoA3b: Node = {
  id: 'video-a3b-vollzeit',
  type: 'video',
  position: { x: ANFAENGER_X, y: A3_Y },
  data: {
    label: 'A3b: Nach Vollzeit-Trader',
    videoUrl: '',
    overlayText: 'Vollzeit-Trader werden – das ist ein großes Ziel. Es ist möglich. Von 100 Leuten schaffen es vielleicht 5.',
    answerType: 'multipleChoice',
    answers: [
      '🎯 Ich will es richtig lernen',
      '⏳ Erstmal nebenbei probieren',
      '💡 Ich brauch mehr Infos'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'purple',
    mcColor_1: 'orange',
    mcColor_2: 'blue',
    delaySeconds: 45
  }
};

const videoA3c: Node = {
  id: 'video-a3c-geld-vermehren',
  type: 'video',
  position: { x: ANFAENGER_X + A3_SPACING, y: A3_Y },
  data: {
    label: 'A3c: Nach Geld vermehren',
    videoUrl: '',
    overlayText: 'Kapital vermehren – versteh ich. Aktives Trading ist was für Leute die Bock haben, sich reinzuarbeiten.',
    answerType: 'multipleChoice',
    answers: [
      '📊 Ich will aktiv traden',
      '🛋️ Passives Investieren klingt besser',
      '🤔 Was ist der Unterschied?'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'green',
    mcColor_1: 'blue',
    mcColor_2: 'orange',
    delaySeconds: 35
  }
};

const videoA3d: Node = {
  id: 'video-a3d-neugierig',
  type: 'video',
  position: { x: ANFAENGER_X + A3_SPACING * 2, y: A3_Y },
  data: {
    label: 'A3d: Nach Neugierig',
    videoUrl: '',
    overlayText: 'Einfach neugierig – das ist der beste Grund überhaupt. Keine unrealistischen Erwartungen.',
    answerType: 'button',
    buttonText: "👍 Klingt gut – zeig mir mehr",
    buttonColor: 'green',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 30
  }
};

// Weiter mit linearem Pfad
const videoA4: Node = {
  id: 'video-a4-zeit',
  type: 'video',
  position: { x: ANFAENGER_X, y: A3_Y + ROW_HEIGHT },
  data: {
    label: 'A4: Zeit & Ressourcen',
    videoUrl: '',
    overlayText: 'Wie viel Zeit könntest du pro Woche ins Trading investieren? Lernen, Charts, Üben.',
    answerType: 'multipleChoice',
    answers: [
      '⏰ Unter 5 Stunden – wenig Zeit',
      '📅 5-10 Stunden – abends & Wochenende',
      '💪 Über 10 Stunden – ich bin committed'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'orange',
    mcColor_1: 'blue',
    mcColor_2: 'green',
    delaySeconds: 35
  }
};

const videoA5: Node = {
  id: 'video-a5-startkapital',
  type: 'video',
  position: { x: ANFAENGER_X, y: A3_Y + ROW_HEIGHT * 2 },
  data: {
    label: 'A5: Startkapital',
    videoUrl: '',
    overlayText: 'Wie viel Geld könntest du zum Starten investieren? Geld das du VERLIEREN KÖNNTEST.',
    answerType: 'multipleChoice',
    answers: [
      '💵 Unter 500€ – klein anfangen',
      '💰 500-2000€ – was auf der Seite',
      '🏦 Über 2000€ – ordentlich starten',
      '❌ Eigentlich gar nichts'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'green',
    mcColor_2: 'purple',
    mcColor_3: 'red',
    delaySeconds: 40
  }
};

const videoA6: Node = {
  id: 'video-a6-angst',
  type: 'video',
  position: { x: ANFAENGER_X, y: A3_Y + ROW_HEIGHT * 3 },
  data: {
    label: 'A6: Größte Angst',
    videoUrl: '',
    overlayText: 'Was ist deine GRÖSSTE Angst beim Thema Trading?',
    answerType: 'multipleChoice',
    answers: [
      '😰 Geld verlieren',
      '🤯 Überfordert sein – zu komplex',
      '🕵️ Betrogen werden – vertrau keinem Coach',
      '⏱️ Zeit verschwenden'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'red',
    mcColor_1: 'orange',
    mcColor_2: 'blue',
    mcColor_3: 'purple',
    delaySeconds: 40
  }
};

// A7 Varianten - horizontal nebeneinander
const A7_Y = A3_Y + ROW_HEIGHT * 4;
const A7_SPACING = 200;

const videoA7a: Node = {
  id: 'video-a7a-verluste',
  type: 'video',
  position: { x: ANFAENGER_X - A7_SPACING / 2, y: A7_Y },
  data: {
    label: 'A7a: Angst vor Verlusten',
    videoUrl: '',
    overlayText: 'Du WIRST Geld verlieren. Der Unterschied: Profis verlieren KONTROLLIERT.',
    answerType: 'button',
    buttonText: 'Zeig mir wie',
    buttonColor: 'green',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 50
  }
};

const videoA7b: Node = {
  id: 'video-a7b-ueberfordert',
  type: 'video',
  position: { x: ANFAENGER_X + A7_SPACING / 2, y: A7_Y },
  data: {
    label: 'A7b: Überfordert',
    videoUrl: '',
    overlayText: 'Du brauchst das meiste davon nicht. Die erfolgreichsten Trader nutzen simple Strategien.',
    answerType: 'button',
    buttonText: 'Das klingt gut',
    buttonColor: 'blue',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 45
  }
};

const videoA7c: Node = {
  id: 'video-a7c-vertrauen',
  type: 'video',
  position: { x: ANFAENGER_X + A7_SPACING * 1.5, y: A7_Y },
  data: {
    label: 'A7c: Vertrau keinem Coach',
    videoUrl: '',
    overlayText: 'Ich muss mir dein Vertrauen verdienen. Das ist fair, oder?',
    answerType: 'button',
    buttonText: 'Fair – zeig mir was du hast',
    buttonColor: 'purple',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 50
  }
};

// Finale Anfänger-Nodes
const A8_Y = A7_Y + ROW_HEIGHT;

const videoA8: Node = {
  id: 'video-a8-empfehlung',
  type: 'video',
  position: { x: ANFAENGER_X, y: A8_Y },
  data: {
    label: 'A8: Produkt-Empfehlung Anfänger',
    videoUrl: '',
    overlayText: 'Meine Empfehlung für dich: Trading Starter Programm. Klar, Schritt für Schritt.',
    answerType: 'multipleChoice',
    answers: [
      '🎓 Zeig mir den Starter Kurs',
      '📧 Erstmal kostenlosen E-Mail-Kurs',
      '💬 Ich hab noch Fragen'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'large',
    mcLayout: 'vertical',
    mcColor_0: 'purple',
    mcColor_1: 'blue',
    mcColor_2: 'green',
    delaySeconds: 60
  }
};

const leadCaptureAnfaenger: Node = {
  id: 'lead-capture-anfaenger',
  type: 'leadCapture',
  position: { x: ANFAENGER_X, y: A8_Y + ROW_HEIGHT },
  data: {
    label: 'Lead Capture Anfänger',
    title: 'Deine Kontaktdaten',
    description: 'Damit wir dir die passenden Informationen schicken können',
    fields: ['firstName', 'lastName', 'email', 'phone'],
    optInText: 'Ich möchte weitere Informationen erhalten'
  }
};

const endAnfaenger: Node = {
  id: 'end-anfaenger',
  type: 'end',
  position: { x: ANFAENGER_X, y: A8_Y + ROW_HEIGHT * 2 },
  data: {
    label: 'Ende Anfänger',
    title: 'Vielen Dank! 🎉',
    message: 'Du hast heute den ersten Schritt gemacht. Check deine Mails – und viel Erfolg auf deinem Weg!',
    redirectUrl: ''
  }
};

// ============= FORTGESCHRITTENEN-PFAD (🟡) - MITTLERE SPALTE =============
const FORTGESCHRITTEN_START_Y = 50 + ROW_HEIGHT * 3;

const videoB1: Node = {
  id: 'video-b1-welcome',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: FORTGESCHRITTEN_START_Y },
  data: {
    label: 'B1: Fortgeschritten Willkommen',
    videoUrl: '',
    overlayText: 'Unter 1 Jahr Erfahrung, aber noch nicht profitabel. Das ist die härteste Phase.',
    answerType: 'button',
    buttonText: 'Weiter',
    buttonColor: 'orange',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 45
  }
};

const videoB2: Node = {
  id: 'video-b2-situation',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: FORTGESCHRITTEN_START_Y + ROW_HEIGHT },
  data: {
    label: 'B2: Aktuelle Situation',
    videoUrl: '',
    overlayText: 'Wie würdest du deine aktuelle Trading-Situation beschreiben?',
    answerType: 'multipleChoice',
    answers: [
      '📉 Ich verliere mehr als ich gewinne',
      '📊 Break-Even – mal Plus, mal Minus',
      '😤 Keine klare Strategie',
      '🎢 Emotional Rollercoaster'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'red',
    mcColor_1: 'orange',
    mcColor_2: 'blue',
    mcColor_3: 'purple',
    delaySeconds: 35
  }
};

// B3 Varianten - horizontal verteilt
const B3_Y = FORTGESCHRITTEN_START_Y + ROW_HEIGHT * 2;
const B3_SPACING = 170;

const videoB3a: Node = {
  id: 'video-b3a-verluste',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X - B3_SPACING, y: B3_Y },
  data: {
    label: 'B3a: Verliert mehr',
    videoUrl: '',
    overlayText: 'Es gibt nur 3 Gründe warum Trader konstant verlieren: Entries, Risk Management, kein Edge.',
    answerType: 'multipleChoice',
    answers: [
      '🎯 Entries sind das Problem',
      '💸 Risk Management ist das Problem',
      '❓ Weiß nicht – fühlt sich zufällig an'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'orange',
    mcColor_2: 'purple',
    delaySeconds: 50
  }
};

const videoB3b: Node = {
  id: 'video-b3b-breakeven',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y },
  data: {
    label: 'B3b: Break-Even',
    videoUrl: '',
    overlayText: 'Der Unterschied zwischen Break-Even und Profit ist oft nur eine kleine Anpassung.',
    answerType: 'multipleChoice',
    answers: [
      '⏱️ Besseres Timing fehlt',
      '🔄 Ich trade zu viel',
      '😤 Halte Gewinner nicht lang genug',
      '🤷 Weiß es nicht'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'orange',
    mcColor_2: 'purple',
    mcColor_3: 'green',
    delaySeconds: 45
  }
};

const videoB3c: Node = {
  id: 'video-b3c-strategie',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X + B3_SPACING, y: B3_Y },
  data: {
    label: 'B3c: Keine Strategie',
    videoUrl: '',
    overlayText: 'Du brauchst EINE Strategie. Die du in- und auswendig kennst.',
    answerType: 'multipleChoice',
    answers: [
      '📈 Trend-Following',
      '🔄 Reversal/Mean Reversion',
      '⚡ Scalping',
      '📊 Swing Trading'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'grid',
    mcColor_0: 'green',
    mcColor_1: 'blue',
    mcColor_2: 'purple',
    mcColor_3: 'orange',
    delaySeconds: 50
  }
};

const videoB3d: Node = {
  id: 'video-b3d-emotional',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X + B3_SPACING * 2, y: B3_Y },
  data: {
    label: 'B3d: Emotional',
    videoUrl: '',
    overlayText: 'Das ist kein Wissensproblem. Das ist ein Psychologie-Problem. Und es ist lösbar.',
    answerType: 'multipleChoice',
    answers: [
      '😡 Nach Verlust zurückholen wollen',
      '😰 Angst Gewinne zu verlieren',
      '🎰 Gierig wenn\'s gut läuft',
      '😩 Zu ungeduldig'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'red',
    mcColor_1: 'orange',
    mcColor_2: 'purple',
    mcColor_3: 'blue',
    delaySeconds: 55
  }
};

// Linearer Fortgeschrittenen-Pfad
const videoB4: Node = {
  id: 'video-b4-lernquellen',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT },
  data: {
    label: 'B4: Bisherige Lernquellen',
    videoUrl: '',
    overlayText: 'Wo hast du bisher Trading gelernt?',
    answerType: 'multipleChoice',
    answers: [
      '📺 YouTube & kostenlose Inhalte',
      '📚 Bücher und Kurse',
      '👥 Mentor oder Gruppe',
      '🎲 Trial and Error am Chart'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'grid',
    mcColor_0: 'blue',
    mcColor_1: 'green',
    mcColor_2: 'purple',
    mcColor_3: 'orange',
    delaySeconds: 35
  }
};

const videoB5: Node = {
  id: 'video-b5-zeit',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT * 2 },
  data: {
    label: 'B5: Zeit & Commitment',
    videoUrl: '',
    overlayText: 'Wie viel Zeit verbringst du pro Woche mit Trading?',
    answerType: 'multipleChoice',
    answers: [
      '⏰ Unter 5 Stunden',
      '📅 5-15 Stunden',
      '💻 15-30 Stunden',
      '🔥 Über 30 Stunden'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'grid',
    mcColor_0: 'blue',
    mcColor_1: 'green',
    mcColor_2: 'purple',
    mcColor_3: 'orange',
    delaySeconds: 40
  }
};

const videoB6: Node = {
  id: 'video-b6-konto',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT * 3 },
  data: {
    label: 'B6: Kontogröße',
    videoUrl: '',
    overlayText: 'Wie groß ist dein Trading-Konto aktuell?',
    answerType: 'multipleChoice',
    answers: [
      '💵 Unter 1.000€',
      '💰 1.000-5.000€',
      '🏦 5.000-20.000€',
      '💎 Über 20.000€',
      '📋 Prop-Firm Account'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'small',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'green',
    mcColor_2: 'purple',
    mcColor_3: 'orange',
    mcColor_4: 'red',
    delaySeconds: 35
  }
};

const videoB7: Node = {
  id: 'video-b7-ziel',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT * 4 },
  data: {
    label: 'B7: Ziel in 12 Monaten',
    videoUrl: '',
    overlayText: 'Was ist dein Ziel für die nächsten 12 Monate?',
    answerType: 'multipleChoice',
    answers: [
      '✅ Endlich profitabel werden',
      '📈 Performance signifikant verbessern',
      '💼 Prop-Firm Challenge bestehen',
      '🔄 Vollzeit-Trader werden'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'green',
    mcColor_1: 'blue',
    mcColor_2: 'purple',
    mcColor_3: 'orange',
    delaySeconds: 40
  }
};

const videoB8: Node = {
  id: 'video-b8-huerde',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT * 5 },
  data: {
    label: 'B8: Größte Hürde',
    videoUrl: '',
    overlayText: 'Was ist das EINE Ding das dich vom nächsten Level abhält?',
    answerType: 'multipleChoice',
    answers: [
      '🎯 Keine klare Strategie',
      '🧠 Psychologie und Disziplin',
      '📊 Weiß nicht wie ich mich verbessern soll',
      '👤 Mir fehlt Anleitung',
      '💬 Mir fehlt eine Community'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'small',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'purple',
    mcColor_2: 'orange',
    mcColor_3: 'green',
    mcColor_4: 'red',
    delaySeconds: 45
  }
};

const videoB9: Node = {
  id: 'video-b9-empfehlung',
  type: 'video',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT * 6 },
  data: {
    label: 'B9: Produkt-Empfehlung',
    videoUrl: '',
    overlayText: 'Meine Empfehlung: Gruppen-Coaching Programm. 8 Wochen, live mit mir.',
    answerType: 'multipleChoice',
    answers: [
      '🎓 Zeig mir das Gruppen-Coaching',
      '🆓 Zum kostenlosen Workshop',
      '📞 Erstmal sprechen'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'large',
    mcLayout: 'vertical',
    mcColor_0: 'purple',
    mcColor_1: 'blue',
    mcColor_2: 'green',
    delaySeconds: 70
  }
};

const leadCaptureFortgeschritten: Node = {
  id: 'lead-capture-fortgeschritten',
  type: 'leadCapture',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT * 7 },
  data: {
    label: 'Lead Capture Fortgeschritten',
    title: 'Deine Kontaktdaten',
    description: 'Für Workshop-Anmeldung und weitere Infos',
    fields: ['firstName', 'lastName', 'email', 'phone'],
    optInText: 'Ich möchte Workshop-Infos erhalten'
  }
};

const endFortgeschritten: Node = {
  id: 'end-fortgeschritten',
  type: 'end',
  position: { x: FORTGESCHRITTEN_X, y: B3_Y + ROW_HEIGHT * 8 },
  data: {
    label: 'Ende Fortgeschritten',
    title: 'Der Durchbruch kommt! 💪',
    message: 'Check deine Mails. Und bis dahin – keep grinding.',
    redirectUrl: ''
  }
};

// ============= PROFI-PFAD (🔴) - RECHTE SPALTE =============
const PROFI_START_Y = 50 + ROW_HEIGHT * 3;

const videoC1: Node = {
  id: 'video-c1-welcome',
  type: 'video',
  position: { x: PROFI_X, y: PROFI_START_Y },
  data: {
    label: 'C1: Profi Willkommen',
    videoUrl: '',
    overlayText: 'Über 1 Jahr Erfahrung – Respekt. Du bist nicht hier um die Basics zu lernen.',
    answerType: 'button',
    buttonText: 'Weiter',
    buttonColor: 'red',
    buttonStyle: 'glassmorphism',
    buttonSize: 'large',
    buttonPosition: 'bottom-center',
    delaySeconds: 40
  }
};

const videoC2: Node = {
  id: 'video-c2-profitabel',
  type: 'video',
  position: { x: PROFI_X, y: PROFI_START_Y + ROW_HEIGHT },
  data: {
    label: 'C2: Profitabilität',
    videoUrl: '',
    overlayText: 'Direkte Frage: Bist du profitabel?',
    answerType: 'multipleChoice',
    answers: [
      '✅ Ja, ich bin profitabel',
      '⚖️ Break-Even bis leicht profitabel',
      '📉 Noch nicht profitabel'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'large',
    mcLayout: 'vertical',
    mcColor_0: 'green',
    mcColor_1: 'orange',
    mcColor_2: 'red',
    delaySeconds: 35
  }
};

// C3 Varianten
const C3_Y = PROFI_START_Y + ROW_HEIGHT * 2;
const C3_SPACING = 200;

const videoC3a: Node = {
  id: 'video-c3a-profitabel',
  type: 'video',
  position: { x: PROFI_X - C3_SPACING, y: C3_Y },
  data: {
    label: 'C3a: Ja profitabel',
    videoUrl: '',
    overlayText: 'Das ist schon mehr als 95% der Trader. Was ist der Engpass?',
    answerType: 'multipleChoice',
    answers: [
      '📈 Ich will skalieren',
      '🏢 Prop-Firm Challenge',
      '🧠 Mindset – unter Potential',
      '💼 Vollzeit-Trader werden',
      '🤝 Mit Profis connecten'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'small',
    mcLayout: 'vertical',
    mcColor_0: 'green',
    mcColor_1: 'purple',
    mcColor_2: 'blue',
    mcColor_3: 'orange',
    mcColor_4: 'red',
    delaySeconds: 45
  }
};

const videoC3b: Node = {
  id: 'video-c3b-breakeven',
  type: 'video',
  position: { x: PROFI_X, y: C3_Y },
  data: {
    label: 'C3b: Break-Even',
    videoUrl: '',
    overlayText: 'Du brauchst wahrscheinlich jemanden der von außen draufschaut.',
    answerType: 'multipleChoice',
    answers: [
      '🎯 Strategie nicht gut genug',
      '🧠 Ausführung – halt mich nicht dran',
      '📊 Weiß nicht was ich falsch mache'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'purple',
    mcColor_2: 'orange',
    delaySeconds: 40
  }
};

const videoC3c: Node = {
  id: 'video-c3c-nicht-profitabel',
  type: 'video',
  position: { x: PROFI_X + C3_SPACING, y: C3_Y },
  data: {
    label: 'C3c: Nicht profitabel',
    videoUrl: '',
    overlayText: 'Nach einem Jahr solltest du mindestens Break-Even sein. Irgendwas läuft grundsätzlich falsch.',
    answerType: 'multipleChoice',
    answers: [
      '📚 Viele Kurse gemacht',
      '🔄 Verschiedene Strategien probiert',
      '👤 Hatte noch nie Mentor',
      '🤷 Weiß nicht mehr was ich tun soll'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'orange',
    mcColor_2: 'purple',
    mcColor_3: 'red',
    delaySeconds: 45
  }
};

// Linearer Profi-Pfad
const videoC4: Node = {
  id: 'video-c4-style',
  type: 'video',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT },
  data: {
    label: 'C4: Trading-Style',
    videoUrl: '',
    overlayText: 'Wie tradest du hauptsächlich?',
    answerType: 'multipleChoice',
    answers: [
      '⚡ Daytrading',
      '📊 Swing Trading',
      '💹 Position Trading',
      '🔀 Mix aus allem'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'grid',
    mcColor_0: 'purple',
    mcColor_1: 'blue',
    mcColor_2: 'green',
    mcColor_3: 'orange',
    delaySeconds: 35
  }
};

const videoC5: Node = {
  id: 'video-c5-markt',
  type: 'video',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT * 2 },
  data: {
    label: 'C5: Hauptmarkt',
    videoUrl: '',
    overlayText: 'Welchen Markt tradest du hauptsächlich?',
    answerType: 'multipleChoice',
    answers: [
      '💱 Forex',
      '📈 Aktien/Indizes',
      '🪙 Crypto',
      '🛢️ Commodities',
      '🔀 Mehrere Märkte'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'small',
    mcLayout: 'vertical',
    mcColor_0: 'green',
    mcColor_1: 'blue',
    mcColor_2: 'orange',
    mcColor_3: 'purple',
    mcColor_4: 'red',
    delaySeconds: 30
  }
};

const videoC6: Node = {
  id: 'video-c6-kapital',
  type: 'video',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT * 3 },
  data: {
    label: 'C6: Kapitalsituation',
    videoUrl: '',
    overlayText: 'Wie sieht deine Kapitalsituation aus?',
    answerType: 'multipleChoice',
    answers: [
      '💵 Eigenes Kapital (unter 10k)',
      '💰 Eigenes Kapital (10-50k)',
      '🏦 Eigenes Kapital (über 50k)',
      '📋 Prop-Firm Account',
      '🎯 Will Prop-Firm Challenge machen'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'small',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'green',
    mcColor_2: 'purple',
    mcColor_3: 'orange',
    mcColor_4: 'red',
    delaySeconds: 40
  }
};

const videoC7: Node = {
  id: 'video-c7-zeithorizont',
  type: 'video',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT * 4 },
  data: {
    label: 'C7: Zeithorizont',
    videoUrl: '',
    overlayText: 'Was ist dein Zeithorizont fürs Trading?',
    answerType: 'multipleChoice',
    answers: [
      '🏠 Hobby/Nebeneinkommen',
      '💼 In 1-2 Jahren Vollzeit',
      '🔥 Schon Vollzeit-Trader',
      '🤝 Trading-Industrie (Coaching etc.)'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'medium',
    mcLayout: 'vertical',
    mcColor_0: 'blue',
    mcColor_1: 'green',
    mcColor_2: 'purple',
    mcColor_3: 'orange',
    delaySeconds: 35
  }
};

const videoC8: Node = {
  id: 'video-c8-herausforderung',
  type: 'video',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT * 5 },
  data: {
    label: 'C8: Größte Herausforderung',
    videoUrl: '',
    overlayText: 'Was ist aktuell deine größte Herausforderung?',
    answerType: 'multipleChoice',
    answers: [
      '📈 Skalierung',
      '🧠 Psychologie',
      '⏱️ Zeitmanagement',
      '📊 Edge-Erhaltung',
      '🤝 Isolation',
      '📋 Prop-Firm Challenge'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'small',
    mcLayout: 'grid',
    mcColor_0: 'green',
    mcColor_1: 'purple',
    mcColor_2: 'blue',
    mcColor_3: 'orange',
    mcColor_4: 'red',
    mcColor_5: 'blue',
    delaySeconds: 45
  }
};

const videoC9: Node = {
  id: 'video-c9-empfehlung',
  type: 'video',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT * 6 },
  data: {
    label: 'C9: Produkt-Empfehlung Profi',
    videoUrl: '',
    overlayText: 'Meine Empfehlung: Prop-Firm Accelerator. 6 Wochen intensives 1:1 Mentoring.',
    answerType: 'multipleChoice',
    answers: [
      '🚀 Zeig mir den Prop-Firm Accelerator',
      '📄 Das kostenlose PDF will ich',
      '📞 Ich will erstmal mit dir sprechen'
    ],
    mcPosition: 'bottom-center',
    mcButtonSize: 'large',
    mcLayout: 'vertical',
    mcColor_0: 'red',
    mcColor_1: 'blue',
    mcColor_2: 'green',
    delaySeconds: 70
  }
};

const leadCaptureProfi: Node = {
  id: 'lead-capture-profi',
  type: 'leadCapture',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT * 7 },
  data: {
    label: 'Lead Capture Profi',
    title: 'Strategie-Gespräch buchen',
    description: 'Für dein persönliches Gespräch mit Saif',
    fields: ['firstName', 'lastName', 'email', 'phone'],
    optInText: 'Ich möchte einen Termin vereinbaren'
  }
};

const endProfi: Node = {
  id: 'end-profi',
  type: 'end',
  position: { x: PROFI_X, y: C3_Y + ROW_HEIGHT * 8 },
  data: {
    label: 'Ende Profi',
    title: 'Respekt! 🏆',
    message: 'Respekt dass du so weit gekommen bist. Lass uns schauen wie weit wir dich noch bringen können.',
    redirectUrl: ''
  }
};

// ============= ALL NODES ARRAY =============

export const smartTradingNodes: Node[] = [
  // Gemeinsamer Start
  startNode,
  video1Welcome,
  video2Level,
  
  // Anfänger-Pfad
  videoA1,
  videoA2,
  videoA3a,
  videoA3b,
  videoA3c,
  videoA3d,
  videoA4,
  videoA5,
  videoA6,
  videoA7a,
  videoA7b,
  videoA7c,
  videoA8,
  leadCaptureAnfaenger,
  endAnfaenger,
  
  // Fortgeschrittenen-Pfad
  videoB1,
  videoB2,
  videoB3a,
  videoB3b,
  videoB3c,
  videoB3d,
  videoB4,
  videoB5,
  videoB6,
  videoB7,
  videoB8,
  videoB9,
  leadCaptureFortgeschritten,
  endFortgeschritten,
  
  // Profi-Pfad
  videoC1,
  videoC2,
  videoC3a,
  videoC3b,
  videoC3c,
  videoC4,
  videoC5,
  videoC6,
  videoC7,
  videoC8,
  videoC9,
  leadCaptureProfi,
  endProfi
];

// ============= EDGE DEFINITIONS =============

export const smartTradingEdges: Edge[] = [
  // Start → Welcome
  { id: 'e-start-welcome', source: 'start', target: 'video-1-welcome', type: 'custom' },
  { id: 'e-welcome-level', source: 'video-1-welcome', target: 'video-2-level', type: 'custom' },
  
  // Level-Weiche → 3 Pfade
  { id: 'e-level-anfaenger', source: 'video-2-level', target: 'video-a1-welcome', type: 'custom', label: 'Anfänger' },
  { id: 'e-level-fortgeschritten', source: 'video-2-level', target: 'video-b1-welcome', type: 'custom', label: 'Fortgeschritten' },
  { id: 'e-level-profi', source: 'video-2-level', target: 'video-c1-welcome', type: 'custom', label: 'Profi' },
  
  // ===== ANFÄNGER-PFAD =====
  { id: 'e-a1-a2', source: 'video-a1-welcome', target: 'video-a2-motivation', type: 'custom' },
  
  // A2 → A3 Varianten
  { id: 'e-a2-a3a', source: 'video-a2-motivation', target: 'video-a3a-nebeneinkommen', type: 'custom', label: 'Nebeneinkommen' },
  { id: 'e-a2-a3b', source: 'video-a2-motivation', target: 'video-a3b-vollzeit', type: 'custom', label: 'Vollzeit' },
  { id: 'e-a2-a3c', source: 'video-a2-motivation', target: 'video-a3c-geld-vermehren', type: 'custom', label: 'Vermehren' },
  { id: 'e-a2-a3d', source: 'video-a2-motivation', target: 'video-a3d-neugierig', type: 'custom', label: 'Neugierig' },
  
  // A3 Varianten → A4
  { id: 'e-a3a-a4', source: 'video-a3a-nebeneinkommen', target: 'video-a4-zeit', type: 'custom' },
  { id: 'e-a3b-a4', source: 'video-a3b-vollzeit', target: 'video-a4-zeit', type: 'custom' },
  { id: 'e-a3c-a4', source: 'video-a3c-geld-vermehren', target: 'video-a4-zeit', type: 'custom' },
  { id: 'e-a3d-a4', source: 'video-a3d-neugierig', target: 'video-a4-zeit', type: 'custom' },
  
  // A4 → A5 → A6
  { id: 'e-a4-a5', source: 'video-a4-zeit', target: 'video-a5-startkapital', type: 'custom' },
  { id: 'e-a5-a6', source: 'video-a5-startkapital', target: 'video-a6-angst', type: 'custom' },
  
  // A6 → A7 Varianten
  { id: 'e-a6-a7a', source: 'video-a6-angst', target: 'video-a7a-verluste', type: 'custom', label: 'Verluste' },
  { id: 'e-a6-a7b', source: 'video-a6-angst', target: 'video-a7b-ueberfordert', type: 'custom', label: 'Überfordert' },
  { id: 'e-a6-a7c', source: 'video-a6-angst', target: 'video-a7c-vertrauen', type: 'custom', label: 'Vertrauen' },
  
  // A7 Varianten → A8
  { id: 'e-a7a-a8', source: 'video-a7a-verluste', target: 'video-a8-empfehlung', type: 'custom' },
  { id: 'e-a7b-a8', source: 'video-a7b-ueberfordert', target: 'video-a8-empfehlung', type: 'custom' },
  { id: 'e-a7c-a8', source: 'video-a7c-vertrauen', target: 'video-a8-empfehlung', type: 'custom' },
  
  // A8 → Lead Capture → Ende
  { id: 'e-a8-lead', source: 'video-a8-empfehlung', target: 'lead-capture-anfaenger', type: 'custom' },
  { id: 'e-lead-end-a', source: 'lead-capture-anfaenger', target: 'end-anfaenger', type: 'custom' },
  
  // ===== FORTGESCHRITTENEN-PFAD =====
  { id: 'e-b1-b2', source: 'video-b1-welcome', target: 'video-b2-situation', type: 'custom' },
  
  // B2 → B3 Varianten
  { id: 'e-b2-b3a', source: 'video-b2-situation', target: 'video-b3a-verluste', type: 'custom', label: 'Verliert' },
  { id: 'e-b2-b3b', source: 'video-b2-situation', target: 'video-b3b-breakeven', type: 'custom', label: 'Break-Even' },
  { id: 'e-b2-b3c', source: 'video-b2-situation', target: 'video-b3c-strategie', type: 'custom', label: 'Keine Strategie' },
  { id: 'e-b2-b3d', source: 'video-b2-situation', target: 'video-b3d-emotional', type: 'custom', label: 'Emotional' },
  
  // B3 Varianten → B4
  { id: 'e-b3a-b4', source: 'video-b3a-verluste', target: 'video-b4-lernquellen', type: 'custom' },
  { id: 'e-b3b-b4', source: 'video-b3b-breakeven', target: 'video-b4-lernquellen', type: 'custom' },
  { id: 'e-b3c-b4', source: 'video-b3c-strategie', target: 'video-b4-lernquellen', type: 'custom' },
  { id: 'e-b3d-b4', source: 'video-b3d-emotional', target: 'video-b4-lernquellen', type: 'custom' },
  
  // B4 → B5 → B6 → B7 → B8 → B9
  { id: 'e-b4-b5', source: 'video-b4-lernquellen', target: 'video-b5-zeit', type: 'custom' },
  { id: 'e-b5-b6', source: 'video-b5-zeit', target: 'video-b6-konto', type: 'custom' },
  { id: 'e-b6-b7', source: 'video-b6-konto', target: 'video-b7-ziel', type: 'custom' },
  { id: 'e-b7-b8', source: 'video-b7-ziel', target: 'video-b8-huerde', type: 'custom' },
  { id: 'e-b8-b9', source: 'video-b8-huerde', target: 'video-b9-empfehlung', type: 'custom' },
  
  // B9 → Lead Capture → Ende
  { id: 'e-b9-lead', source: 'video-b9-empfehlung', target: 'lead-capture-fortgeschritten', type: 'custom' },
  { id: 'e-lead-end-b', source: 'lead-capture-fortgeschritten', target: 'end-fortgeschritten', type: 'custom' },
  
  // ===== PROFI-PFAD =====
  { id: 'e-c1-c2', source: 'video-c1-welcome', target: 'video-c2-profitabel', type: 'custom' },
  
  // C2 → C3 Varianten
  { id: 'e-c2-c3a', source: 'video-c2-profitabel', target: 'video-c3a-profitabel', type: 'custom', label: 'Profitabel' },
  { id: 'e-c2-c3b', source: 'video-c2-profitabel', target: 'video-c3b-breakeven', type: 'custom', label: 'Break-Even' },
  { id: 'e-c2-c3c', source: 'video-c2-profitabel', target: 'video-c3c-nicht-profitabel', type: 'custom', label: 'Nicht profitabel' },
  
  // C3 Varianten → C4
  { id: 'e-c3a-c4', source: 'video-c3a-profitabel', target: 'video-c4-style', type: 'custom' },
  { id: 'e-c3b-c4', source: 'video-c3b-breakeven', target: 'video-c4-style', type: 'custom' },
  { id: 'e-c3c-c4', source: 'video-c3c-nicht-profitabel', target: 'video-c4-style', type: 'custom' },
  
  // C4 → C5 → C6 → C7 → C8 → C9
  { id: 'e-c4-c5', source: 'video-c4-style', target: 'video-c5-markt', type: 'custom' },
  { id: 'e-c5-c6', source: 'video-c5-markt', target: 'video-c6-kapital', type: 'custom' },
  { id: 'e-c6-c7', source: 'video-c6-kapital', target: 'video-c7-zeithorizont', type: 'custom' },
  { id: 'e-c7-c8', source: 'video-c7-zeithorizont', target: 'video-c8-herausforderung', type: 'custom' },
  { id: 'e-c8-c9', source: 'video-c8-herausforderung', target: 'video-c9-empfehlung', type: 'custom' },
  
  // C9 → Lead Capture → Ende
  { id: 'e-c9-lead', source: 'video-c9-empfehlung', target: 'lead-capture-profi', type: 'custom' },
  { id: 'e-lead-end-c', source: 'lead-capture-profi', target: 'end-profi', type: 'custom' }
];

// ============= FUNNEL NAME =============
export const SMART_TRADING_FUNNEL_NAME = 'smart-trading-v2';
