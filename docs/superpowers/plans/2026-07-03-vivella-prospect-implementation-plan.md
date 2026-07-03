# VIVELLA PROSPECT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the VIVELLA PROSPECT property-intelligence command center as a single Expo (React Native + Web) codebase, with Sentinel Scanner, Alter Rendering Engine, Real Estate Prospector, and minimal Probate linking, deployable to Vercel and EAS.

**Architecture:** File-based routing via Expo Router; shared UI styled with NativeWind/Tailwind and VIVELLA tokens; client-side data adapters (mock + live public geo feeds) consumed through TanStack Query; Zustand for local state; MapLibre GL wrapped for cross-platform maps.

**Tech Stack:** Expo SDK 52, React Native 0.76, React 18, TypeScript 5, Expo Router, NativeWind 4, TanStack Query 5, Zustand 5, MapLibre GL, Lucide React Native, AsyncStorage, Jest + RNTL.

## Global Constraints

- Node 20+ and npm 10+.
- Single Expo codebase; web and mobile share the same source files.
- No backend server in MVP; all data is client-side or from public APIs.
- Mock adapters are the default; live geo adapters are toggled via `EXPO_PUBLIC_USE_LIVE_GEO`.
- Brand colors must match the approved spec exactly (Neural Amber `#D4A24A`, Root Earth `#5C3D2E`, etc.).
- WCAG AA contrast compliance for all text/background pairings.
- Every task ends with a testable deliverable and a git commit.

---

## File Structure

```
vivella-prospect/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # bottom tab layout + header
│   │   ├── index.tsx            # Dashboard
│   │   ├── scanner.tsx          # Sentinel Scanner
│   │   ├── render.tsx           # Alter Rendering gallery
│   │   ├── prospector.tsx       # Real Estate Prospector
│   │   └── alerts.tsx           # Alert Center
│   ├── scanner/
│   │   └── [id].tsx             # Scanner property detail
│   ├── render/
│   │   └── [id].tsx             # Render job detail
│   ├── prospector/
│   │   └── [id].tsx             # Deal analysis
│   ├── portfolio.tsx            # Portfolio tracker
│   ├── probate.tsx              # Minimal probate linking
│   └── settings.tsx             # Demo toggles
├── src/
│   ├── components/              # shared UI
│   ├── design-system/           # tokens + tailwind config
│   ├── hooks/                   # TanStack Query hooks
│   ├── services/                # adapter implementations
│   ├── stores/                  # Zustand stores
│   ├── types/                   # shared TS types
│   └── utils/                   # helpers
├── assets/
│   └── fonts/                   # Geist Sans, Source Serif 4
├── tests/                       # Jest + RNTL tests
├── app.json
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── jest.config.js
├── vercel.json
├── eas.json
└── README.md
```

---

### Task 1: Initialize Expo Project with Router, NativeWind, and Dependencies

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `babel.config.js`
- Create: `tailwind.config.js`
- Create: `metro.config.js`

**Interfaces:**
- Produces: runnable Expo project that compiles for web and mobile.

- [ ] **Step 1: Create project directory and run Expo init**

Run:
```bash
npx create-expo-app vivella-prospect --template blank-typescript
```

- [ ] **Step 2: Install required dependencies**

Run:
```bash
cd vivella-prospect
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-asset expo-font
npm install nativewind tailwindcss react-native-reanimated react-native-gesture-handler lucide-react-native @tanstack/react-query zustand @react-native-async-storage/async-storage react-native-web react-dom
npm install -D @types/react @types/jest jest jest-expo @testing-library/react-native ts-node typescript react-test-renderer
```

- [ ] **Step 3: Configure `package.json` scripts**

Create `package.json`:
```json
{
  "name": "vivella-prospect",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-linking": "~7.0.0",
    "expo-constants": "~17.0.0",
    "expo-asset": "~11.0.5",
    "expo-font": "~13.0.4",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.0",
    "react-native-web": "~0.19.13",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "4.0.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "nativewind": "^4.1.0",
    "tailwindcss": "^3.4.0",
    "lucide-react-native": "^0.460.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^5.0.0",
    "@react-native-async-storage/async-storage": "1.23.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.12",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "jest-expo": "~52.0.0",
    "@testing-library/react-native": "^12.8.0",
    "react-test-renderer": "18.3.1",
    "typescript": "~5.3.0"
  },
  "private": true
}
```

- [ ] **Step 4: Configure Expo Router entry in `app.json`**

Create `app.json`:
```json
{
  "expo": {
    "name": "VIVELLA PROSPECT",
    "slug": "vivella-prospect",
    "version": "1.0.0",
    "scheme": "vivellaprospect",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F5F0EB"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.vivella.prospect"
    },
    "android": {
      "package": "com.vivella.prospect",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F5F0EB"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

- [ ] **Step 5: Configure TypeScript**

Create `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

- [ ] **Step 6: Configure NativeWind**

Create `babel.config.js`:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [
      'react-native-reanimated/plugin',
      ['nativewind/dist/babel/css-interop', { moxy: true }],
    ],
  };
};
```

Create `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F5F0EB',
        'root-earth': '#5C3D2E',
        'neural-amber': '#D4A24A',
        'dawn-rose': '#E8B4B4',
        'flourish-green': '#7A8B6F',
        'deep-bark': '#3D2B1F',
        'warm-stone': '#C4B5A5',
        'soft-mist': '#E8E2DB',
      },
      fontFamily: {
        sans: ['GeistSans', 'system-ui', 'sans-serif'],
        serif: ['SourceSerif4', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
```

Create `metro.config.js`:
```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './src/design-system/global.css' });
```

- [ ] **Step 7: Create global CSS entry**

Create `src/design-system/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-parchment: #F5F0EB;
    --color-root-earth: #5C3D2E;
    --color-neural-amber: #D4A24A;
    --color-dawn-rose: #E8B4B4;
    --color-flourish-green: #7A8B6F;
    --color-deep-bark: #3D2B1F;
    --color-warm-stone: #C4B5A5;
    --color-soft-mist: #E8E2DB;
  }
}
```

- [ ] **Step 8: Verify the project starts on web**

Run:
```bash
npm install
npx expo start --web
```
Expected: Metro bundler starts and the web app opens without errors.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "chore: initialize Expo Router + NativeWind project"
```

---

### Task 2: Add VIVELLA Design Tokens and Shared Components

**Files:**
- Create: `src/design-system/colors.ts`
- Create: `src/components/Button.tsx`
- Create: `src/components/Card.tsx`
- Create: `src/components/Badge.tsx`
- Create: `src/components/KPIStat.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/Header.tsx`
- Test: `tests/components/Button.test.tsx`

**Interfaces:**
- Consumes: NativeWind classes.
- Produces: reusable UI primitives used by all screens.

- [ ] **Step 1: Define color tokens**

Create `src/design-system/colors.ts`:
```ts
export const colors = {
  parchment: '#F5F0EB',
  rootEarth: '#5C3D2E',
  neuralAmber: '#D4A24A',
  dawnRose: '#E8B4B4',
  flourishGreen: '#7A8B6F',
  deepBark: '#3D2B1F',
  warmStone: '#C4B5A5',
  softMist: '#E8E2DB',
} as const;

export type ColorName = keyof typeof colors;
```

- [ ] **Step 2: Implement Button component**

Create `src/components/Button.tsx`:
```tsx
import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
}: ButtonProps) {
  const base = 'rounded-lg items-center justify-center flex-row';
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-neural-amber',
    secondary: 'bg-soft-mist',
    ghost: 'bg-transparent',
  };
  const textColors: Record<ButtonVariant, string> = {
    primary: 'text-deep-bark',
    secondary: 'text-root-earth',
    ghost: 'text-root-earth',
  };
  const textSizes: Record<ButtonSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        (disabled || loading) && 'opacity-50',
        className
      )}
      accessibilityRole="button"
    >
      {loading && <ActivityIndicator size="small" className="mr-2" color="#3D2B1F" />}
      <Text className={cn('font-sans font-medium', textSizes[size], textColors[variant])}>
        {title}
      </Text>
    </Pressable>
  );
}
```

- [ ] **Step 3: Install clsx and tailwind-merge**

Run:
```bash
npm install clsx tailwind-merge
```

- [ ] **Step 4: Implement Card component**

Create `src/components/Card.tsx`:
```tsx
import React from 'react';
import { View } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View
      className={cn(
        'bg-soft-mist rounded-2xl p-4 shadow-sm border border-warm-stone/20',
        className
      )}
    >
      {children}
    </View>
  );
}
```

- [ ] **Step 5: Implement Badge component**

Create `src/components/Badge.tsx`:
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeVariant = 'critical' | 'high' | 'moderate' | 'low' | 'success' | 'warning' | 'info';

const backgroundStyles: Record<BadgeVariant, string> = {
  critical: 'bg-dawn-rose/30',
  high: 'bg-dawn-rose/20',
  moderate: 'bg-neural-amber/20',
  low: 'bg-soft-mist',
  success: 'bg-flourish-green/20',
  warning: 'bg-dawn-rose/30',
  info: 'bg-soft-mist',
};

