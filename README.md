# 🍽 GastroMap V2 - Premium Discovery App

GastroMap is a modern, premium web application for discovering culinary spots. It features a "Glassmorphism" design aesthetic, smooth animations (Framer Motion), and a mobile-first approach.

## 🚀 Current Status & Features

The application is in active development (V2 Skeleton). The core user flows are implemented with mock data for UI validation.

### ✅ Implemented Modules

1.  **Dashboard (`/dashboard`)**
    *   **Mobile**: Horizontal scrollable sliders for "Countries", "Recommended", and "Trending".
    *   **Desktop**: Grid layouts with hero section and greetings.
    *   **Search**: Integrated search bar with glassmorphism UI.
    *   **Greeting System**: Time-aware user greeting.

2.  **Map (`/map tab`)**
    *   **Technology**: React Leaflet + OpenStreetMap.
    *   **Features**:
        *   Custom markers (dining, cafe, bar icons).
        *   **Geolocation**: "Locate Me" button with auto-fly to user position.
        *   **User Marker**: Pulsing blue dot indicator.
        *   **Theme Aware**: Dark/Light mode map tiles.

3.  **Location Discovery (`/explore`)**
    *   **Mobile Sheet**: Draggable bottom sheet (Framer Motion) for switching between Map and List views.
    *   **Filters**: Glassmorphism modal for filtering by Price, Rating, Category (Portal-based).
    *   **Cards**: Premium "Compact" cards with optimized typography (`text-sm`, `text-xl`).

4.  **Location Details (`/location/:id`)**
    *   **Hero**: Immersive header image with gradient overlays.
    *   **Info Grid**: Bento-style grid for gallery and operational info.
    *   **Typography**: Optimized specifically for mobile readability (avoiding large fonts).
    *   **Reviews**: Rating bars and user reviews list.

5.  **Profile (`/profile`)**
    *   **Structure**: iOS-style settings groups (Account, Support, Legal).
    *   **Feedback**: Modal for sending feedback.
    *   **GDPR**: "Request Data Deletion" option included.
    *   **Stats**: Compact 2x2 grid for user achievements.

6.  **Navigation**
    *   **Bottom Bar**: Floating glass dock with active state animations.
    *   **Page Transitions**: Smooth fade-in/slide-up effects on route changes.

---

## 🛠 Tech Stack

*   **Core**: React 18, Vite.
*   **Styling**: Tailwind CSS (Native).
*   **Animations**: Framer Motion (page transitions, bottom sheets, gestures).
*   **Icons**: Lucide React.
*   **Maps**: React Leaflet, Leaflet CSS.
*   **State Management**: Zustand (Auth, Locations).
*   **Router**: React Router DOM v6.

---

## 📂 Project Structure (Feature-Based)

We follow a feature-sliced architecture to keep the codebase scalable.

```
src/
├── app/                 # Global app configuration
├── assets/              # Static assets (images, global css)
├── components/          # Shared UI components
│   ├── ui/              # Buttons, Inputs, transitions (PageTransition)
│   └── layout/          # Navigation (BottomNav)
├── features/            # MAIN BUSINESS LOGIC
│   ├── auth/            # Authentication (Login, Register)
│   ├── dashboard/       # Main user views (Dashboard, Map, Profile)
│   │   ├── components/  # MapTab, FilterModal
│   │   └── pages/       # DashboardPage, ProfilePage
│   ├── public/          # Public & Discovery views
│   │   ├── components/  # LocationCard
│   │   └── pages/       # LocationsPage, LocationDetailsPage
│   └── admin/           # Admin panel (WIP)
├── hooks/               # Global hooks (useTheme)
└── lib/                 # Utilities
```

---

## 🎨 Design System: "Premium Mobile"

We adhere to strict design rules to maintain a premium feel:

1.  **Typography**:
    *   **Headings**: `text-xl` or `text-2xl` font-black. Avoid `text-4xl+` on mobile.
    *   **Body**: `text-sm` or `text-[13px]` font-medium/bold.
    *   **Subtext**: `text-[11px]` or `text-[10px]` uppercase tracking-widest.

2.  **Colors & Theming**:
    *   **Light Mode**: White backgrounds, blue accents (`text-blue-600`), soft gray borders.
    *   **Dark Mode**: Deep gray/black backgrounds (`bg-[#1a1c24]`), white text, subtle semi-transparent borders (`border-white/10`).

3.  **Glassmorphism**:
    *   Used on: Modals, Bottom Nav, Floating Buttons, Cards.
    *   Style: `backdrop-blur-md`, `bg-white/90` (or `bg-black/50`), thin borders.

4.  **Interactions**:
    *   **Active Scale**: Buttons scale down (`active:scale-95`) on press.
    *   **Haptic Visuals**: Ripples or pulses (e.g., user location marker).

---

## 📝 Recent Changelog

*   **Refactor**: Unified typography across `DashboardPage`, `LocationsPage`, and `LocationDetailsPage` to match "Compact Premium" standards.
*   **Feature**: Added Geolocation support in `MapTab`.
    *   "Locate Me" button positioned centrally on mobile (`right-4 center`).
    *   Pulsing user marker.
*   **Feature**: Redesigned `ProfilePage` to match international standards (GDPR, Feedback modal).
*   **Fix**: Resolved z-index conflicts with filters and map buttons.

---

## 🔮 Next Steps

*   [ ] connect Supabase for real data.
*   [ ] Implement Admin Panel logic.
*   [ ] Finalize Reservation flow (currently placeholder).
