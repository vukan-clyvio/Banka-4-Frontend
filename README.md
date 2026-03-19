## Tech stack

- React 19 + Vite
- React Router v7
- Zustand (state management)
- Axios (HTTP klijent)
- GSAP 3 (animacije)
- CSS Modules

## Pokretanje

```bash
npm install
npm run dev
```

## Environment varijable

Kopiraj `.env.example` u `.env` i podesi vrednosti

## Struktura projekta

```
src/
├── api/                  Axios klijent i endpoint definicije
│   ├── client.js         Axios instanca, interceptori, refresh token
│   └── endpoints/        API pozivi grupisani po feature
├── animations/           GSAP hookovi (usePageTransition)
├── components/
│   ├── layout/           Navbar, ChangePasswordModal
│   └── ui/               Alert, Spinner
├── features/
│   └── employees/        EmployeeTable, EmployeeFilters
├── hooks/                useFetch, useDebounce
├── pages/                Jedna stranica = jedna ruta
├── store/                Zustand store (auth)
├── styles/               CSS varijable
└── utils/                Validacija, helperi
```

## Mock podaci

U development modu (`npm run dev`) automatski se ucitava mock interceptor koji simulira backend odgovore. U produkcijskom buildu mock se ne ucitava.