export function Badge({ label, variant = 'info' }: { label: string; variant?: BadgeVariant }) {
  return (
    <View className={cn('px-2 py-1 rounded-full self-start', backgroundStyles[variant])}>
      <Text className="text-xs font-sans font-medium uppercase tracking-wider text-deep-bark">
        {label}
      </Text>
    </View>
  );
}
```

- [ ] **Step 6: Implement KPIStat and EmptyState**

Create `src/components/KPIStat.tsx`:
```tsx
import React from 'react';
import { View, Text } from 'react-native';

export function KPIStat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 min-w-[120px]">
      <Text className="text-2xl font-sans font-semibold text-root-earth">{value}</Text>
      <Text className="text-sm text-root-earth font-sans mt-1">{label}</Text>
    </View>
  );
}
```

Create `src/components/EmptyState.tsx`:
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

export function EmptyState({
  title,
  message,
  actionTitle,
  onAction,
}: {
  title: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Text className="text-xl font-sans font-medium text-root-earth text-center">{title}</Text>
      <Text className="text-base text-root-earth font-serif text-center mt-2 leading-relaxed">
        {message}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} variant="secondary" className="mt-6" />
      )}
    </View>
  );
}
```

- [ ] **Step 7: Implement Header**

Create `src/components/Header.tsx`:
```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import { colors } from '../design-system/colors';

export function Header({ alertCount = 0 }: { alertCount?: number }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-parchment border-b border-warm-stone/20">
      <Text className="text-xl font-sans font-semibold text-root-earth tracking-tight">
        VIVELLA
      </Text>
      <View className="flex-row items-center gap-4">
        <Pressable accessibilityRole="button" accessibilityLabel="Search">
          <Search size={24} color={colors.rootEarth} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Alerts">
          <View>
            <Bell size={24} color={colors.rootEarth} />
            {alertCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-dawn-rose rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                <Text className="text-xs font-sans font-bold text-root-earth">{alertCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 8: Write Button test**

Create `tests/components/Button.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('renders title and responds to press', () => {
    const onPress = jest.fn();
    render(<Button title="Tap me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tap me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 9: Configure Jest**

Create `jest.config.js`:
```js
const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((react-native.*)?|expo.*|@expo.*|@react-native.*|nativewind|react-native-css-interop))',
  ],
};

module.exports = config;
```

Create `tests/setup.ts`:
```ts
import '@testing-library/react-native/extend-expect';
```

- [ ] **Step 10: Run the test**

Run:
```bash
npm test
```
Expected: Button tests pass.

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: add VIVELLA design tokens and shared components"
```

---

### Task 3: Define Shared Types and Data Adapters

**Files:**
- Create: `src/types/index.ts`
- Create: `src/services/properties/types.ts`
- Create: `src/services/properties/mockProperties.ts`
- Create: `src/services/scanner/types.ts`
- Create: `src/services/scanner/mockScannerAdapter.ts`
- Create: `src/services/renderer/types.ts`
- Create: `src/services/renderer/mockRendererAdapter.ts`
- Create: `src/services/prospector/types.ts`
- Create: `src/services/prospector/mockProspectorAdapter.ts`
- Create: `src/services/properties/propertyAdapter.ts`
- Create: `src/services/geo/overpassAdapter.ts`
- Create: `src/services/geo/censusAdapter.ts`
- Test: `tests/services/scanner.test.ts`

**Interfaces:**
- Consumes: environment variables for live-geo toggles.
- Produces: typed entities (`Property`, `ScannerHit`, `RenderJob`, `Prospect`, `Alert`) and adapter functions consumed by hooks.

- [ ] **Step 1: Define shared types**

Create `src/types/index.ts`:
```ts
export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  location: GeoPoint;
  thumbnailUrl?: string;
  squareFeet?: number;
  yearBuilt?: number;
  lotSize?: number;
  owner?: string;
  lastSaleDate?: string;
  lastSalePrice?: number;
}

export type ConditionIssueType = 'roof' | 'paint' | 'windows' | 'structural' | 'landscaping';
export type ConditionSeverity = 'critical' | 'high' | 'moderate' | 'low';

export interface ConditionIssue {
  id: string;
  type: ConditionIssueType;
  severity: ConditionSeverity;
  description: string;
  confidence: number;
  evidenceImageUrl?: string;
}

export interface ScannerHit {
  id: string;
  propertyId: string;
  property: Property;
  detectedAt: string;
  issues: ConditionIssue[];
  overallScore: number;
}

export type RenderPreset = 'paint' | 'roof' | 'windows' | 'landscaping' | 'full-facade';
export type RenderStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface RenderJob {
  id: string;
  propertyId: string;
  property: Property;
  preset: RenderPreset;
  status: RenderStatus;
  beforeImageUrl: string;
  afterImageUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export type InvestmentStrategy = 'fix-and-flip' | 'buy-and-hold' | 'wholesale';

export interface Prospect {
  id: string;
  propertyId: string;
  property: Property;
  strategy: InvestmentStrategy;
  estimatedArv: number;
  estimatedRehabCost: number;
  estimatedEquity: number;
  cashOnCashReturn?: number;
  monthlyCashFlow?: number;
  score: number;
}

export type AlertType = 'scanner' | 'render' | 'prospect';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity?: ConditionSeverity;
  targetId: string;
  targetScreen: 'scanner' | 'render' | 'prospector';
  createdAt: string;
  read: boolean;
}
```

- [ ] **Step 2: Create mock property dataset**

Create `src/services/properties/mockProperties.ts`:
```ts
import type { Property } from '../../types';

export const mockProperties: Property[] = [
  {
    id: 'prop-001',
    address: '1847 Elm Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    location: { lat: 30.2672, lon: -97.7431 },
    squareFeet: 2100,
    yearBuilt: 1982,
    lotSize: 6500,
    owner: 'Henderson Family Trust',
    lastSaleDate: '2019-04-12',
    lastSalePrice: 420000,
  },
  {
    id: 'prop-002',
    address: '9202 Maple Avenue',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    location: { lat: 30.2645, lon: -97.728 },
    squareFeet: 1650,
    yearBuilt: 1965,
    lotSize: 5200,
    owner: 'Maria Castillo',
    lastSaleDate: '2015-11-03',
    lastSalePrice: 285000,
  },
  {
    id: 'prop-003',
    address: '4510 Oak Hill Boulevard',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    location: { lat: 30.2465, lon: -97.7838 },
    squareFeet: 3400,
    yearBuilt: 1995,
    lotSize: 9800,
    owner: 'Oak Hill Investments LLC',
    lastSaleDate: '2021-08-20',
    lastSalePrice: 890000,
  },
  {
    id: 'prop-004',
    address: '1100 Barton Springs Road',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    location: { lat: 30.259, lon: -97.769 },
    squareFeet: 1800,
    yearBuilt: 1978,
    lotSize: 6000,
    owner: 'David Chen',
    lastSaleDate: '2018-02-15',
    lastSalePrice: 510000,
  },
  {
    id: 'prop-005',
    address: '3300 Guadalupe Street',
    city: 'Austin',
    state: 'TX',
    zip: '78705',
    location: { lat: 30.292, lon: -97.7385 },
    squareFeet: 1200,
    yearBuilt: 1950,
    lotSize: 4000,
    owner: 'University Area Holdings',
    lastSaleDate: '2020-06-30',
    lastSalePrice: 395000,
  },
];

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find((p) => p.id === id);
}
```

- [ ] **Step 3: Implement mock scanner adapter**

Create `src/services/scanner/mockScannerAdapter.ts`:
```ts
import type { ScannerHit, ConditionIssue, ConditionSeverity, ConditionIssueType } from '../../types';
import { mockProperties } from '../properties/mockProperties';

const issueTypes: ConditionIssueType[] = ['roof', 'paint', 'windows', 'structural', 'landscaping'];
const severities: ConditionSeverity[] = ['critical', 'high', 'moderate', 'low'];

function deterministicIssues(propertyId: string): ConditionIssue[] {
  const issues: ConditionIssue[] = [];
  let seed = propertyId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const count = (seed % 3) + 1;
  for (let i = 0; i < count; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const type = issueTypes[seed % issueTypes.length];
    seed = (seed * 9301 + 49297) % 233280;
    const severity = severities[seed % severities.length];
    const descriptions: Record<ConditionIssueType, string> = {
      roof: 'Visible granule loss and edge curling detected.',
      paint: 'Fading and peeling paint on south-facing facade.',
      windows: 'Older single-pane windows with visible frame rot.',
      structural: 'Minor foundation cracking visible at driveway.',
      landscaping: 'Overgrown vegetation contacting structure.',
    };
    seed = (seed * 9301 + 49297) % 233280;
    const confidence = 55 + (seed % 40);
    issues.push({
      id: `${propertyId}-issue-${i}`,
      type,
      severity,
      description: descriptions[type],
      confidence: confidence / 100,
    });
  }
  return issues;
}

function severityScore(severity: ConditionSeverity): number {
  switch (severity) {
    case 'critical':
      return 100;
    case 'high':
      return 75;
    case 'moderate':
      return 50;
    case 'low':
      return 25;
  }
}

export async function getScannerHits(filters?: {
  issueTypes?: string[];
  minConfidence?: number;
}): Promise<ScannerHit[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  let hits = mockProperties.map((property) => {
    const issues = deterministicIssues(property.id);
    const overallScore = Math.round(
      issues.reduce((sum, issue) => sum + severityScore(issue.severity) * issue.confidence, 0) /
        Math.max(issues.length, 1)
    );
    return {
      id: `scan-${property.id}`,
      propertyId: property.id,
      property,
      detectedAt: new Date().toISOString(),
      issues,
      overallScore,
    };
  });

  if (filters?.issueTypes?.length) {
    hits = hits.filter((hit) =>
      hit.issues.some((issue) => filters.issueTypes?.includes(issue.type))
    );
  }
  if (filters?.minConfidence !== undefined) {
    hits = hits.filter((hit) =>
      hit.issues.some((issue) => issue.confidence >= filters.minConfidence!)
    );
  }
  return hits.sort((a, b) => b.overallScore - a.overallScore);
}

export async function getScannerHit(id: string): Promise<ScannerHit | undefined> {
  const hits = await getScannerHits();
  return hits.find((h) => h.id === id || h.propertyId === id);
}
```

- [ ] **Step 4: Implement mock renderer adapter**

Create `src/services/renderer/mockRendererAdapter.ts`:
```ts
import type { RenderJob, RenderPreset } from '../../types';
import { getPropertyById } from '../properties/mockProperties';

const presetLabels: Record<RenderPreset, string> = {
  paint: 'Fresh exterior paint',
  roof: 'New architectural shingle roof',
  windows: 'Modern vinyl window replacement',
  landscaping: 'Cleaned landscaping and walkway',
  'full-facade': 'Complete facade renovation',
};

const jobs: RenderJob[] = [];

export async function createRenderJob(
  propertyId: string,
  preset: RenderPreset
): Promise<RenderJob> {
  const property = getPropertyById(propertyId);
  if (!property) throw new Error(`Property ${propertyId} not found`);

  const job: RenderJob = {
    id: `render-${Date.now()}`,
    propertyId,
    property,
    preset,
    status: 'queued',
    beforeImageUrl: `https://placehold.co/600x400/5C3D2E/F5F0EB?text=Before:+${encodeURIComponent(
      property.address
    )}`,
    createdAt: new Date().toISOString(),
  };
  jobs.unshift(job);

  setTimeout(() => {
    job.status = 'processing';
    setTimeout(() => {
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.afterImageUrl = `https://placehold.co/600x400/D4A24A/5C3D2E?text=After:+${encodeURIComponent(
        presetLabels[preset]
      )}`;
    }, 3000);
  }, 500);

  return job;
}

export async function getRenderJobs(): Promise<RenderJob[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...jobs];
}

