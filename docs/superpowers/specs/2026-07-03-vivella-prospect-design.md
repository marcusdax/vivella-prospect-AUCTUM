# VIVELLA PROSPECT — Design Specification

**Date:** 2026-07-03  
**Status:** Approved for implementation planning  
**Project:** VIVELLA PROSPECT Property Intelligence Command Center  
**Platform:** Expo (React Native + Web), single shared codebase  

---

## 1. Purpose & Scope

VIVELLA PROSPECT is a property-intelligence command center for real estate investors, contractors, and property professionals. The MVP prioritizes three tools drawn from the VIVELLA Property Intelligence Omnibus:

1. **Sentinel Scanner** — property condition monitoring from street/satellite imagery.
2. **Alter Rendering Engine** — photorealistic before/after renovation visualization.
3. **Real Estate Prospector** — deal discovery, deal analysis, and portfolio tracking.

The **Probate Pipeline** is intentionally deprioritized and exposed only as a minimal case-linking screen.

The app ships as a single Expo codebase that runs on iOS, Android, and web, deployed to Vercel (web) and EAS/Expo Go (mobile).

---

## 2. Product / UX Overview

### 2.1 Primary Screens

| Route | Screen | Purpose |
|-------|--------|---------|
| `/` | Dashboard | Snapshot of scanner hits, render jobs, top prospects, portfolio movement, recent alerts. |
| `/scanner` | Sentinel Scanner | Map + list of properties flagged by condition signals. |
| `/scanner/[id]` | Scanner Property Detail | Imagery, detected issues, confidence scores, actions. |
| `/render` | Alter Rendering | Gallery of render jobs; create new renovation mockups. |
| `/render/[id]` | Render Detail | Before/after comparison, AR overlay preview, share. |
| `/prospector` | Real Estate Prospector | Deal discovery map/list with investor-strategy filters. |
| `/prospector/[id]` | Deal Analysis | ARV, rehab estimate, comps, cash-flow projections. |
| `/portfolio` | Portfolio | Watchlist + owned properties, simple performance. |
| `/alerts` | Alert Center | Scanner detections, render completions, prospect updates. |
| `/probate` | Probate (minimal) | Basic case list with property linking. |
| `/settings` | Settings | Toggle mock/live geo feed, map style, units, about. |

### 2.2 Navigation

- **Mobile:** bottom tab bar with Dashboard, Scanner, Render, Prospector, Alerts.
- **Web:** responsive sidebar / top tabs, collapsible on narrow viewports.
- Shared header with VIVELLA logo, global search, alert badge.

### 2.3 Key Flows

1. Open app → Dashboard → tap Scanner → explore map pins → tap property → view issues → generate render.
2. Open Render → select property + preset → processing → view before/after → share.
3. Open Prospector → apply strategy filters → tap deal → view analysis → add to portfolio/watchlist.
4. Alert arrives → tap → land on relevant detail screen.

### 2.4 Brand Expression

- **Colors:** Parchment background, Root Earth text, Neural Amber CTAs, Flourish Green positive status, Dawn Rose warnings.
- **Typography:** Geist Sans for UI, Source Serif 4 for editorial/narrative contexts.
- **Shapes:** 16px card radius, 8px button radius (pill for primary), 2px icon stroke, organic flourish shapes where appropriate.
- **Spacing:** generous clarity principle — 48px desktop / 32px mobile section gaps.

---

## 3. Architecture

### 3.1 Stack

- **Expo SDK 50+** with **Expo Router** (file-based routing for web + mobile).
- **React Native / React Native Web** for shared components.
- **NativeWind** (Tailwind CSS for RN) for styling.
- **Zustand** for global UI state.
- **TanStack Query (React Query)** for server/adapter state.
- **MapLibre GL** via `@maplibre/maplibre-react-native` (mobile) and `maplibre-gl` (web), wrapped by a single `<MapView>` component.
- **AsyncStorage** for local preferences and cached data.
- **Lucide React Native** for icons.

### 3.2 Directory Structure

```
apps/vivella-prospect/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard
│   │   ├── scanner.tsx        # Sentinel Scanner
│   │   ├── render.tsx         # Alter Rendering
│   │   ├── prospector.tsx     # Real Estate Prospector
│   │   └── alerts.tsx         # Alert Center
│   ├── scanner/[id].tsx
│   ├── render/[id].tsx
│   ├── prospector/[id].tsx
│   ├── portfolio.tsx
│   ├── probate.tsx
│   └── settings.tsx
├── src/
│   ├── components/            # shared UI
│   ├── design-system/         # tokens
│   ├── hooks/                 # data hooks
│   ├── services/              # adapter implementations
│   │   ├── properties/
│   │   ├── scanner/
│   │   ├── renderer/
│   │   ├── prospector/
│   │   └── geo/
│   ├── stores/                # Zustand
│   ├── types/                 # TS types
│   └── utils/
```

### 3.3 Adapter Pattern

No backend server in the MVP. Every data domain exposes a typed interface with a `MockAdapter` and a `LiveAdapter` where feasible:

