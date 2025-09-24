-- Niklas KOMPLETTER FITNESS Video-Funnel für Supabase
-- ALLE Wege logisch durchdacht und verbunden

INSERT INTO funnels (name, structure, user_id) VALUES (
  'Niklas-Kompletter-Fitness-Funnel',
  '{
    "nodes": [
      {
        "id": "start-node",
        "type": "start",
        "position": { "x": 100, "y": 500 },
        "data": { 
          "label": "Start"
        }
      },
      {
        "id": "willkommen-video",
        "type": "video",
        "position": { "x": 500, "y": 500 },
        "data": {
          "label": "Willkommen (15-20s)",
          "videoUrl": "",
          "overlayText": "Hey! Bereit für deine Fitness-Transformation? In nur 20 Sekunden erfährst du, wie du endlich deine Ziele erreichst - ohne stundenlanges Training!",
          "textPosition": "top-center",
          "textSize": "large",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Jetzt starten →",
          "buttonColor": "green",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "ziel-auswahl"
          }
        }
      },
      {
        "id": "ziel-auswahl",
        "type": "video",
        "position": { "x": 900, "y": 500 },
        "data": {
          "label": "Ziel auswählen",
          "videoUrl": "",
          "overlayText": "Was ist dein Hauptziel? Wähle aus, was am besten zu dir passt:",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "💪 Abnehmen & Gewicht verlieren",
            "🏋️ Muskeln aufbauen & stärker werden",
            "🏃 Fit & gesund bleiben"
          ],
          "mcColor_0": "red",
          "mcColor_1": "blue",
          "mcColor_2": "green",
          "mcStyle_0": "glassmorphism",
          "mcStyle_1": "glassmorphism", 
          "mcStyle_2": "glassmorphism",
          "mcButtonSize": "large",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "abnehmen-pain-points",
            "1": "muskelaufbau-pain-points", 
            "2": "fitness-pain-points"
          }
        }
      },
      {
        "id": "abnehmen-pain-points",
        "type": "video",
        "position": { "x": 1300, "y": 200 },
        "data": {
          "label": "Abnehmen Pain Points",
          "videoUrl": "",
          "overlayText": "Was ist dein größtes Problem beim Abnehmen?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "Ich esse zu viel & kann nicht aufhören",
            "Diäten funktionieren bei mir einfach nicht"
          ],
          "mcColor_0": "red",
          "mcColor_1": "orange",
          "mcButtonSize": "large",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "abnehmen-zu-viel-essen-loesung",
            "1": "abnehmen-diaeten-loesung"
          }
        }
      },
      {
        "id": "muskelaufbau-pain-points",
        "type": "video",
        "position": { "x": 1300, "y": 500 },
        "data": {
          "label": "Muskelaufbau Pain Points",
          "videoUrl": "",
          "overlayText": "Was blockiert deinen Muskelaufbau am meisten?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "Ich sehe keine Fortschritte trotz Training",
            "Ich weiß nicht, wie ich richtig trainieren soll"
          ],
          "mcColor_0": "blue",
          "mcColor_1": "purple",
          "mcButtonSize": "large",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "muskelaufbau-keine-fortschritte-loesung",
            "1": "muskelaufbau-training-loesung"
          }
        }
      },
      {
        "id": "fitness-pain-points",
        "type": "video",
        "position": { "x": 1300, "y": 800 },
        "data": {
          "label": "Fitness Pain Points",
          "videoUrl": "",
          "overlayText": "Was hält dich von regelmäßigem Sport ab?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "Ich habe keine Zeit für Sport",
            "Mir fehlt die Motivation zum Training"
          ],
          "mcColor_0": "green",
          "mcColor_1": "yellow",
          "mcButtonSize": "large",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "fitness-keine-zeit-loesung",
            "1": "fitness-motivation-loesung"
          }
        }
      },
      {
        "id": "abnehmen-zu-viel-essen-loesung",
        "type": "video",
        "position": { "x": 1700, "y": 100 },
        "data": {
          "label": "Lösung: Zu viel essen",
          "videoUrl": "",
          "overlayText": "🎯 Deine Lösung gegen ständiges Überessen: Mit meiner Sättigungsformel lernst du, natürlich weniger zu essen - ohne Hunger, ohne Verzicht. Du reprogrammierst dein Hungergefühl und isst automatisch die richtige Menge.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Das will ich lernen →",
          "buttonColor": "red",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "commitment-check"
          }
        }
      },
      {
        "id": "abnehmen-diaeten-loesung",
        "type": "video",
        "position": { "x": 1700, "y": 300 },
        "data": {
          "label": "Lösung: Diäten funktionieren nicht",
          "videoUrl": "",
          "overlayText": "🎯 Deine Lösung für erfolglose Diäten: Vergiss Diäten! Mit meinem Anti-Diät-System nimmst du ab, ohne zu verzichten. Du lernst eine Ernährung, die du dein Leben lang durchhalten kannst - ohne Jo-Jo-Effekt.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Das will ich lernen →",
          "buttonColor": "orange",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "commitment-check"
          }
        }
      },
      {
        "id": "muskelaufbau-keine-fortschritte-loesung",
        "type": "video",
        "position": { "x": 1700, "y": 400 },
        "data": {
          "label": "Lösung: Keine Fortschritte",
          "videoUrl": "",
          "overlayText": "🎯 Deine Lösung für fehlende Fortschritte: Mit meinem Progression-Tracking siehst du jede Woche Ergebnisse. Systematische Steigerung + richtige Regeneration + Ernährung = garantierte Fortschritte, die du sehen und spüren wirst.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Das will ich lernen →",
          "buttonColor": "blue",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "commitment-check"
          }
        }
      },
      {
        "id": "muskelaufbau-training-loesung",
        "type": "video",
        "position": { "x": 1700, "y": 600 },
        "data": {
          "label": "Lösung: Richtiges Training",
          "videoUrl": "",
          "overlayText": "🎯 Deine Lösung für richtiges Training: Mit meinem Trainingsplan-System lernst du die Grundlagen für effektiven Muskelaufbau. Klare Übungen, richtige Technik, perfekte Progression - alles Step-by-Step erklärt.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Das will ich lernen →",
          "buttonColor": "purple",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "commitment-check"
          }
        }
      },
      {
        "id": "fitness-keine-zeit-loesung",
        "type": "video",
        "position": { "x": 1700, "y": 700 },
        "data": {
          "label": "Lösung: Keine Zeit",
          "videoUrl": "",
          "overlayText": "🎯 Deine Lösung für Zeitmangel: Mit meinen Express-Workouts bleibst du fit in nur 15 Minuten, 3x pro Woche. Maximale Effizienz, minimaler Zeitaufwand - perfekt für deinen vollen Alltag.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Das will ich lernen →",
          "buttonColor": "green",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "commitment-check"
          }
        }
      },
      {
        "id": "fitness-motivation-loesung",
        "type": "video",
        "position": { "x": 1700, "y": 900 },
        "data": {
          "label": "Lösung: Motivation",
          "videoUrl": "",
          "overlayText": "🎯 Deine Lösung für Motivationsprobleme: Mit meinem Motivations-System machst du Sport zur Gewohnheit - ohne Willenskraft. Du lernst Tricks, die dich automatisch zum Training bringen.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Das will ich lernen →",
          "buttonColor": "yellow",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "commitment-check"
          }
        }
      },
      {
        "id": "commitment-check",
        "type": "video",
        "position": { "x": 2100, "y": 500 },
        "data": {
          "label": "Commitment Check",
          "videoUrl": "",
          "overlayText": "Wie ernst ist es dir mit deiner Fitness-Transformation?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "🤔 Ich schaue erstmal - informiere mich gerne",
            "💪 Ich bin motiviert - will endlich Ergebnisse", 
            "🔥 Jetzt oder nie! - ich bin bereit für alles"
          ],
          "mcColor_0": "gray",
          "mcColor_1": "blue",
          "mcColor_2": "red",
          "mcStyle_0": "glassmorphism",
          "mcStyle_1": "glassmorphism",
          "mcStyle_2": "glassmorphism",
          "mcButtonSize": "large",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "bereitschaft-niedrig",
            "1": "bereitschaft-mittel",
            "2": "bereitschaft-hoch"
          }
        }
      },
      {
        "id": "bereitschaft-niedrig",
        "type": "video",
        "position": { "x": 2500, "y": 300 },
        "data": {
          "label": "Bereitschaft Niedrig",
          "videoUrl": "",
          "overlayText": "Kein Problem! Jeder fängt mal klein an. Ich habe etwas Kostenloses für dich, damit du in deinem Tempo starten kannst.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Kostenloses Workout holen →",
          "buttonColor": "gray",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "kostenloses-worksheet"
          }
        }
      },
      {
        "id": "bereitschaft-mittel",
        "type": "video",
        "position": { "x": 2500, "y": 500 },
        "data": {
          "label": "Bereitschaft Mittel",
          "videoUrl": "",
          "overlayText": "Super Einstellung! Du bist bereit für Veränderung. Lass uns in einem kurzen Gespräch schauen, wie ich dir am besten helfen kann.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Kostenloses Gespräch buchen →",
          "buttonColor": "blue",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "termin-buchen"
          }
        }
      },
      {
        "id": "bereitschaft-hoch",
        "type": "video",
        "position": { "x": 2500, "y": 700 },
        "data": {
          "label": "Bereitschaft Hoch",
          "videoUrl": "",
          "overlayText": "WOW! Diese Einstellung liebe ich! Du bist bereit für eine echte Transformation. Lass uns sofort loslegen und deinen Erfolgsplan erstellen.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Sofort Strategiegespräch buchen →",
          "buttonColor": "red",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "termin-buchen"
          }
        }
      },
      {
        "id": "kostenloses-worksheet",
        "type": "end",
        "position": { "x": 2900, "y": 300 },
        "data": {
          "label": "Kostenloses Worksheet",
          "title": "🎁 Dein kostenloses Fitness-Starter-Kit",
          "message": "Perfekt! Hole dir jetzt mein kostenloses Fitness-Starter-Kit: ✓ 7-Tage Workout-Plan ✓ Ernährungs-Guide ✓ Motivations-Tipps. Alles was du brauchst, um zu starten!",
          "redirectUrl": "https://niklas-fitness.com/kostenloses-starter-kit"
        }
      },
      {
        "id": "termin-buchen",
        "type": "end",
        "position": { "x": 2900, "y": 600 },
        "data": {
          "label": "Termin buchen",
          "title": "🚀 Kostenloses Fitness-Strategiegespräch",
          "message": "Exzellent! Buche jetzt dein kostenloses 30-Min Fitness-Strategiegespräch. Wir analysieren deine Situation und erstellen deinen persönlichen Erfolgsplan!",
          "redirectUrl": "https://calendly.com/niklas-fitness/strategiegesprach"
        }
      }
    ],
    "edges": [
      {
        "id": "start-to-willkommen",
        "source": "start-node",
        "target": "willkommen-video",
        "type": "custom"
      },
      {
        "id": "willkommen-to-ziel",
        "source": "willkommen-video", 
        "target": "ziel-auswahl",
        "type": "custom"
      },
      {
        "id": "ziel-to-abnehmen",
        "source": "ziel-auswahl",
        "target": "abnehmen-pain-points",
        "type": "custom"
      },
      {
        "id": "ziel-to-muskelaufbau",
        "source": "ziel-auswahl",
        "target": "muskelaufbau-pain-points",
        "type": "custom"
      },
      {
        "id": "ziel-to-fitness",
        "source": "ziel-auswahl",
        "target": "fitness-pain-points",
        "type": "custom"
      },
      {
        "id": "abnehmen-to-essen-loesung",
        "source": "abnehmen-pain-points",
        "target": "abnehmen-zu-viel-essen-loesung",
        "type": "custom"
      },
      {
        "id": "abnehmen-to-diaet-loesung",
        "source": "abnehmen-pain-points",
        "target": "abnehmen-diaeten-loesung",
        "type": "custom"
      },
      {
        "id": "muskelaufbau-to-fortschritt-loesung",
        "source": "muskelaufbau-pain-points",
        "target": "muskelaufbau-keine-fortschritte-loesung",
        "type": "custom"
      },
      {
        "id": "muskelaufbau-to-training-loesung",
        "source": "muskelaufbau-pain-points",
        "target": "muskelaufbau-training-loesung",
        "type": "custom"
      },
      {
        "id": "fitness-to-zeit-loesung",
        "source": "fitness-pain-points",
        "target": "fitness-keine-zeit-loesung",
        "type": "custom"
      },
      {
        "id": "fitness-to-motivation-loesung",
        "source": "fitness-pain-points",
        "target": "fitness-motivation-loesung",
        "type": "custom"
      },
      {
        "id": "essen-loesung-to-commitment",
        "source": "abnehmen-zu-viel-essen-loesung",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "diaet-loesung-to-commitment",
        "source": "abnehmen-diaeten-loesung",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "fortschritt-loesung-to-commitment",
        "source": "muskelaufbau-keine-fortschritte-loesung",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "training-loesung-to-commitment",
        "source": "muskelaufbau-training-loesung",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "zeit-loesung-to-commitment",
        "source": "fitness-keine-zeit-loesung",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "motivation-loesung-to-commitment",
        "source": "fitness-motivation-loesung",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "commitment-to-niedrig",
        "source": "commitment-check",
        "target": "bereitschaft-niedrig",
        "type": "custom"
      },
      {
        "id": "commitment-to-mittel",
        "source": "commitment-check",
        "target": "bereitschaft-mittel",
        "type": "custom"
      },
      {
        "id": "commitment-to-hoch",
        "source": "commitment-check",
        "target": "bereitschaft-hoch",
        "type": "custom"
      },
      {
        "id": "niedrig-to-worksheet",
        "source": "bereitschaft-niedrig",
        "target": "kostenloses-worksheet",
        "type": "custom"
      },
      {
        "id": "mittel-to-termin",
        "source": "bereitschaft-mittel",
        "target": "termin-buchen",
        "type": "custom"
      },
      {
        "id": "hoch-to-termin",
        "source": "bereitschaft-hoch",
        "target": "termin-buchen",
        "type": "custom"
      }
    ]
  }'::jsonb,
  NULL
);