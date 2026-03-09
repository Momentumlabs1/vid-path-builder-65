

# Master-Plan: Video Funnel Builder → SaaS-Produkt

## Ist-Zustand

Das Projekt ist ein funktionierender Video-Funnel-Builder mit:
- ReactFlow-basierter Editor (Nodes: Video, Start, End, LeadCapture, API)
- Dashboard mit Funnel-Liste, Vorschau, Export, Embed
- Admin-Dashboard (Leads, Status-Tracking)
- Client-Dashboard (pro Funnel)
- Supabase-Backend (funnels, leads, funnel_responses, Videos, lead_status)
- **Kein Auth** — alles ist öffentlich zugänglich, keine Benutzerkonten
- **Kein Payment** — keine Monetarisierung
- **Kein Multi-Tenancy** — alle sehen alle Daten

---

## Ziel-Architektur

```text
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
├──────────┬──────────┬───────────┬───────────────┤
│ Landing  │ Auth     │ App       │ Public        │
│ Page     │ (Login/  │ (Dashboard│ (Funnel       │
│ + Preis  │ Signup)  │ Builder   │ Viewer/Embed) │
│ Seite    │          │ Settings) │               │
└──────────┴──────────┴───────────┴───────────────┘
                      │
┌─────────────────────┴───────────────────────────┐
│                   BACKEND                        │
├──────────┬──────────┬───────────┬───────────────┤
│ Auth     │ DB mit   │ Stripe    │ Storage       │
│ System   │ RLS pro  │ Payments  │ (Videos)      │
│          │ User     │           │               │
└──────────┴──────────┴───────────┴───────────────┘
```

---

## Phase 1: Authentication + Multi-Tenancy

### 1.1 Auth-System einrichten
- Login/Signup-Seiten mit E-Mail + Passwort
- Passwort-Reset-Flow (`/reset-password`)
- Optional: Google OAuth via Lovable Cloud
- `profiles`-Tabelle mit `id`, `user_id`, `display_name`, `avatar_url`, `plan` (free/pro/business)
- Auto-Create-Trigger bei Signup

### 1.2 Datenbank absichern
- `funnels.user_id` wird **required** (nicht mehr nullable)
- Alle RLS-Policies auf `auth.uid() = user_id` umstellen
- `leads` und `funnel_responses` bleiben public INSERT (für Funnel-Besucher), aber SELECT nur für Funnel-Owner
- `Videos.user_id` wird required + RLS pro User
- Neue `user_roles`-Tabelle für Admin-Zugang (nach Lovable-Vorgabe mit `has_role()`-Funktion)

### 1.3 Protected Routes
- `/builder`, `/dashboard`, `/admin`, `/settings` nur für eingeloggte User
- Auth-Guard-Komponente die auf `/login` redirected
- Funnel-Viewer (`/funnel/:id`, `/embed/:id`) bleibt öffentlich

---

## Phase 2: Landing Page + Pricing

### 2.1 Landing Page (`/`)
- Hero-Section mit Produkt-Demo/Video
- Feature-Übersicht (Drag & Drop Builder, Video Funnels, Lead Capture, Analytics)
- Social Proof / Testimonials Bereich
- CTA → Signup

### 2.2 Pricing Page (`/pricing`)
- 3 Pläne: Free, Pro, Business
- Free: 1 Funnel, 100 Leads/Monat, Lovable-Branding
- Pro: Unlimited Funnels, 5.000 Leads, Custom Branding, Export
- Business: Alles + Team-Zugang, API, Priority Support
- Stripe-Integration für Zahlungen (Subscriptions)

### 2.3 Stripe-Anbindung
- Checkout-Sessions für Plan-Upgrades
- Webhook-Edge-Function für Subscription-Events
- Plan-Status in `profiles.plan` speichern
- Feature-Gates im Frontend basierend auf Plan

---

## Phase 3: Dashboard + App-Redesign

### 3.1 Neues App-Layout
- Sidebar-Navigation (Dashboard, Funnels, Leads, Analytics, Settings)
- Konsistentes Dark-Theme (bereits vorhanden, polieren)
- Responsive für Mobile

### 3.2 Dashboard (`/dashboard`)
- Übersicht: Gesamt-Leads, Aktive Funnels, Conversion-Rate
- Letzte Aktivitäten
- Quick-Actions (Neuer Funnel, Template laden)
- Nur eigene Daten (per RLS)

### 3.3 Settings-Seite (`/settings`)
- Profil bearbeiten (Name, Avatar)
- Plan-Management (aktueller Plan, Upgrade-Button)
- Custom Domain Einstellungen
- API-Keys (für Business-Plan)
- Account löschen

---

## Phase 4: Editor-Verbesserungen

### 4.1 Funnel-Builder Polish
- Autosave alle 30 Sekunden
- Undo/Redo
- Node-Templates (vorgefertigte Node-Konfigurationen)
- Drag & Drop aus Sidebar statt Buttons
- Zoom-Controls verbessern

### 4.2 Analytics pro Funnel
- Conversion-Funnel-Visualisierung (wo springen Leute ab?)
- Zeitliche Trends (Leads pro Tag/Woche)
- Session-Replay-Daten (welche Antworten sind beliebt?)

---

## Technische Umsetzung (Zusammenfassung)

| Komponente | Technologie |
|---|---|
| Auth | Lovable Cloud Auth (Email + optional Google) |
| Payment | Stripe via Lovable Stripe-Integration |
| DB-Security | RLS Policies mit `auth.uid()` |
| Admin-Rollen | `user_roles`-Tabelle + `has_role()` Security Definer |
| Frontend-Routing | React Router mit Auth-Guard |
| State | React Query (bereits vorhanden) |
| UI | Shadcn/Tailwind (bereits vorhanden) |

### Neue Seiten
- `/` — Landing Page
- `/pricing` — Preise + Stripe Checkout
- `/login` — Login
- `/signup` — Registrierung
- `/reset-password` — Passwort Reset
- `/dashboard` — User Dashboard (umgebaut)
- `/settings` — Profil + Plan
- `/builder` — Funnel Editor (bestehend)
- `/admin` — Admin (nur mit Rolle)

### Neue DB-Tabellen
- `profiles` (user_id, display_name, avatar_url, plan, created_at)
- `user_roles` (user_id, role enum)

### DB-Migrationen
- `funnels.user_id` NOT NULL + RLS
- `Videos.user_id` NOT NULL + RLS
- RLS auf `leads`/`funnel_responses`: INSERT public, SELECT nur Owner (via JOIN auf funnels.user_id)

---

## Empfohlene Reihenfolge

1. **Auth zuerst** — ohne Auth ist nichts sicher
2. **RLS + Multi-Tenancy** — Daten pro User isolieren
3. **Landing Page + Routing** — öffentlich vs. privat trennen
4. **Pricing + Stripe** — Monetarisierung
5. **Dashboard-Redesign** — professionelles UI
6. **Editor-Polish** — Autosave, Undo/Redo
7. **Analytics** — Conversion-Tracking

Soll ich mit Phase 1 (Authentication) starten?