- `properties`: mock property records + Overpass building demo feed + Census/ACS tract enrichment.
- `scanner`: mock condition-scoring engine (roof/paint/windows/structural) with confidence scores.
- `renderer`: mock render job queue returning pre-computed before/after image pairs.
- `prospector`: mock deal-scoring engine with strategy filters and ROI calculations.

Real AI/ML (computer vision, generative rendering) is simulated; the adapter layer is built so real APIs can be swapped in later.

---

## 4. Components / Design System

### 4.1 Tokens (NativeWind theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `parchment` | `#F5F0EB` | Primary background |
| `root-earth` | `#5C3D2E` | Primary text |
| `neural-amber` | `#D4A24A` | CTAs, highlights |
| `dawn-rose` | `#E8B4B4` | Warnings, emotional touchpoints |
| `flourish-green` | `#7A8B6F` | Positive status, growth |
| `deep-bark` | `#3D2B1F` | Dark mode bg, premium print |
| `warm-stone` | `#C4B5A5` | Dividers, disabled states |
| `soft-mist` | `#E8E2DB` | Card backgrounds |

### 4.2 Shared Components

- `<Button>` — primary (neural-amber bg, root-earth text), secondary, ghost.
- `<Card>` — 16px radius, soft shadow, soft-mist/parchment background.
- `<Badge>` — severity, status, strategy.
- `<KPIStat>` — dashboard numbers with context labels.
- `<FilterChip>` — horizontal scrollable filters.
- `<PropertyListItem>`, `<ScannerHitItem>`, `<ProspectCard>` — consistent media + metadata + actions.
- `<MapMarker>` — colored pins with pulse animation for new hits.
- `<BeforeAfter>` — slider/toggle comparison for renders.
- `<EmptyState>` — illustration + headline + CTA.

### 4.3 Icons

- `lucide-react-native`, 24px, 2px stroke, rounded terminals.
- Icon + label by default; label-hide option for power users.

---

## 5. Data Flow

### 5.1 Dashboard

Parallel TanStack Query calls on mount:
- `useScannerSummary`
- `useRenderJobs`
- `useTopProspects`
- `useRecentAlerts`
- `usePortfolioSummary`

### 5.2 Sentinel Scanner

Map viewport change → `useScannerHits(bounds, filters)` → adapter returns scored properties.
- Mock adapter deterministically generates condition issues from seeded data.
- Live geo adapter fetches Overpass building footprints for viewport overlay.
- Tap pin/card → `/scanner/[id]` → detail query.

### 5.3 Alter Rendering

User selects property + renovation preset → create job in Zustand store → `MockRendererAdapter` returns pre-computed before/after pair after a short processing delay.
- Job statuses: queued → processing → completed.
- Completed job appears in `/render` gallery and triggers an in-app alert.

### 5.4 Real Estate Prospector

Filters (strategy, price, equity, condition) → `useProspects(filters)` → adapter ranks mock deals.
- Deal detail loads ARV, rehab estimate, comps, cash-flow from `MockProspectorAdapter`.
- Add to watchlist/owned → persisted in AsyncStorage via portfolio store.

### 5.5 Alerts

Derived events: new scanner hit, render complete, prospect price drop.
Append-only log in Zustand + AsyncStorage.

---

## 6. Error Handling & Loading States

- Every TanStack Query hook exposes `isLoading`, `isError`, `error`, `refetch`.
- Loading: skeleton cards, map spinner, shimmer list items.
- Error: inline retry card; live-geo failures auto-fallback to mock data with a non-blocking banner.
- React Error Boundary per tab route; fallback screen with restart action.
- Network timeouts on live adapters default to mock adapter after 8 seconds.
- Map initialization failure falls back to static list view.
- Render job failure surfaces retry CTA and preserves queued job.
- Empty states for no scanner hits, no render jobs, no prospects.

---

## 7. Testing & Deployment

### 7.1 Testing

- TypeScript strict mode + ESLint.
- Jest + React Native Testing Library for components and adapter utilities.
- Smoke tests for each tab screen.
- Adapter tests verify mock data contracts and live-adapter fallback behavior.

### 7.2 Deployment

- **Web:** `npx expo export --platform web` → static bundle → **Vercel**.
- **Mobile:** **EAS Build** for iOS/Android preview builds; **EAS Update** for OTA patches.
- No app-store submission in MVP; distribution via Expo Go / internal distribution.

### 7.3 Environment Variables

- `EXPO_PUBLIC_MAP_STYLE_URL` — map tile endpoint.
- `EXPO_PUBLIC_USE_LIVE_GEO` — toggle live vs mock geo data.
- No secrets required for MVP.

---

## 8. Decisions & Trade-offs

| Decision | Rationale |
|----------|-----------|
| Expo Router single codebase | Fastest path to web + mobile from one repo. |
| Mock-first adapters | Ships a functional MVP without waiting for real AI/ML APIs. |
| MapLibre + free tiles | Cross-platform consistency, no API key friction for demo. |
| No auth in MVP | Public demo mode accelerates deployment and sharing. |
| Probate minimal | Reflects user priority: investment and visualization first. |
| Zustand over Redux Toolkit | Less boilerplate for a single-app MVP. |

---

## 9. Open Questions for Implementation

None. All product, architecture, and deployment questions have been resolved and approved.