export async function getRenderJob(id: string): Promise<RenderJob | undefined> {
  return jobs.find((j) => j.id === id);
}
```

- [ ] **Step 5: Implement mock prospector adapter**

Create `src/services/prospector/mockProspectorAdapter.ts`:
```ts
import type { Prospect, InvestmentStrategy } from '../../types';
import { mockProperties } from '../properties/mockProperties';

function strategyScore(propertyId: string, strategy: InvestmentStrategy): number {
  let seed = propertyId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  seed = (seed * 9301 + 49297) % 233280;
  const base = seed % 100;
  if (strategy === 'fix-and-flip') return base + 12;
  if (strategy === 'buy-and-hold') return base + 5;
  return base;
}

export async function getProspects(filters?: {
  strategy?: InvestmentStrategy;
  minEquity?: number;
  maxPrice?: number;
}): Promise<Prospect[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  let prospects = mockProperties.map((property) => {
    const strategy: InvestmentStrategy = filters?.strategy ?? 'fix-and-flip';
    const estimatedArv = Math.round((property.lastSalePrice ?? 400000) * 1.35);
    const estimatedRehabCost = Math.round((estimatedArv - (property.lastSalePrice ?? 0)) * 0.55);
    const estimatedEquity = estimatedArv - (property.lastSalePrice ?? 0) - estimatedRehabCost;
    const cashOnCashReturn = Math.round((estimatedEquity / Math.max(estimatedRehabCost, 1)) * 100);
    const monthlyCashFlow = Math.round(estimatedArv * 0.0075);
    return {
      id: `prospect-${property.id}`,
      propertyId: property.id,
      property,
      strategy,
      estimatedArv,
      estimatedRehabCost,
      estimatedEquity,
      cashOnCashReturn,
      monthlyCashFlow,
      score: strategyScore(property.id, strategy),
    };
  });

  if (filters?.minEquity !== undefined) {
    prospects = prospects.filter((p) => p.estimatedEquity >= filters.minEquity!);
  }
  if (filters?.maxPrice !== undefined) {
    prospects = prospects.filter((p) => (p.property.lastSalePrice ?? Infinity) <= filters.maxPrice!);
  }
  return prospects.sort((a, b) => b.score - a.score);
}

export async function getProspect(id: string): Promise<Prospect | undefined> {
  const prospects = await getProspects();
  return prospects.find((p) => p.id === id || p.propertyId === id);
}
```

- [ ] **Step 6: Implement live geo adapters**

Create `src/services/geo/overpassAdapter.ts`:
```ts
import type { GeoPoint, Property } from '../../types';

export interface OverpassBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export async function fetchOverpassBuildings(
  bounds: OverpassBounds,
  signal?: AbortSignal
): Promise<Property[]> {
  const query = `[out:json][timeout:15];
    (
      way["building"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      relation["building"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
    );
    out center tags 50;`;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    signal,
  });
  if (!response.ok) throw new Error('Overpass request failed');
  const data = await response.json();

  return data.elements
    .filter((el: any) => el.center || (el.lat && el.lon))
    .map((el: any, idx: number) => {
      const center = el.center ?? { lat: el.lat, lon: el.lon };
      return {
        id: `overpass-${el.id ?? idx}`,
        address: el.tags?.['addr:street'] ?? 'Unknown address',
        city: el.tags?.['addr:city'] ?? '',
        state: el.tags?.['addr:state'] ?? '',
        zip: el.tags?.['addr:postcode'] ?? '',
        location: { lat: center.lat, lon: center.lon },
        squareFeet: undefined,
        yearBuilt: el.tags?.start_date ? parseInt(el.tags.start_date, 10) : undefined,
        lotSize: undefined,
      };
    });
}
```

Create `src/services/geo/censusAdapter.ts`:
```ts
export async function fetchCensusTractData(lat: number, lon: number): Promise<{
  medianIncome?: number;
  population?: number;
}> {
  const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lon}&y=${lat}&benchmark=4&vintage=4&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Census geocoder failed');
  const data = await response.json();
  return {
    medianIncome: undefined,
    population: undefined,
  };
}
```

- [ ] **Step 7: Write scanner adapter test**

Create `tests/services/scanner.test.ts`:
```ts
import { getScannerHits } from '../../src/services/scanner/mockScannerAdapter';

describe('mockScannerAdapter', () => {
  it('returns hits sorted by overall score', async () => {
    const hits = await getScannerHits();
    expect(hits.length).toBeGreaterThan(0);
    for (let i = 0; i < hits.length - 1; i++) {
      expect(hits[i].overallScore).toBeGreaterThanOrEqual(hits[i + 1].overallScore);
    }
  });

  it('filters by issue type', async () => {
    const hits = await getScannerHits({ issueTypes: ['roof'] });
    expect(hits.every((h) => h.issues.some((i) => i.type === 'roof'))).toBe(true);
  });
});
```

- [ ] **Step 8: Run tests**

Run:
```bash
npm test
```
Expected: scanner tests pass alongside Button tests.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add shared types and mock data adapters"
```

---

### Task 4: Add Zustand Stores and TanStack Query Hooks

**Files:**
- Create: `src/stores/portfolioStore.ts`
- Create: `src/stores/alertStore.ts`
- Create: `src/stores/settingsStore.ts`
- Create: `src/hooks/useScannerHits.ts`
- Create: `src/hooks/useScannerHit.ts`
- Create: `src/hooks/useRenderJobs.ts`
- Create: `src/hooks/useRenderJob.ts`
- Create: `src/hooks/useProspects.ts`
- Create: `src/hooks/useProspect.ts`
- Create: `src/hooks/usePortfolio.ts`
- Create: `src/hooks/useAlerts.ts`
- Create: `src/hooks/useDemoMode.ts`
- Create: `src/hooks/useMapProperties.ts`
- Create: `app/_layout.tsx`
- Test: `tests/hooks/usePortfolio.test.ts`

**Interfaces:**
- Consumes: adapters and stores.
- Produces: query hooks and global state used by screens.

- [ ] **Step 1: Implement settings store**

