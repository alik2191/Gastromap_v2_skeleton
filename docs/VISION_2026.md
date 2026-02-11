# GastroMap Vision & Strategy 2026

## 1. Current State Assessment (Technical & Product)

### Product Overview
GastroMap is currently a React-based web application focused on restaurant discovery with social and AI elements. The core value proposition revolves around finding places to eat, viewing details, and social interaction through user profiles.

### Key Capabilities (Existing)
*   **Authentication:** Firebase-based auth system (Login/Register).
*   **Map Interface:** Interactive map for venue discovery (likely Leaflet/Mapbox based on typical stacks, though specific lib needs confirmation from package.json).
*   **AI Integration:** A dedicated `AiChat` feature suggests a conversational interface for recommendations.
*   **Social Graph:** User profiles (`UserProfile`), friends system, and the ability to interact with other users.
*   **Venue Management:** Detailed venue views (`VenueDetails`), favorites list, and search functionality.
*   **Gamification (Basic):** Evidence of a `gamification` feature slice, implying badges, levels, or points.
*   **Booking:** Basic reservation flow (`BookingModal`).

### Technical Stack & Debt
*   **Frontend:** React (Vite), Redux Toolkit (State Management), TypeScript.
*   **Backend/Services:** Heavily reliant on Firebase (Auth, Firestore likely).
*   **Architecture:** Feature-sliced design pattern (`features/`, `components/`, `services/`), which is good for scalability.
*   **Potential Weaknesses:**
    *   **Offline Mode:** No explicit evidence of robust offline-first architecture (PWA service workers need verification).
    *   **Performance:** Heavy reliance on client-side rendering might impact SEO and initial load times compared to Next.js/SSR.
    *   **Data depth:** The distinction between "mock" data and real API integration needs to be bridged for scale.

---

## 2. Gap Analysis (Market vs. Current)

| Feature Category | Market Leader Standard (2026) | GastroMap Current State | The Gap |
| :--- | :--- | :--- | :--- |
| **Discovery** | Hyper-personalized, context-aware (weather, mood, health data) | Keyword search & Map browsing | Lack of proactive, "Zero-UI" recommendations. |
| **Social** | "Eat together" planning, live location sharing, influencer curations | Friends list, Profiles | Passive social connection vs. Active social coordination. |
| **Content** | Vertical video (TikTok-style), AR menus, immersive 3D | Static images, Text descriptions | Visual engagement is low; feels like a directory, not an experience. |
| **Loyalty** | Cross-restaurant crypto rewards, NFT collectibles | Basic points/badges (Gamification) | Rewards are siloed or non-monetary. |
| **AI** | Voice-first assistants, auto-booking agents | Text-based Chat interface | AI is reactive (user asks) rather than proactive (AI suggests). |

---

## 3. Killer Features (The "GastroMap 2026" Edge)

### 1. "Mood & Bio-Sync" Discovery (AI + Health)
*   **Concept:** Don't just ask "What do you want?". Integrate with Apple Health/Google Fit to see if the user just worked out (suggest high protein) or had a sedentary day (suggest light salad).
*   **Implementation:** `HealthKit` API integration + LLM prompt engineering that takes biometric context as input.

### 2. AR "Dish-o-Vision"
*   **Concept:** Point camera at a physical menu (or restaurant front) to see floating 3D models of dishes, user ratings, and allergen warnings overlaid in real-time.
*   **Implementation:** WebXR (or native wrapper) + Image Recognition.

### 3. "GastroDAO" Tokenized Rewards
*   **Concept:** Eat at partner restaurants to mine "GastroCoin". Use coins to buy secret menu items or pay for meals.
*   **Implementation:** Solana/Polygon L2 integration. Wallet embedded in User Profile.

### 4. "Dine With Me" (Tinder for Lunch)
*   **Concept:** Opt-in feature to show you are "Looking for lunch company" on the map for the next 60 mins. Matches you with friends or colleagues nearby.
*   **Implementation:** Geolocation background services + WebSocket real-time presence.

### 5. The "Anti-Decision" Button
*   **Concept:** Group paralysis solver. All users in a party swipe right/left on 10 options. App calculates the optimal mathematical compromise instantly.
*   **Implementation:** Room-based socket session + Weighted voting algorithm.

---

## 4. Technical Roadmap

### Phase 1: Solidify Foundation (Q1-Q2)
*   **PWA Transformation:** Maximize offline capabilities using Vite PWA plugin. Cache venue data for subway/airplane usage.
*   **Performance:** Implement code-splitting by route and lazy loading for heavy components (Map, AR).
*   **Type Safety:** Strict TypeScript enforcement across all `services/` and `store/` slices.

### Phase 2: The "Smart" Layer (Q3)
*   **Vector Search:** Move from standard text search to semantic search (Pinecone/Milvus) for "cozy place for a rainy date" type queries.
*   **Edge Functions:** Move heavy computations (AI recommendations) to Edge functions (Vercel/Cloudflare) to reduce latency.

### Phase 3: Expansion & Ecosystem (Q4+)
*   **React Native Port:** Use the existing logic/store to wrap a native app for better Geolocation/AR access.
*   **Restaurant Portal:** Build the B2B side for owners to manage menus and view analytics.

---

## 5. Monetization Strategy

### 1. "Priority Craving" (B2B Ads)
*   **Model:** Restaurants pay for higher ranking *only* when they match the user's specific specific AI search (high relevance, low annoyance).
*   **Revenue:** CPC (Cost Per Click) or CPA (Cost Per Action/Booking).

### 2. GastroMap Premium (B2C Subscription)
*   **Price:** $4.99/mo.
*   **Benefits:**
    *   Zero booking fees.
    *   Exclusive "Chef's Table" reservations.
    *   Double reward points (Crypto/Gamification).
    *   Advanced nutritional analytics.

### 3. Transactional (Booking Fee)
*   **Model:** Small flat fee ($1-2) for securing high-demand tables at peak times (dynamic pricing).
