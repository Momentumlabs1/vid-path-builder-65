INSERT INTO funnels (name, structure, user_id) VALUES (
  'Niklas-Video-Funnel',
  '{
    "nodes": [
      {
        "id": "start-node",
        "type": "start",
        "position": { "x": 100, "y": 400 },
        "data": { 
          "label": "Start"
        }
      },
      {
        "id": "intro-video",
        "type": "video",
        "position": { "x": 500, "y": 400 },
        "data": {
          "label": "Intro Video (15-20s)",
          "videoUrl": "",
          "overlayText": "Bereit für echte Veränderung? In nur 20 Sekunden erfährst du, wie du dein Leben transformieren kannst.",
          "textPosition": "top-center",
          "textSize": "large",
          "textStyle": "glassmorphism",
          "callToActionText": "Jetzt starten →",
          "callToActionPosition": "bottom-center",
          "callToActionSize": "large",
          "answerType": "button",
          "buttonText": "Jetzt starten",
          "buttonColor": "purple",
          "buttonStyle": "glassmorphism",
          "buttonSize": "large",
          "buttonPosition": "bottom-center",
          "nextNodes": {
            "default": "goal-selection"
          }
        }
      },
      {
        "id": "goal-selection",
        "type": "video",
        "position": { "x": 900, "y": 400 },
        "data": {
          "label": "Ziel auswählen",
          "videoUrl": "",
          "overlayText": "Was ist dein Hauptziel? Wähle aus, was am besten zu dir passt:",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "💪 Fitness & Gesundheit - Körper transformieren, fit werden",
            "🚀 Business & Karriere - Erfolgreich werden, mehr verdienen",
            "🧠 Mindset & Persönlichkeit - Selbstbewusst werden, mentale Stärke"
          ],
          "mcColor_0": "green",
          "mcColor_1": "purple",
          "mcColor_2": "blue",
          "mcStyle_0": "glassmorphism",
          "mcStyle_1": "glassmorphism", 
          "mcStyle_2": "glassmorphism",
          "mcButtonSize": "large",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "fitness-pain-points",
            "1": "business-pain-points", 
            "2": "mindset-pain-points"
          }
        }
      },
      {
        "id": "fitness-pain-points",
        "type": "video",
        "position": { "x": 1300, "y": 150 },
        "data": {
          "label": "Fitness Pain Points",
          "videoUrl": "",
          "overlayText": "Was hält dich beim Fitness zurück? (Du kannst mehrere auswählen)",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "Keine Zeit für Sport",
            "Keine Motivation zum Training",
            "Schlechte Essgewohnheiten", 
            "Keine Ahnung von Ernährung",
            "Zu müde nach der Arbeit",
            "Keine Erfolge sichtbar"
          ],
          "mcColor_0": "red",
          "mcColor_1": "orange",
          "mcColor_2": "yellow",
          "mcColor_3": "green",
          "mcColor_4": "blue",
          "mcColor_5": "purple",
          "mcButtonSize": "default",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "default": "fitness-solution"
          }
        }
      },
      {
        "id": "business-pain-points",
        "type": "video",
        "position": { "x": 1300, "y": 400 },
        "data": {
          "label": "Business Pain Points",
          "videoUrl": "",
          "overlayText": "Was blockiert deinen Business-Erfolg? (Mehrfachauswahl möglich)",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "Keine Idee wo ich anfangen soll",
            "Angst vor dem Scheitern",
            "Zu wenig Kapital",
            "Keine Marketing Kenntnisse",
            "Prokrastination & Aufschieben", 
            "Überforderung mit der Technik"
          ],
          "mcColor_0": "red",
          "mcColor_1": "orange", 
          "mcColor_2": "yellow",
          "mcColor_3": "green",
          "mcColor_4": "blue",
          "mcColor_5": "purple",
          "mcButtonSize": "default",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "default": "business-solution"
          }
        }
      },
      {
        "id": "mindset-pain-points",
        "type": "video",
        "position": { "x": 1300, "y": 650 },
        "data": {
          "label": "Mindset Pain Points",
          "videoUrl": "",
          "overlayText": "Was hält dich mental zurück? (Mehrfachauswahl möglich)",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "Mangelndes Selbstvertrauen",
            "Ständige Selbstzweifel",
            "Negative Gedankenspirale",
            "Angst vor Veränderung",
            "Perfektionismus lähmt mich",
            "Vergleiche mit anderen"
          ],
          "mcColor_0": "red",
          "mcColor_1": "orange",
          "mcColor_2": "yellow", 
          "mcColor_3": "green",
          "mcColor_4": "blue",
          "mcColor_5": "purple",
          "mcButtonSize": "default",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "default": "mindset-solution"
          }
        }
      },
      {
        "id": "fitness-solution",
        "type": "video",
        "position": { "x": 1700, "y": 150 },
        "data": {
          "label": "Fitness Lösung (30-45s)",
          "videoUrl": "",
          "overlayText": "🎯 Deine personalisierte Lösung: Mit meinem bewährten 3-Phasen-System wirst du fit, ohne Stunden im Gym zu verbringen. Kurze, effektive Workouts + einfache Ernährungsregeln = nachhaltiger Erfolg. Diese Methode hat bereits über 1.000 Menschen geholfen.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Wie geht es weiter? →",
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
        "id": "business-solution",
        "type": "video",
        "position": { "x": 1700, "y": 400 },
        "data": {
          "label": "Business Lösung (30-45s)",
          "videoUrl": "",
          "overlayText": "🎯 Deine personalisierte Lösung: Mein Business-Blueprint zeigt dir Schritt für Schritt, wie du dein erstes erfolgreiches Online-Business aufbaust - auch ohne Vorerfahrung. Diese Methode hat bereits über 1.000 Menschen geholfen.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Wie geht es weiter? →",
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
        "id": "mindset-solution",
        "type": "video",
        "position": { "x": 1700, "y": 650 },
        "data": {
          "label": "Mindset Lösung (30-45s)",
          "videoUrl": "",
          "overlayText": "🎯 Deine personalisierte Lösung: Durch mentale Techniken und Mindset-Shifts entwickelst du unerschütterliches Selbstvertrauen und innere Stärke für alle Lebensbereiche. Diese Methode hat bereits über 1.000 Menschen geholfen.",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "button",
          "buttonText": "Wie geht es weiter? →",
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
        "id": "commitment-check",
        "type": "video",
        "position": { "x": 2100, "y": 400 },
        "data": {
          "label": "Commitment Check",
          "videoUrl": "",
          "overlayText": "Bist du bereit für Veränderung? Wie wichtig ist dir deine Transformation?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "🤔 Erstmal schauen - Ich informiere mich gerne",
            "💪 Ich bin motiviert - Ich will wirklich etwas ändern", 
            "🔥 Jetzt oder nie! - Ich bin bereit für alles"
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
            "0": "investment-low",
            "1": "investment-medium",
            "2": "investment-high"
          }
        }
      },
      {
        "id": "investment-low",
        "type": "video",
        "position": { "x": 2500, "y": 150 },
        "data": {
          "label": "Investment Niedrig",
          "videoUrl": "",
          "overlayText": "Was würdest du für deine Veränderung investieren?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "💡 Wissen & Zeit (0-50€/Monat)",
            "🎯 Coaching & Tools (50-200€/Monat)",
            "🚀 Premium Begleitung (200€+/Monat)"
          ],
          "mcColor_0": "green",
          "mcColor_1": "blue",
          "mcColor_2": "purple",
          "mcButtonSize": "default",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "offer-starter",
            "1": "offer-premium", 
            "2": "offer-vip"
          }
        }
      },
      {
        "id": "investment-medium",
        "type": "video",
        "position": { "x": 2500, "y": 400 },
        "data": {
          "label": "Investment Medium",
          "videoUrl": "",
          "overlayText": "Was würdest du für deine Veränderung investieren?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "💡 Wissen & Zeit (0-50€/Monat)",
            "🎯 Coaching & Tools (50-200€/Monat)",
            "🚀 Premium Begleitung (200€+/Monat)"
          ],
          "mcColor_0": "green",
          "mcColor_1": "blue", 
          "mcColor_2": "purple",
          "mcButtonSize": "default",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "offer-starter",
            "1": "offer-premium",
            "2": "offer-vip"
          }
        }
      },
      {
        "id": "investment-high",
        "type": "video",
        "position": { "x": 2500, "y": 650 },
        "data": {
          "label": "Investment Hoch",
          "videoUrl": "",
          "overlayText": "Was würdest du für deine Veränderung investieren?",
          "textPosition": "top-center",
          "textSize": "medium",
          "textStyle": "glassmorphism",
          "answerType": "multipleChoice",
          "answers": [
            "💡 Wissen & Zeit (0-50€/Monat)",
            "🎯 Coaching & Tools (50-200€/Monat)",
            "🚀 Premium Begleitung (200€+/Monat)"
          ],
          "mcColor_0": "green",
          "mcColor_1": "blue",
          "mcColor_2": "purple",
          "mcButtonSize": "default",
          "mcLayout": "vertical",
          "mcPosition": "bottom-center",
          "nextNodes": {
            "0": "offer-starter",
            "1": "offer-premium",
            "2": "offer-vip"
          }
        }
      },
      {
        "id": "offer-starter",
        "type": "end",
        "position": { "x": 2900, "y": 150 },
        "data": {
          "label": "Starter Angebot",
          "title": "🎓 Starter Paket",
          "message": "Perfekt für den Einstieg: Video-Kurs + Community + E-Book für nur 27€. 🎁 BONUS: Sofort-Start Anleitung (Wert: 47€) - GRATIS! 30 Tage Geld-zurück-Garantie.",
          "redirectUrl": "https://niklas-coaching.com/starter"
        }
      },
      {
        "id": "offer-premium",
        "type": "end",
        "position": { "x": 2900, "y": 400 },
        "data": {
          "label": "Premium Angebot",
          "title": "🚀 Premium Coaching",
          "message": "Das Komplettpaket: Persönliches Coaching + Tools + Community + Garantie für 97€/Monat. 🎁 BONUS: Sofort-Start Anleitung (Wert: 47€) - GRATIS! 30 Tage Geld-zurück-Garantie.",
          "redirectUrl": "https://niklas-coaching.com/premium"
        }
      },
      {
        "id": "offer-vip",
        "type": "end",
        "position": { "x": 2900, "y": 650 },
        "data": {
          "label": "VIP Angebot",
          "title": "💎 VIP Mentoring",
          "message": "Exklusive 1:1 Betreuung: Persönliches Mentoring + Direkter Zugang + Premium Tools + Erfolgsgarantie für 297€/Monat. 🎁 BONUS: Sofort-Start Anleitung (Wert: 47€) - GRATIS! 30 Tage Geld-zurück-Garantie.",
          "redirectUrl": "https://niklas-coaching.com/vip"
        }
      }
    ],
    "edges": [
      {
        "id": "start-to-intro",
        "source": "start-node",
        "target": "intro-video",
        "type": "custom"
      },
      {
        "id": "intro-to-goals",
        "source": "intro-video", 
        "target": "goal-selection",
        "type": "custom"
      },
      {
        "id": "goals-to-fitness-pain",
        "source": "goal-selection",
        "target": "fitness-pain-points",
        "type": "custom"
      },
      {
        "id": "goals-to-business-pain",
        "source": "goal-selection",
        "target": "business-pain-points",
        "type": "custom"
      },
      {
        "id": "goals-to-mindset-pain",
        "source": "goal-selection",
        "target": "mindset-pain-points",
        "type": "custom"
      },
      {
        "id": "fitness-pain-to-solution",
        "source": "fitness-pain-points",
        "target": "fitness-solution",
        "type": "custom"
      },
      {
        "id": "business-pain-to-solution",
        "source": "business-pain-points",
        "target": "business-solution",
        "type": "custom"
      },
      {
        "id": "mindset-pain-to-solution",
        "source": "mindset-pain-points",
        "target": "mindset-solution",
        "type": "custom"
      },
      {
        "id": "fitness-solution-to-commitment",
        "source": "fitness-solution",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "business-solution-to-commitment",
        "source": "business-solution",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "mindset-solution-to-commitment",
        "source": "mindset-solution",
        "target": "commitment-check",
        "type": "custom"
      },
      {
        "id": "commitment-to-low",
        "source": "commitment-check",
        "target": "investment-low",
        "type": "custom"
      },
      {
        "id": "commitment-to-medium",
        "source": "commitment-check",
        "target": "investment-medium",
        "type": "custom"
      },
      {
        "id": "commitment-to-high",
        "source": "commitment-check",
        "target": "investment-high",
        "type": "custom"
      },
      {
        "id": "low-to-starter",
        "source": "investment-low",
        "target": "offer-starter",
        "type": "custom"
      },
      {
        "id": "low-to-premium",
        "source": "investment-low",
        "target": "offer-premium",
        "type": "custom"
      },
      {
        "id": "low-to-vip",
        "source": "investment-low",
        "target": "offer-vip",
        "type": "custom"
      },
      {
        "id": "medium-to-starter",
        "source": "investment-medium",
        "target": "offer-starter",
        "type": "custom"
      },
      {
        "id": "medium-to-premium",
        "source": "investment-medium",
        "target": "offer-premium",
        "type": "custom"
      },
      {
        "id": "medium-to-vip",
        "source": "investment-medium",
        "target": "offer-vip",
        "type": "custom"
      },
      {
        "id": "high-to-starter",
        "source": "investment-high",
        "target": "offer-starter",
        "type": "custom"
      },
      {
        "id": "high-to-premium",
        "source": "investment-high",
        "target": "offer-premium",
        "type": "custom"
      },
      {
        "id": "high-to-vip",
        "source": "investment-high",
        "target": "offer-vip",
        "type": "custom"
      }
    ]
  }'::jsonb,
  NULL
);