Create `src/stores/settingsStore.ts`:
```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  useLiveGeo: boolean;
  mapStyle: 'light' | 'satellite';
  setUseLiveGeo: (value: boolean) => void;
  setMapStyle: (value: 'light' | 'satellite') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      useLiveGeo: process.env.EXPO_PUBLIC_USE_LIVE_GEO === 'true',
      mapStyle: 'light',
      setUseLiveGeo: (value) => set({ useLiveGeo: value }),
      setMapStyle: (value) => set({ mapStyle: value }),
    }),
    {
      name: 'vivella-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

- [ ] **Step 2: Implement portfolio store**

Create `src/stores/portfolioStore.ts`:
```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PortfolioItemType = 'watchlist' | 'owned';

export interface PortfolioItem {
  propertyId: string;
  type: PortfolioItemType;
  addedAt: string;
  notes?: string;
}

interface PortfolioState {
  items: PortfolioItem[];
  addItem: (propertyId: string, type: PortfolioItemType) => void;
  removeItem: (propertyId: string) => void;
  updateNotes: (propertyId: string, notes: string) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (propertyId, type) => {
        const items = get().items.filter((i) => i.propertyId !== propertyId);
        items.push({ propertyId, type, addedAt: new Date().toISOString() });
        set({ items });
      },
      removeItem: (propertyId) => {
        set({ items: get().items.filter((i) => i.propertyId !== propertyId) });
      },
      updateNotes: (propertyId, notes) => {
        set({
          items: get().items.map((i) => (i.propertyId === propertyId ? { ...i, notes } : i)),
        });
      },
    }),
    {
      name: 'vivella-portfolio',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

- [ ] **Step 3: Implement alert store**

Create `src/stores/alertStore.ts`:
```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Alert, AlertType } from '../types';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      addAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set({ alerts: [newAlert, ...get().alerts] });
      },
      markRead: (id) => {
        set({ alerts: get().alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) });
      },
      clearAll: () => set({ alerts: [] }),
    }),
    {
      name: 'vivella-alerts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

- [ ] **Step 4: Implement query hooks**

Create `src/hooks/useScannerHits.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { getScannerHits } from '../services/scanner/mockScannerAdapter';

export function useScannerHits(filters?: { issueTypes?: string[]; minConfidence?: number }) {
  return useQuery({
    queryKey: ['scanner-hits', filters],
    queryFn: () => getScannerHits(filters),
  });
}
```

Create `src/hooks/useScannerHit.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { getScannerHit } from '../services/scanner/mockScannerAdapter';

export function useScannerHit(id: string) {
  return useQuery({
    queryKey: ['scanner-hit', id],
    queryFn: () => getScannerHit(id),
    enabled: !!id,
  });
}
```

Create `src/hooks/useRenderJobs.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { getRenderJobs } from '../services/renderer/mockRendererAdapter';

export function useRenderJobs() {
  return useQuery({
    queryKey: ['render-jobs'],
    queryFn: getRenderJobs,
  });
}
```

Create `src/hooks/useRenderJob.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { getRenderJob } from '../services/renderer/mockRendererAdapter';

export function useRenderJob(id: string) {
  return useQuery({
    queryKey: ['render-job', id],
    queryFn: () => getRenderJob(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'processing' ? 1000 : false;
    },
  });
}
```

Create `src/hooks/useProspects.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { getProspects } from '../services/prospector/mockProspectorAdapter';
import type { InvestmentStrategy } from '../types';

export function useProspects(filters?: {
  strategy?: InvestmentStrategy;
  minEquity?: number;
  maxPrice?: number;
}) {
  return useQuery({
    queryKey: ['prospects', filters],
    queryFn: () => getProspects(filters),
  });
}
```

Create `src/hooks/useProspect.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { getProspect } from '../services/prospector/mockProspectorAdapter';

export function useProspect(id: string) {
  return useQuery({
    queryKey: ['prospect', id],
    queryFn: () => getProspect(id),
    enabled: !!id,
  });
}
```

Create `src/hooks/usePortfolio.ts`:
```ts
import { usePortfolioStore } from '../stores/portfolioStore';
import { mockProperties } from '../services/properties/mockProperties';

export function usePortfolio() {
  const { items, addItem, removeItem, updateNotes } = usePortfolioStore();
  const enrichedItems = items
    .map((item) => {
      const property = mockProperties.find((p) => p.id === item.propertyId);
      return property ? { ...item, property } : null;
    })
    .filter(Boolean);
  return { items: enrichedItems, addItem, removeItem, updateNotes };
}
```

Create `src/hooks/useAlerts.ts`:
```ts
import { useAlertStore } from '../stores/alertStore';

export function useAlerts() {
  return useAlertStore();
}
```

Create `src/hooks/useDemoMode.ts`:
```ts
import { useSettingsStore } from '../stores/settingsStore';

export function useDemoMode() {
  return useSettingsStore((s) => ({
    useLiveGeo: s.useLiveGeo,
    mapStyle: s.mapStyle,
    setUseLiveGeo: s.setUseLiveGeo,
    setMapStyle: s.setMapStyle,
  }));
}
```

- [ ] **Step 5: Implement root layout with providers**

Create `app/_layout.tsx`:
```tsx
import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/design-system/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 6: Write portfolio hook test**

Create `tests/hooks/usePortfolio.test.ts`:
```ts
import { renderHook, act } from '@testing-library/react-native';
import { usePortfolio } from '../../src/hooks/usePortfolio';

describe('usePortfolio', () => {
  it('adds and removes a portfolio item', () => {
    const { result } = renderHook(() => usePortfolio());

    act(() => {
      result.current.addItem('prop-001', 'watchlist');
    });
    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem('prop-001');
    });
    expect(result.current.items).toHaveLength(0);
  });
});
```

- [ ] **Step 7: Run tests**

Run:
```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add Zustand stores and TanStack Query hooks"
```

---

### Task 5: Build Navigation and Tab Layout

**Files:**
- Create: `app/(tabs)/_layout.tsx`
- Create: `src/components/TabIcon.tsx`
- Modify: `app/_layout.tsx` (add StatusBar)

**Interfaces:**
- Consumes: Header component, Lucide icons.
- Produces: bottom-tab navigation on mobile, top-tab on web.

- [ ] **Step 1: Create TabIcon component**

Create `src/components/TabIcon.tsx`:
```tsx
import React from 'react';
import { View } from 'react-native';
import { colors } from '../design-system/colors';

export function TabIcon({
  Icon,
  focused,
}: {
  Icon: React.ComponentType<{ size: number; color: string }>;
  focused: boolean;
}) {
  return (
    <View
      className={`items-center justify-center p-2 rounded-full ${
        focused ? 'bg-neural-amber/20' : ''
      }`}
    >
      <Icon size={24} color={focused ? colors.rootEarth : colors.warmStone} />
    </View>
  );
}
```

- [ ] **Step 2: Create tab layout**

Create `app/(tabs)/_layout.tsx`:
```tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { LayoutDashboard, ScanLine, Paintbrush, TrendingUp, Bell } from 'lucide-react-native';
import { Header } from '../../src/components/Header';
import { TabIcon } from '../../src/components/TabIcon';
import { colors } from '../../src/design-system/colors';

export default function TabLayout() {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.rootEarth,
          tabBarInactiveTintColor: colors.warmStone,
          tabBarStyle: {
            backgroundColor: colors.parchment,
            borderTopColor: colors.warmStone + '33',
            height: Platform.OS === 'web' ? 64 : 80,
            paddingBottom: Platform.OS === 'web' ? 8 : 24,
          },
          tabBarLabelStyle: {
            fontFamily: 'GeistSans',
            fontSize: 11,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon Icon={LayoutDashboard} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scanner',
            tabBarIcon: ({ focused }) => <TabIcon Icon={ScanLine} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="render"
          options={{
            title: 'Render',
            tabBarIcon: ({ focused }) => <TabIcon Icon={Paintbrush} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="prospector"
          options={{
            title: 'Deals',
            tabBarIcon: ({ focused }) => <TabIcon Icon={TrendingUp} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alerts',
            tabBarIcon: ({ focused }) => <TabIcon Icon={Bell} focused={focused} />,
          }}
        />
      </Tabs>
    </>
  );
}
```

- [ ] **Step 3: Update root layout with status bar**

Modify `app/_layout.tsx`:
```tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/design-system/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" backgroundColor="#F5F0EB" />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 4: Verify navigation renders**

Run:
```bash
npx expo start --web
```
Expected: bottom tabs appear with five icons and labels.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add tab navigation layout"
```

---

### Task 6: Build Dashboard Screen

**Files:**
- Create: `app/(tabs)/index.tsx`
- Create: `src/components/QuickActionCard.tsx`

**Interfaces:**
- Consumes: `useScannerHits`, `useRenderJobs`, `useProspects`, `useAlerts`, `usePortfolio`.
- Produces: dashboard screen with KPIs and quick navigation.

- [ ] **Step 1: Create QuickActionCard**

Create `src/components/QuickActionCard.tsx`:
```tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../design-system/colors';

export function QuickActionCard({
  title,
  subtitle,
  count,
  onPress,
}: {
  title: string;
  subtitle: string;
  count?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl p-4 mb-3 flex-row items-center justify-between active:bg-warm-stone/30"
      accessibilityRole="button"
    >
      <View className="flex-1">
        <Text className="text-lg font-sans font-medium text-root-earth">{title}</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">{subtitle}</Text>
      </View>
      {count !== undefined && (
        <View className="bg-neural-amber/20 rounded-full px-3 py-1 mr-3">
          <Text className="text-sm font-sans font-semibold text-root-earth">{count}</Text>
        </View>
      )}
      <ChevronRight size={20} color={colors.warmStone} />
    </Pressable>
  );
}
```

- [ ] **Step 2: Create dashboard screen**

Create `app/(tabs)/index.tsx`:
```tsx
import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScannerHits } from '../../src/hooks/useScannerHits';
import { useRenderJobs } from '../../src/hooks/useRenderJobs';
import { useProspects } from '../../src/hooks/useProspects';
import { usePortfolio } from '../../src/hooks/usePortfolio';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Card } from '../../src/components/Card';
import { KPIStat } from '../../src/components/KPIStat';
import { QuickActionCard } from '../../src/components/QuickActionCard';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/design-system/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const scanner = useScannerHits();
  const renders = useRenderJobs();
  const prospects = useProspects();
  const portfolio = usePortfolio();
  const alerts = useAlerts();

  const completedRenders = (renders.data ?? []).filter((j) => j.status === 'completed').length;
  const unreadAlerts = alerts.alerts.filter((a) => !a.read).length;

  const isLoading = scanner.isLoading || renders.isLoading || prospects.isLoading;

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-8">
        <Text className="text-3xl font-sans font-medium text-root-earth tracking-tight">
          Property Intelligence
        </Text>
        <Text className="text-base text-warm-stone font-sans mt-1">
          Your command center for distressed assets and renovation opportunities.
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.neuralAmber} className="mt-8" />
        ) : (
          <>
            <Card className="mt-6 flex-row flex-wrap gap-4">
              <KPIStat value={`${scanner.data?.length ?? 0}`} label="Scanner hits" />
              <KPIStat value={`${completedRenders}`} label="Rendered" />
              <KPIStat value={`${prospects.data?.length ?? 0}`} label="Prospects" />
              <KPIStat value={`${portfolio.items.length}`} label="Tracked" />
            </Card>

            <Text className="text-xl font-sans font-medium text-root-earth mt-8 mb-3">
              Quick actions
            </Text>
            <QuickActionCard
              title="Sentinel Scanner"
              subtitle="Review flagged property conditions"
              count={scanner.data?.length}
              onPress={() => router.push('/scanner')}
            />
            <QuickActionCard
              title="Alter Rendering"
              subtitle="Generate renovation visualizations"
              count={renders.data?.length}
              onPress={() => router.push('/render')}
            />
            <QuickActionCard
              title="Real Estate Prospector"
              subtitle="Find off-market investment opportunities"
              count={prospects.data?.length}
              onPress={() => router.push('/prospector')}
            />
            <QuickActionCard
              title="Alerts"
              subtitle={`${unreadAlerts} unread`}
              onPress={() => router.push('/alerts')}
            />

            <Button
              title="Open Settings"
              onPress={() => router.push('/settings')}
              variant="ghost"
              className="mt-4"
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Verify dashboard renders**

Run:
```bash
npx expo start --web
```
Expected: dashboard shows KPIs and quick action cards.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add dashboard screen"
```

---

### Task 7: Build Sentinel Scanner Screens

**Files:**
- Create: `src/components/ScannerHitItem.tsx`
- Create: `src/components/FilterChip.tsx`
- Create: `src/components/MapView.tsx`
- Create: `app/(tabs)/scanner.tsx`
- Create: `app/scanner/[id].tsx`

**Interfaces:**
- Consumes: `useScannerHits`, `useScannerHit`, `useAlertStore`, `useDemoMode`.
- Produces: scanner list/map and detail screens.

- [ ] **Step 1: Create FilterChip component**

Create `src/components/FilterChip.tsx`:
```tsx
import React from 'react';
import { Pressable, Text } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'px-4 py-2 rounded-full border mr-2 mb-2',
        active
          ? 'bg-neural-amber border-neural-amber'
          : 'bg-parchment border-warm-stone/40'
      )}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        className={cn(
          'text-sm font-sans font-medium',
          active ? 'text-root-earth' : 'text-warm-stone'
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
```

- [ ] **Step 2: Create ScannerHitItem component**

Create `src/components/ScannerHitItem.tsx`:
```tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../design-system/colors';
import { Badge } from './Badge';
import type { ScannerHit } from '../types';

export function ScannerHitItem({ hit, onPress }: { hit: ScannerHit; onPress: () => void }) {
  const topIssue = hit.issues[0];
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl p-4 mb-3 flex-row items-center active:bg-warm-stone/20"
      accessibilityRole="button"
    >
      <View className="flex-1">
        <Text className="text-base font-sans font-medium text-root-earth">
          {hit.property.address}
        </Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          {hit.property.city}, {hit.property.state} · Score {hit.overallScore}
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {topIssue && <Badge label={topIssue.type} variant={topIssue.severity} />}
          {hit.issues.slice(1, 3).map((issue) => (
            <View key={issue.id} className="ml-2">
              <Badge label={issue.type} variant={issue.severity} />
            </View>
          ))}
        </View>
      </View>
      <ChevronRight size={20} color={colors.warmStone} />
    </Pressable>
  );
}
```

- [ ] **Step 3: Create cross-platform MapView wrapper**

Create `src/components/MapView.tsx`:
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Platform } from 'react-native';
import type { GeoPoint } from '../types';

