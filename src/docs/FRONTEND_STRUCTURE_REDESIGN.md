# Frontend Structure Redesign

Duoi day la cau truc de xuat dua tren mau ban dua, da dieu chinh de phu hop du an hien tai (Vite + React + TypeScript + feature modules).

## Root

```txt
my-app/
|
|- public/
|
|- src/
|  |
|  |- assets/                 # images, icons, fonts
|  |  |- images/
|  |  |- icons/
|  |  `- fonts/
|  |
|  |- app/                    # app bootstrap va app-level config
|  |  |- App.tsx
|  |  |- main.tsx
|  |  |- providers.tsx
|  |  `- routes.tsx
|  |
|  |- components/             # reusable components dung chung
|  |  |- ui/                  # Button, Card, Input...
|  |  |- common/              # Navbar, Header, Footer...
|  |  `- layout/              # layout blocks
|  |
|  |- layouts/                # page layouts dung lai
|  |  |- MainLayout.tsx
|  |  |- AuthLayout.tsx
|  |  `- DashboardLayout.tsx
|  |
|  |- pages/                  # pages tong quat (khong thuoc 1 feature rieng)
|  |  |- HomePage.tsx
|  |  |- ForbiddenPage.tsx
|  |  `- NotFoundPage.tsx
|  |
|  |- features/               # business modules theo domain
|  |  |- auth/
|  |  |  |- pages/
|  |  |  |- components/
|  |  |  |- services/
|  |  |  |- hooks/
|  |  |  |- types.ts
|  |  |  `- index.ts
|  |  |
|  |  |- admin/
|  |  |- manager/
|  |  |- staff/
|  |  |- driver/
|  |  |- parking/
|  |  |- notifications/
|  |  |- feedback/
|  |  `- ai-optimization/
|  |
|  |- services/               # axios client + API services dung chung
|  |  |- apiClient.ts
|  |  |- endpoints.ts
|  |  `- modules/             # userService.ts, parkingService.ts...
|  |
|  |- routes/                 # central route config + guards
|  |  |- index.tsx
|  |  `- guards/
|  |     |- ProtectedRoute.tsx
|  |     `- RoleGuard.tsx
|  |
|  |- hooks/                  # reusable custom hooks toan app
|  |  `- useDebounce.ts
|  |
|  |- context/                # React Context neu can
|  |  `- AuthContext.tsx
|  |
|  |- stores/                 # global stores (zustand/redux)
|  |  `- authStore.ts
|  |
|  |- constants/              # constants dung chung
|  |  |- routes.ts
|  |  `- storageKeys.ts
|  |
|  |- types/                  # shared TypeScript types
|  |  |- api.ts
|  |  `- parking.ts
|  |
|  |- utils/                  # helper functions
|  |  |- formatDate.ts
|  |  `- validators.ts
|  |
|  |- styles/                 # global styles, variables
|  |  |- globals.css
|  |  `- variables.css
|  |
|  `- tests/                  # setup + mocks
|     |- setup.ts
|     `- mocks/
|
|- .env
|- package.json
`- vite.config.ts
```

## Mapping voi mau ban dua

- `components/`, `pages/`, `services/`, `layouts/`, `hooks/`, `utils/`, `styles/` duoc giu dung tinh than mau.
- Bo sung `features/` de scale du an lon va tach domain nghiep vu.
- `routes/` duoc tach rieng de de quan ly guard va role-based routing.
- `app/` gom bootstrap (`main.tsx`, `App.tsx`, providers, app-level routes).
- Doi `context/` thanh optional, chi them khi can React Context.

## Naming conventions de team de dong bo

- Folder: `kebab-case` (vi du `role-permissions`, `vehicle-entry`).
- React component file: `PascalCase.tsx`.
- Hooks: `useXxx.ts`.
- Service: `xxxService.ts`.
- Barrel export: dung `index.ts` cho moi feature/module.
