# RecetaJote — Platformë Recetash

Projekt për lëndën **Zhvillim i Ueb-it në Anën e Klientit** (Prof. Cand. Phd. Vesa Morina).

Një aplikacion full-stack për të zbuluar, ruajtur dhe ndarë receta, i ndërtuar me **Next.js (Pages Router), TypeScript, MongoDB, NextAuth dhe Tailwind CSS**.

**Live demo:** [https://recetajote.vercel.app](https://recetajote.vercel.app/)

---

## Screenshots

| Ballina | Recetat |
|---------|---------|
| [![Ballina](docs/screenshots/home.png)](docs/screenshots/home.png) | [![Recetat](docs/screenshots/recipes.png)](docs/screenshots/recipes.png) |

| Detajet e recetës | Paneli i Adminit |
|-------------------|------------------|
| [![Detajet](docs/screenshots/recipe-details.png)](docs/screenshots/recipe-details.png) | [![Admin](docs/screenshots/admin.png)](docs/screenshots/admin.png) |

**Dark Mode**

[![Dark Mode](docs/screenshots/dark-mode.png)](docs/screenshots/dark-mode.png)

---

## Veçoritë

- **16 faqe funksionale**: Home, About, Contact, Login, Register, Recipes, Recipe Details, Dashboard, Admin, **Studio**, Profile, Favorites (+ Search, 404, FAQ, Terms)
- **Autentifikim** me NextAuth: email/fjalëkalim (bcrypt) + Google & Facebook OAuth
- **3 role** (`user` / `blogger` / `admin`) me mbrojtje rrugësh përmes `middleware`
- **CRUD** për disa entitete: Receta, Përdorues (admin), Komente, Favorites
- **Favorites** — ruaj recetat e preferuara
- **MongoDB** me 4 modele (User, Recipe, Comment, Favorite)
- **Data fetching**: SSG, ISR, SSR dhe `getStaticPaths`
- **Hooks & Context**: `useState`, `useEffect`, custom `useFetch`, Context API
- **Formularë me validim** (react-hook-form)
- **Tailwind CSS** + responsive design + **Dark Mode**
- **Teste** me Jest + React Testing Library
- **CI/CD** me GitHub Actions (lint + test + build)

---

## Rolet dhe qasjet

| Roli | Recetat | Përdoruesit | Komente / Favorites | Faqja e dedikuar |
|------|---------|-------------|---------------------|------------------|
| **user** | vetëm-lexim | — | krijon/fshin të vetat | `/dashboard` |
| **blogger** | CRUD **vetëm mbi të vetat** | — | Po | `/studio` |
| **admin** | CRUD mbi **të gjitha** | CRUD mbi **të gjithë** përdoruesit | Po | `/admin` |

- Gjatë regjistrimit, përdoruesi zgjedh **user** ose **blogger** (roli `admin` nuk jepet kurrë përmes regjistrimit).
- Blogger-i menaxhon vetëm recetat që i ka krijuar vetë (kontroll pronësie në API).
- Admini ndryshon rolet dhe fshin përdorues nga paneli i adminit (por jo llogarinë e vet — mbrojtje nga vetë-bllokimi).

---

## Teknologjitë

| Kategoria | Teknologjia |
|-----------|-------------|
| Framework | Next.js 16 (Pages Router) |
| Gjuha | TypeScript |
| Databaza | MongoDB (native driver) + `@auth/mongodb-adapter` |
| Autentifikim | NextAuth.js (Credentials + Google + Facebook) |
| Stilizim | Tailwind CSS + CSS variables (design tokens) |
| Formularë | React Hook Form |
| Testim | Jest + React Testing Library |
| CI/CD | GitHub Actions |
| Deploy | Vercel |

---

## Instalimi lokal

### 1. Klono projektin
```bash
git clone <repo-url>
cd recipe-platform
npm install
```

### 2. Konfiguro environment variables
Krijo skedarin `.env.local` në rrënjë dhe plotëso vlerat:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=recipeapp
NEXTAUTH_SECRET=<gjenero një sekret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
```

> Gjenero `NEXTAUTH_SECRET` me:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

### 3. Mbush databazën me të dhëna shembull
```bash
npm run seed
```
Kjo krijon 6 receta + një **admin**: `admin@recetajote.com` / `admin123`

### 4. Nis aplikacionin
```bash
npm run dev
```
Hape në [http://localhost:3000](http://localhost:3000)

---

## Skriptet

| Komanda | Përshkrimi |
|---------|-----------|
| `npm run dev` | Nis serverin lokal |
| `npm run build` | Ndërton për production |
| `npm start` | Nis versionin e ndërtuar |
| `npm test` | Ekzekuton testet |
| `npm run seed` | Mbush databazën me të dhëna shembull |
| `npm run lint` | Kontrollon kodin me ESLint |

---

## Konfigurimi i OAuth (opsional)

**Google:** [console.cloud.google.com](https://console.cloud.google.com) → Credentials → OAuth client ID
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (dhe URL-ja e Vercel)

**Facebook:** [developers.facebook.com](https://developers.facebook.com) → App → Facebook Login
- Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`

> Nëse çelësat nuk vendosen, butonat OAuth fshihen automatikisht dhe login me email/fjalëkalim funksionon normalisht. Shih edhe `OAUTH-SETUP.txt`.

---

## Deployment në Vercel

1. Push kodin në GitHub.
2. Në [vercel.com](https://vercel.com) → New Project → importo repo-n.
3. Shto të gjitha environment variables te **Settings → Environment Variables**.
4. Vendos `NEXTAUTH_URL` = URL-ja e prodhimit (p.sh. `https://recetajote.vercel.app`).
5. Deploy — Vercel ekzekuton automatikisht `npm install` dhe `npm run build`.

---

## API Routes

| Route | Metodat | Qasja |
|-------|---------|-------|
| `/api/auth/[...nextauth]` | — | NextAuth |
| `/api/auth/register` | POST | Publik (zgjedh rolin user/blogger) |
| `/api/recipes` | GET, POST | GET publik · POST blogger/admin |
| `/api/recipes/[id]` | GET, PUT, DELETE | GET publik · PUT/DELETE admin ose autori |
| `/api/users` | GET | Admin |
| `/api/users/[id]` | PUT, DELETE | Admin |
| `/api/comments` | GET, POST | GET publik · POST i kyçur |
| `/api/comments/[id]` | DELETE | Autori ose admin |
| `/api/favorites` | GET, POST, DELETE | I kyçur |
| `/api/profile` | GET, PUT | I kyçur |
| `/api/contact` | POST | Publik (me validim) |

---

## Struktura e projektit

```
src/
├── api/
│   ├── models/       # Interfaces (User, Recipe, Comment, Favorite)
│   └── services/     # Funksionet CRUD me MongoDB
├── components/       # Header, Footer, MainLayout, Comments,
│                     # RecipeManager, UserManager + shared/ (Button, RecipeCard, Modal, Icon)
├── contexts/         # ThemeContext (dark mode), FavoritesContext
├── hooks/            # useFetch (custom hook)
├── lib/              # mongodb, auth, apiAuth
├── pages/            # Faqet + API routes (pages/api)
├── styles/           # globals.css (Tailwind + design tokens)
├── types/            # next-auth.d.ts
└── proxy.ts          # Mbrojtja e rrugëve sipas rolit (Proxy = middleware në Next.js 16)
```

---

## Anëtarët e grupit

| Emri | Roli |
|------|------|
| **Art Gashi** | Frontend & UI (komponentët, stilizim, Dark Mode) |
| **Arsa Krasniqi** | Backend & API (MongoDB, CRUD, role) |
| **Shkelqim Maliqi** | Autentifikim & Deploy (NextAuth, Vercel, CI/CD) |
| **Anisa Mustafa** | Testim & Dokumentim (Jest, README, prezantim) |

---

## Përmbushja e kërkesave

| # | Kërkesa (pikë) | Statusi | Ku |
|---|----------------|---------|-----|
| 1 | 10+ faqe funksionale (15) | Po — 16 faqe | `src/pages/` |
| 2 | 4+ komponentë të ripërdorshëm (5) | Po | `Header`, `Footer`, `RecipeCard` (Card), `Modal`, `Button`, `RecipeManager`, `UserManager` |
| 3 | NextAuth + role + middleware (10) | Po — 3 role | `lib/auth.ts`, `proxy.ts` (Credentials + Google + Facebook) |
| 4 | CRUD për 2+ entitete (10) | Po | Recipe (CRUD), User (CRUD-admin), Comment, Favorite |
| 5 | MongoDB me 3+ modele (8) | Po — 4 modele | `src/api/models/` |
| 6 | Hooks + Context + custom hook (8) | Po | `useFetch`, `ThemeContext`, `FavoritesContext` |
| 7 | SSR + SSG + ISR + getStaticPaths (8) | Po | Home (ISR 30s), Recipes (SSR), Details (SSG + `getStaticPaths` + ISR 60s) |
| 8 | Formularë me validim (5) | Po | Register, Login, Contact, Recipe form, Profile |
| 9 | Tailwind + responsive (6) | Po | Klasa utility të Tailwind te komponentët (`Button`, `RecipeCard`, `Modal`, `Footer`) + responsive kudo + Dark Mode |
| 10 | Teste 3 komponentë + 2 API (5) | Po — 13 teste | `src/__tests__/` |
| 11 | Deployment + README (5) | Po — [live](https://recetajote.vercel.app/) | Vercel + ky skedar |
| 12 | Env variables (3) | Po | `.env.local`, `OAUTH-SETUP.txt` |
| 13 | Prezantimi (7) | Në pritje | Ndarja e roleve më lart |

### Bonus
- Po — **Dark Mode** funksional (`ThemeContext` + toggle në Header)
- Po — **CI/CD** me GitHub Actions (`.github/workflows/ci.yml`)
- Jo — useSWR / React Query
- Jo — WebSocket / notifikime real-time

> **Shënim për #9:** komponentët e ripërdorshëm (`Button`, `RecipeCard`, `Modal`, `Footer`) stilizohen me klasa utility të Tailwind (duke përfshirë *arbitrary values* që lidhen me CSS variables, kështu ruhet Dark Mode). Pjesa tjetër e faqeve përdor një përzierje të klasave utility dhe *inline styles* me *design tokens*. Aplikacioni është plotësisht responsive për mobile, tablet dhe desktop.