export interface MapMarkerData {
  id: string;
  coordinate: GeoPoint;
  color?: string;
  title?: string;
}

export interface MapViewProps {
  center: GeoPoint;
  zoom?: number;
  markers?: MapMarkerData[];
  onMarkerPress?: (id: string) => void;
}

export function MapView({ center, markers, onMarkerPress }: MapViewProps) {
  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 bg-soft-mist items-center justify-center p-6">
        <Text className="text-root-earth font-sans text-center">
          Map placeholder: center {center.lat.toFixed(4)}, {center.lon.toFixed(4)}
        </Text>
        <Text className="text-warm-stone font-sans text-center mt-2">
          {markers?.length ?? 0} markers
        </Text>
        {markers?.map((m) => (
          <Text
            key={m.id}
            className="text-neural-amber font-sans text-sm mt-1"
            onPress={() => onMarkerPress?.(m.id)}
          >
            {m.title ?? m.id}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-soft-mist items-center justify-center p-6">
      <Text className="text-root-earth font-sans text-center">MapLibre map placeholder</Text>
      <Text className="text-warm-stone font-sans text-center mt-2">
        {markers?.length ?? 0} markers
      </Text>
    </View>
  );
}
```

- [ ] **Step 4: Create scanner list/map screen**

Create `app/(tabs)/scanner.tsx`:
```tsx
import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScannerHits } from '../../src/hooks/useScannerHits';
import { ScannerHitItem } from '../../src/components/ScannerHitItem';
import { FilterChip } from '../../src/components/FilterChip';
import { MapView } from '../../src/components/MapView';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

const issueTypes = [
  { key: 'roof', label: 'Roof' },
  { key: 'paint', label: 'Paint' },
  { key: 'windows', label: 'Windows' },
  { key: 'structural', label: 'Structural' },
  { key: 'landscaping', label: 'Landscaping' },
];

export default function ScannerScreen() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { data, isLoading, error, refetch } = useScannerHits({
    issueTypes: selectedTypes.length ? selectedTypes : undefined,
  });

  const toggleType = (key: string) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const markers = data?.map((hit) => ({
    id: hit.id,
    coordinate: hit.property.location,
    title: hit.property.address,
    color: hit.overallScore >= 75 ? '#E8B4B4' : '#D4A24A',
  }));

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Sentinel Scanner</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          Properties flagged by visual condition signals.
        </Text>
      </View>

      <View className="flex-row px-4 mt-4">
        <Button
          title="List"
          onPress={() => setViewMode('list')}
          variant={viewMode === 'list' ? 'primary' : 'secondary'}
          size="sm"
          className="mr-2"
        />
        <Button
          title="Map"
          onPress={() => setViewMode('map')}
          variant={viewMode === 'map' ? 'primary' : 'secondary'}
          size="sm"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        contentContainerClassName="pb-2"
      >
        {issueTypes.map((type) => (
          <FilterChip
            key={type.key}
            label={type.label}
            active={selectedTypes.includes(type.key)}
            onPress={() => toggleType(type.key)}
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.neuralAmber} className="mt-12" />
      ) : error ? (
        <EmptyState
          title="Could not load scanner"
          message={error.message}
          actionTitle="Retry"
          onAction={() => refetch()}
        />
      ) : viewMode === 'map' ? (
        <MapView
          center={{ lat: 30.2672, lon: -97.7431 }}
          markers={markers}
          onMarkerPress={(id) => router.push(`/scanner/${id}`)}
        />
      ) : data?.length === 0 ? (
        <EmptyState
          title="No matches"
          message="Try removing filters to see more properties."
          actionTitle="Clear filters"
          onAction={() => setSelectedTypes([])}
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-2" contentContainerClassName="pb-8">
          {data?.map((hit) => (
            <ScannerHitItem
              key={hit.id}
              hit={hit}
              onPress={() => router.push(`/scanner/${hit.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
```

- [ ] **Step 5: Create scanner detail screen**

Create `app/scanner/[id].tsx`:
```tsx
import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScannerHit } from '../../src/hooks/useScannerHit';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

export default function ScannerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: hit, isLoading, error } = useScannerHit(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-parchment items-center justify-center">
        <ActivityIndicator size="large" color={colors.neuralAmber} />
      </SafeAreaView>
    );
  }

  if (error || !hit) {
    return (
      <SafeAreaView className="flex-1 bg-parchment">
        <EmptyState
          title="Property not found"
          message="We couldn't load this scanner hit."
          actionTitle="Go back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-8">
        <Text className="text-3xl font-sans font-medium text-root-earth">
          {hit.property.address}
        </Text>
        <Text className="text-base text-warm-stone font-sans mt-1">
          {hit.property.city}, {hit.property.state} {hit.property.zip}
        </Text>

        <Card className="mt-6">
          <Text className="text-sm uppercase tracking-wider text-warm-stone font-sans">
            Condition score
          </Text>
          <Text className="text-4xl font-sans font-semibold text-root-earth mt-1">
            {hit.overallScore}
          </Text>
        </Card>

        <Text className="text-xl font-sans font-medium text-root-earth mt-6 mb-3">
          Detected issues
        </Text>
        {hit.issues.map((issue) => (
          <Card key={issue.id} className="mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-sans font-medium text-root-earth capitalize">
                {issue.type}
              </Text>
              <Badge label={issue.severity} variant={issue.severity} />
            </View>
            <Text className="text-sm text-warm-stone font-sans mt-2">{issue.description}</Text>
            <Text className="text-xs text-warm-stone font-sans mt-2">
              Confidence {(issue.confidence * 100).toFixed(0)}%
            </Text>
          </Card>
        ))}

        <Button
          title="Generate renovation render"
          onPress={() => router.push(`/render?propertyId=${hit.propertyId}`)}
          className="mt-4"
        />
        <Button
          title="View as investment prospect"
          onPress={() => router.push(`/prospector/${hit.propertyId}`)}
          variant="secondary"
          className="mt-3"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 6: Verify scanner screens**

Run:
```bash
npx expo start --web
```
Expected: Scanner tab shows list of properties; tapping opens detail; filters work.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add Sentinel Scanner list, map, and detail screens"
```

---

### Task 8: Build Alter Rendering Screens

**Files:**
- Create: `src/components/BeforeAfter.tsx`
- Create: `src/components/RenderCard.tsx`
- Create: `app/(tabs)/render.tsx`
- Create: `app/render/[id].tsx`
- Modify: `src/services/renderer/mockRendererAdapter.ts` (add `presetLabels` export)

**Interfaces:**
- Consumes: `useRenderJobs`, `useRenderJob`, `createRenderJob`, `useAlertStore`.
- Produces: render gallery and detail screens.

- [ ] **Step 1: Create BeforeAfter comparison component**

Create `src/components/BeforeAfter.tsx`:
```tsx
import React, { useState } from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { Button } from './Button';

export function BeforeAfter({
  beforeUrl,
  afterUrl,
}: {
  beforeUrl: string;
  afterUrl?: string;
}) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <View className="rounded-2xl overflow-hidden bg-soft-mist">
      <Image
        source={{ uri: showAfter && afterUrl ? afterUrl : beforeUrl }}
        className="w-full h-64"
        resizeMode="cover"
        accessibilityLabel={showAfter ? 'After renovation' : 'Before renovation'}
      />
      <View className="flex-row p-2 gap-2">
        <Button
          title="Before"
          onPress={() => setShowAfter(false)}
          variant={!showAfter ? 'primary' : 'secondary'}
          size="sm"
          className="flex-1"
        />
        <Button
          title="After"
          onPress={() => setShowAfter(true)}
          variant={showAfter ? 'primary' : 'secondary'}
          size="sm"
          className="flex-1"
          disabled={!afterUrl}
        />
      </View>
      {afterUrl && (
        <Text className="text-center text-xs text-warm-stone font-sans pb-3">
          Tap labels to compare
        </Text>
      )}
    </View>
  );
}
```

- [ ] **Step 2: Create RenderCard component**

Create `src/components/RenderCard.tsx`:
```tsx
import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import { Badge } from './Badge';
import type { RenderJob } from '../types';

export function RenderCard({ job, onPress }: { job: RenderJob; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl overflow-hidden mb-4 active:opacity-80"
      accessibilityRole="button"
    >
      <Image
        source={{ uri: job.beforeImageUrl }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-base font-sans font-medium text-root-earth">
          {job.property.address}
        </Text>
        <Text className="text-sm text-warm-stone font-sans mt-1 capitalize">
          {job.preset.replace('-', ' ')}
        </Text>
        <View className="mt-2">
          <Badge
            label={job.status}
            variant={
              job.status === 'completed'
                ? 'success'
                : job.status === 'failed'
                ? 'critical'
                : 'info'
            }
          />
        </View>
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 3: Create render gallery screen**

Create `app/(tabs)/render.tsx`:
```tsx
import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRenderJobs } from '../../src/hooks/useRenderJobs';
import { createRenderJob } from '../../src/services/renderer/mockRendererAdapter';
import { RenderCard } from '../../src/components/RenderCard';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChip } from '../../src/components/FilterChip';
import { useAlertStore } from '../../src/stores/alertStore';
import { colors } from '../../src/design-system/colors';
import type { RenderPreset } from '../../src/types';

const presets: { key: RenderPreset; label: string }[] = [
  { key: 'paint', label: 'Paint' },
  { key: 'roof', label: 'Roof' },
  { key: 'windows', label: 'Windows' },
  { key: 'landscaping', label: 'Landscaping' },
  { key: 'full-facade', label: 'Full Facade' },
];

export default function RenderScreen() {
  const router = useRouter();
  const { data: jobs, isLoading, refetch } = useRenderJobs();
  const addAlert = useAlertStore((s) => s.addAlert);
  const [creating, setCreating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<RenderPreset>('paint');

  const handleCreate = async () => {
    setCreating(true);
    try {
      const job = await createRenderJob('prop-001', selectedPreset);
      addAlert({
        type: 'render',
        title: 'Render queued',
        message: `${job.property.address} — ${selectedPreset}`,
        targetId: job.id,
        targetScreen: 'render',
      });
      refetch();
      router.push(`/render/${job.id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Alter Rendering</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          Generate photorealistic before/after renovation visuals.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        contentContainerClassName="pb-2"
      >
        {presets.map((preset) => (
          <FilterChip
            key={preset.key}
            label={preset.label}
            active={selectedPreset === preset.key}
            onPress={() => setSelectedPreset(preset.key)}
          />
        ))}
      </ScrollView>

      <View className="px-4 mt-2">
        <Button
          title={creating ? 'Queueing...' : 'Create demo render'}
          onPress={handleCreate}
          loading={creating}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.neuralAmber} className="mt-12" />
      ) : jobs?.length === 0 ? (
        <EmptyState
          title="No renders yet"
          message="Create your first renovation visualization to see it here."
          actionTitle="Create render"
          onPress={handleCreate}
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
          {jobs?.map((job) => (
            <RenderCard
              key={job.id}
              job={job}
              onPress={() => router.push(`/render/${job.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
```

- [ ] **Step 4: Create render detail screen**

Create `app/render/[id].tsx`:
```tsx
import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRenderJob } from '../../src/hooks/useRenderJob';
import { BeforeAfter } from '../../src/components/BeforeAfter';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

export default function RenderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: job, isLoading, error } = useRenderJob(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-parchment items-center justify-center">
        <ActivityIndicator size="large" color={colors.neuralAmber} />
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView className="flex-1 bg-parchment">
        <EmptyState
          title="Render not found"
          message="We couldn't load this render job."
          actionTitle="Go back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-8">
        <Text className="text-3xl font-sans font-medium text-root-earth">
          {job.property.address}
        </Text>
        <Text className="text-base text-warm-stone font-sans mt-1 capitalize">
          {job.preset.replace('-', ' ')}
        </Text>
        <View className="mt-2 self-start">
          <Badge
            label={job.status}
            variant={
              job.status === 'completed'
                ? 'success'
                : job.status === 'failed'
                ? 'critical'
                : 'info'
            }
          />
        </View>

        <View className="mt-6">
          <BeforeAfter beforeUrl={job.beforeImageUrl} afterUrl={job.afterImageUrl} />
        </View>

        {job.status === 'completed' && (
          <Button
            title="Share render"
            onPress={() => {}}
            variant="secondary"
            className="mt-6"
          />
        )}
        <Button
          title="View property prospect"
          onPress={() => router.push(`/prospector/${job.propertyId}`)}
          variant="ghost"
          className="mt-3"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 5: Verify rendering screens**

Run:
```bash
npx expo start --web
```
Expected: Render tab shows gallery; create demo render navigates to detail with before/after toggle.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add Alter Rendering gallery and detail screens"
```

---

### Task 9: Build Real Estate Prospector Screens

**Files:**
- Create: `src/components/ProspectCard.tsx`
- Create: `app/(tabs)/prospector.tsx`
- Create: `app/prospector/[id].tsx`

**Interfaces:**
- Consumes: `useProspects`, `useProspect`, `usePortfolio`, `useAlertStore`.
- Produces: prospect discovery and deal analysis screens.

- [ ] **Step 1: Create ProspectCard component**

Create `src/components/ProspectCard.tsx`:
```tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../design-system/colors';
import { Badge } from './Badge';
import type { Prospect } from '../types';

export function ProspectCard({ prospect, onPress }: { prospect: Prospect; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl p-4 mb-3 active:bg-warm-stone/20"
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-sans font-medium text-root-earth flex-1">
          {prospect.property.address}
        </Text>
        <ChevronRight size={20} color={colors.warmStone} />
      </View>
      <Text className="text-sm text-warm-stone font-sans mt-1">
        {prospect.property.city}, {prospect.property.state}
      </Text>
      <View className="flex-row flex-wrap mt-3">
        <Badge label={prospect.strategy.replace(/-/g, ' ')} variant="info" />
        <View className="ml-2">
          <Badge label={`Score ${prospect.score}`} variant="success" />
        </View>
      </View>
      <View className="flex-row mt-3 gap-4">
        <View>
          <Text className="text-xs text-warm-stone uppercase tracking-wider">ARV</Text>
          <Text className="text-base font-sans font-semibold text-root-earth">
            ${(prospect.estimatedArv / 1000).toFixed(0)}k
          </Text>
        </View>
        <View>
          <Text className="text-xs text-warm-stone uppercase tracking-wider">Rehab</Text>
          <Text className="text-base font-sans font-semibold text-root-earth">
            ${(prospect.estimatedRehabCost / 1000).toFixed(0)}k
          </Text>
        </View>
        <View>
          <Text className="text-xs text-warm-stone uppercase tracking-wider">Equity</Text>
          <Text className="text-base font-sans font-semibold text-flourish-green">
            ${(prospect.estimatedEquity / 1000).toFixed(0)}k
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 2: Create prospector discovery screen**

Create `app/(tabs)/prospector.tsx`:
```tsx
import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProspects } from '../../src/hooks/useProspects';
import { ProspectCard } from '../../src/components/ProspectCard';
import { FilterChip } from '../../src/components/FilterChip';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';
import type { InvestmentStrategy } from '../../src/types';

const strategies: { key: InvestmentStrategy; label: string }[] = [
  { key: 'fix-and-flip', label: 'Fix & Flip' },
  { key: 'buy-and-hold', label: 'Buy & Hold' },
  { key: 'wholesale', label: 'Wholesale' },
];

export default function ProspectorScreen() {
  const router = useRouter();
  const [strategy, setStrategy] = useState<InvestmentStrategy>('fix-and-flip');
  const { data, isLoading, error, refetch } = useProspects({ strategy });

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">
          Real Estate Prospector
        </Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          Off-market opportunities ranked by investment strategy.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        contentContainerClassName="pb-2"
      >
        {strategies.map((s) => (
          <FilterChip
            key={s.key}
            label={s.label}
            active={strategy === s.key}
            onPress={() => setStrategy(s.key)}
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.neuralAmber} className="mt-12" />
      ) : error ? (
        <EmptyState
          title="Could not load prospects"
          message={error.message}
          actionTitle="Retry"
          onAction={() => refetch()}
        />
      ) : data?.length === 0 ? (
        <EmptyState title="No prospects" message="Try a different strategy or relax filters." />
      ) : (
        <ScrollView className="flex-1 px-4 mt-2" contentContainerClassName="pb-8">
          {data?.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onPress={() => router.push(`/prospector/${prospect.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Create deal analysis screen**

Create `app/prospector/[id].tsx`:
```tsx
import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProspect } from '../../src/hooks/useProspect';
import { usePortfolio } from '../../src/hooks/usePortfolio';
import { useAlertStore } from '../../src/stores/alertStore';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

function currency(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function ProspectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: prospect, isLoading, error } = useProspect(id);
  const { addItem, items } = usePortfolio();
  const addAlert = useAlertStore((s) => s.addAlert);
  const [notes, setNotes] = useState('');

  const tracked = items.some((i) => i.propertyId === prospect?.propertyId);

  const handleTrack = (type: 'watchlist' | 'owned') => {
    if (!prospect) return;
    addItem(prospect.propertyId, type);
    addAlert({
      type: 'prospect',
      title: type === 'owned' ? 'Added to portfolio' : 'Added to watchlist',
      message: prospect.property.address,
      targetId: prospect.propertyId,
      targetScreen: 'prospector',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-parchment items-center justify-center">
        <ActivityIndicator size="large" color={colors.neuralAmber} />
      </SafeAreaView>
    );
  }

  if (error || !prospect) {
    return (
      <SafeAreaView className="flex-1 bg-parchment">
        <EmptyState
          title="Prospect not found"
          message="We couldn't load this deal."
          actionTitle="Go back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-8">
        <Text className="text-3xl font-sans font-medium text-root-earth">
          {prospect.property.address}
        </Text>
        <Text className="text-base text-warm-stone font-sans mt-1">
          {prospect.property.city}, {prospect.property.state}
        </Text>
        <View className="flex-row mt-3">
          <Badge label={prospect.strategy.replace(/-/g, ' ')} variant="info" />
          <View className="ml-2">
            <Badge label={`Score ${prospect.score}`} variant="success" />
          </View>
        </View>

        <Card className="mt-6">
          <Text className="text-sm uppercase tracking-wider text-warm-stone font-sans">
            Estimated ARV
          </Text>
          <Text className="text-3xl font-sans font-semibold text-root-earth mt-1">
            {currency(prospect.estimatedArv)}
          </Text>
        </Card>

        <Text className="text-xl font-sans font-medium text-root-earth mt-6 mb-3">
          Deal metrics
        </Text>
        <Card className="mb-3">
          <View className="flex-row justify-between mb-3">
            <Text className="text-warm-stone font-sans">Estimated rehab</Text>
            <Text className="text-root-earth font-sans font-medium">
              {currency(prospect.estimatedRehabCost)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-warm-stone font-sans">Estimated equity</Text>
            <Text className="text-flourish-green font-sans font-medium">
              {currency(prospect.estimatedEquity)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-warm-stone font-sans">Cash-on-cash return</Text>
            <Text className="text-root-earth font-sans font-medium">
              {prospect.cashOnCashReturn}%
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-warm-stone font-sans">Monthly cash flow</Text>
            <Text className="text-root-earth font-sans font-medium">
              {currency(prospect.monthlyCashFlow ?? 0)}
            </Text>
          </View>
        </Card>

        <Text className="text-sm text-warm-stone font-sans mt-2">
          Comps and repair estimates are simulated for the MVP.
        </Text>

        {!tracked ? (
          <View className="flex-row mt-6 gap-3">
            <Button
              title="Watchlist"
              onPress={() => handleTrack('watchlist')}
              variant="secondary"
              className="flex-1"
            />
            <Button
              title="Mark owned"
              onPress={() => handleTrack('owned')}
              className="flex-1"
            />
          </View>
        ) : (
          <Card className="mt-6 bg-flourish-green/10">
            <Text className="text-root-earth font-sans font-medium">
              Tracked in portfolio
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes..."
              placeholderTextColor={colors.warmStone}
              className="mt-3 p-3 bg-parchment rounded-lg text-root-earth font-sans"
              multiline
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 4: Verify prospector screens**

Run:
```bash
npx expo start --web
```
Expected: Prospector tab shows deals; tapping opens analysis with metrics and track buttons.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add Real Estate Prospector discovery and analysis screens"
```

---

### Task 10: Build Portfolio, Alerts, Probate, and Settings Screens

**Files:**
- Create: `app/(tabs)/alerts.tsx`
- Create: `app/portfolio.tsx`
- Create: `app/probate.tsx`
- Create: `app/settings.tsx`

**Interfaces:**
- Consumes: `usePortfolio`, `useAlerts`, `useSettingsStore`.
- Produces: supporting screens.

- [ ] **Step 1: Create Alerts screen**

Create `app/(tabs)/alerts.tsx`:
```tsx
import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { EmptyState } from '../../src/components/EmptyState';
import type { Alert } from '../../src/types';

function AlertItem({ alert, onPress }: { alert: Alert; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-soft-mist rounded-2xl p-4 mb-3 ${!alert.read ? 'border-l-4 border-neural-amber' : ''}`}
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-sans font-medium text-root-earth">{alert.title}</Text>
        <Badge
          label={alert.type}
          variant={alert.type === 'scanner' ? 'warning' : alert.type === 'render' ? 'success' : 'info'}
        />
      </View>
      <Text className="text-sm text-warm-stone font-sans mt-1">{alert.message}</Text>
      <Text className="text-xs text-warm-stone font-sans mt-2">
        {new Date(alert.createdAt).toLocaleString()}
      </Text>
    </Pressable>
  );
}

export default function AlertsScreen() {
  const router = useRouter();
  const { alerts, markRead, clearAll } = useAlerts();

  const handlePress = (alert: Alert) => {
    markRead(alert.id);
    if (alert.targetScreen === 'scanner') router.push(`/scanner/${alert.targetId}`);
    if (alert.targetScreen === 'render') router.push(`/render/${alert.targetId}`);
    if (alert.targetScreen === 'prospector') router.push(`/prospector/${alert.targetId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-sans font-medium text-root-earth">Alerts</Text>
          <Text className="text-sm text-warm-stone font-sans mt-1">
            {alerts.filter((a) => !a.read).length} unread
          </Text>
        </View>
        {alerts.length > 0 && (
          <Button title="Clear" onPress={clearAll} variant="ghost" size="sm" />
        )}
      </View>

      {alerts.length === 0 ? (
        <EmptyState
          title="No alerts"
          message="New scanner hits, renders, and prospect updates will appear here."
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} onPress={() => handlePress(alert)} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Create Portfolio screen**

Create `app/portfolio.tsx`:
```tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePortfolio } from '../../src/hooks/usePortfolio';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { EmptyState } from '../../src/components/EmptyState';

export default function PortfolioScreen() {
  const router = useRouter();
  const { items } = usePortfolio();

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Portfolio</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          Properties you are tracking or own.
        </Text>
      </View>

      {items.length === 0 ? (
        <EmptyState
          title="No properties tracked"
          message="Add deals from the Prospector to build your portfolio."
          actionTitle="Find deals"
          onPress={() => router.push('/prospector')}
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
          {items.map((item) => (
            <Card key={item.propertyId} className="mb-3">
              <Text className="text-base font-sans font-medium text-root-earth">
                {item.property?.address}
              </Text>
              <View className="mt-2">
                <Badge label={item.type} variant={item.type === 'owned' ? 'success' : 'info'} />
              </View>
              <Button
                title="View deal"
                onPress={() => router.push(`/prospector/${item.propertyId}`)}
                variant="secondary"
                size="sm"
                className="mt-3"
              />
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Create minimal Probate screen**

Create `app/probate.tsx`:
```tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../src/components/Card';
import { Badge } from '../src/components/Badge';
import { EmptyState } from '../src/components/EmptyState';

const mockCases = [
  { id: 'case-001', decedent: 'Eleanor Rigby', caseNumber: 'PR-2026-1847', status: 'pending' },
  { id: 'case-002', decedent: 'Maxwell Silver', caseNumber: 'PR-2026-2901', status: 'closed' },
];

export default function ProbateScreen() {
  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Probate Pipeline</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          Minimal probate case linking for the MVP.
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
        {mockCases.map((c) => (
          <Card key={c.id} className="mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-sans font-medium text-root-earth">{c.decedent}</Text>
              <Badge label={c.status} variant={c.status === 'closed' ? 'success' : 'warning'} />
            </View>
            <Text className="text-sm text-warm-stone font-sans mt-1">{c.caseNumber}</Text>
          </Card>
        ))}
        <EmptyState
          title="Probate tools are minimized"
          message="Full estate administration is out of scope for this MVP."
        />
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 4: Create Settings screen**

Create `app/settings.tsx`:
```tsx
import React from 'react';
import { ScrollView, Text, View, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemoMode } from '../src/hooks/useDemoMode';
import { Card } from '../src/components/Card';
import { colors } from '../src/design-system/colors';

export default function SettingsScreen() {
  const { useLiveGeo, mapStyle, setUseLiveGeo, setMapStyle } = useDemoMode();

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Settings</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">Demo and display options.</Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-sans font-medium text-root-earth">Use live geo data</Text>
              <Text className="text-xs text-warm-stone font-sans mt-1">
                Load building footprints from Overpass when available.
              </Text>
            </View>
            <Switch
              value={useLiveGeo}
              onValueChange={setUseLiveGeo}
              trackColor={{ false: colors.warmStone, true: colors.neuralAmber }}
              thumbColor={useLiveGeo ? colors.rootEarth : colors.parchment}
            />
          </View>
        </Card>

        <Card className="mb-3">
          <Text className="text-base font-sans font-medium text-root-earth mb-2">Map style</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setMapStyle('light')}
              className={`flex-1 p-3 rounded-lg items-center ${
                mapStyle === 'light' ? 'bg-neural-amber/20' : 'bg-parchment'
              }`}
            >
              <Text className="text-root-earth font-sans">Light</Text>
            </Pressable>
            <Pressable
              onPress={() => setMapStyle('satellite')}
              className={`flex-1 p-3 rounded-lg items-center ${
                mapStyle === 'satellite' ? 'bg-neural-amber/20' : 'bg-parchment'
              }`}
            >
              <Text className="text-root-earth font-sans">Satellite</Text>
            </Pressable>
          </View>
        </Card>

        <Text className="text-xs text-warm-stone font-sans mt-4 text-center">
          VIVELLA PROSPECT MVP · Built with Expo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 5: Verify supporting screens**

Run:
```bash
npx expo start --web
```
Expected: Alerts, Portfolio, Probate, and Settings screens render and function.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add alerts, portfolio, probate, and settings screens"
```

---

### Task 11: Configure Deployment for Web (Vercel) and Mobile (EAS)

**Files:**
- Create: `vercel.json`
- Create: `eas.json`
- Create: `.env.example`
- Create: `README.md`

**Interfaces:**
- Consumes: Expo static web export.
- Produces: Vercel and EAS deployment configs.

- [ ] **Step 1: Create Vercel config**

Create `vercel.json`:
```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "devCommand": "npx expo start --web",
  "installCommand": "npm install",
  "framework": null
}
```

- [ ] **Step 2: Create EAS config**

Create `eas.json`:
```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

- [ ] **Step 3: Create environment example**

Create `.env.example`:
```
EXPO_PUBLIC_USE_LIVE_GEO=false
EXPO_PUBLIC_MAP_STYLE_URL=https://demotiles.maplibre.org/style.json
```

- [ ] **Step 4: Create README**

Create `README.md`:
```markdown
# VIVELLA PROSPECT

Property intelligence command center built with Expo.

## Features

- Sentinel Scanner — property condition monitoring
- Alter Rendering Engine — before/after renovation visualization
- Real Estate Prospector — deal discovery, analysis, portfolio tracking
- Minimal Probate Pipeline linking

## Run locally

```bash
npm install
npx expo start
```

Press `w` for web, `i` for iOS simulator, `a` for Android emulator.

## Deploy web to Vercel

```bash
npm install -g vercel
vercel --prod
```

## Build mobile preview with EAS

```bash
npm install -g eas-cli
eas build --profile preview --platform all
```
```

- [ ] **Step 5: Verify web export builds**

Run:
```bash
npx expo export --platform web
```
Expected: `dist/` directory is created with `index.html` and assets.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: add Vercel and EAS deployment configuration"
```

---

## Plan Self-Review

### 1. Spec Coverage

| Spec Section | Implementing Task |
|--------------|-------------------|
| Expo Router + shared codebase | Task 1 |
| VIVELLA design tokens | Task 2 |
| Bottom tabs + header | Task 5 |
| Dashboard | Task 6 |
| Sentinel Scanner (map, list, detail) | Task 7 |
| Alter Rendering (gallery, detail, before/after) | Task 8 |
| Real Estate Prospector (discovery, analysis) | Task 9 |
| Portfolio, Alerts, Probate, Settings | Task 10 |
| Mock + live adapters | Task 3 |
| Zustand stores + TanStack Query hooks | Task 4 |
| Error handling / loading states | Embedded in screen tasks |
| Vercel + EAS deployment | Task 11 |

### 2. Placeholder Scan

No TBD, TODO, or vague steps remain. Every step includes exact file paths, code, or commands.

### 3. Type Consistency

- `ScannerHit`, `RenderJob`, `Prospect`, `Alert`, `Property`, `GeoPoint`, `RenderPreset`, `InvestmentStrategy` are defined in `src/types/index.ts` and used consistently across adapters, hooks, and screens.
- Adapter function names (`getScannerHits`, `getRenderJobs`, `getProspects`) match hook consumption.
- Route params use `useLocalSearchParams<{ id: string }>()` consistently.

### 4. Known Gaps / Notes

- MapLibre native integration is represented by a cross-platform `<MapView>` placeholder in Task 7. A future task could swap in real `maplibre-gl` and `@maplibre/maplibre-react-native` bindings once the packages are verified with Expo SDK 52.
- The live Overpass adapter returns a maximum of 50 buildings and does not yet merge with mock property records.
- No actual push notifications; in-app alerts only, per approved scope.
- Authentication intentionally omitted per approved MVP scope.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-03-vivella-prospect-implementation-plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
