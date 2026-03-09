

## Plan: Modernes Kunden-Interface mit Admin-Trennung

### Aktuelle Situation
- `/dashboard` – Admin-Dashboard (Momentumlabs-Intern)
- `/builder` – Admin Funnel Builder
- `/admin` – Admin Lead Management
- Alles funktional, aber "intern" gestaltet

### Neue Architektur

```text
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN BEREICH (bleibt)                    │
│  /admin/*  – Interner Zugriff für euch                      │
│  - /admin/dashboard                                          │
│  - /admin/builder                                            │
│  - /admin/leads                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 KUNDEN APP (neu)                             │
│  /app/*  – Premium SaaS Interface für Abo-Kunden            │
│                                                              │
│  ┌──────────┐  ┌────────────────────────────────────────┐   │
│  │ Sidebar  │  │  Main Content Area                      │   │
│  │          │  │                                         │   │
│  │ 📊 Home  │  │  • Funnel Cards mit Preview-Thumbnails │   │
│  │ 🎬 Funnels│  │  • Quick Stats                         │   │
│  │ ➕ Builder│  │  • Recent Activity                     │   │
│  │ 📈 Analytics│  │                                       │   │
│  │ 👤 Account│  │                                        │   │
│  │          │  │                                         │   │
│  └──────────┘  └────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Neue Dateien

1. **`src/pages/app/AppLayout.tsx`**
   - Sidebar-Navigation (collapsible)
   - User Avatar + Account Dropdown
   - Breadcrumbs
   - Dark Mode mit Glassmorphism

2. **`src/pages/app/AppDashboard.tsx`**
   - Funnel-Karten mit Hover-Effekten
   - Quick-Actions (Neuer Funnel, Duplizieren)
   - Statistik-Widgets (Conversions, Views, Leads)
   - "Getting Started" für neue User

3. **`src/pages/app/AppFunnels.tsx`**
   - Grid/List-Ansicht aller Funnels
   - Filter & Suche
   - Bulk Actions (Löschen, Export)
   - Funnel-Status-Badges

4. **`src/pages/app/AppBuilder.tsx`**
   - Wrapper um bestehenden `FunnelBuilder`
   - Modernisierte Header-Bar
   - Bessere Node-Palette (Drag & Drop)
   - Keyboard Shortcuts Overlay

5. **`src/pages/app/AppAnalytics.tsx`**
   - Funnel Performance Charts
   - Conversion Rates
   - User Journey Visualization
   - Export Reports

6. **`src/pages/app/AppSettings.tsx`**
   - Account-Einstellungen
   - Branding (Logo, Farben)
   - API Keys
   - Integrations

### UI-Komponenten (neu)

- **`AppSidebar.tsx`** – Collapsible Navigation
- **`FunnelCard.tsx`** – Preview-Karte mit Aktionen
- **`StatWidget.tsx`** – Animierte Statistik-Kacheln
- **`QuickActionBar.tsx`** – Floating Action Buttons

### Routing Update (`App.tsx`)

```text
/           → Landing Page
/app        → Redirect zu /app/dashboard
/app/dashboard → Kunden-Dashboard
/app/funnels   → Funnel-Übersicht
/app/builder   → Moderner Builder
/app/builder/:id → Builder mit Funnel
/app/analytics → Analytics
/app/settings  → Einstellungen

/admin/*    → Admin-Bereich (bestehend)
```

### Design-System

- **Sidebar**: Fixed, 280px, collapsible zu 64px
- **Cards**: Glassmorphism mit subtle Glow
- **Colors**: Gradient Accents (Purple → Blue)
- **Typography**: Inter/Figtree, klare Hierarchie
- **Animations**: Framer Motion für Übergänge

### Technische Details

- Nutzt bestehende `FunnelBuilder`-Logik (Import)
- Supabase-Queries bleiben gleich
- Shared Components wo möglich
- Responsive: Desktop-first, Mobile-optimiert

