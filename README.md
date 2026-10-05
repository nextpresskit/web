# NextPressKit

NextPressKit is a [PN Scripts](https://pnscripts.com) product ([product page](https://pnscripts.com/products/nextpresskit)): a starter kit for building modern web apps using [TanStack Start](https://tanstack.com/start), [Tailwind CSS](https://tailwindcss.com/), and [Shadcn UI](https://ui.shadcn.com/).

The goal of this project is to give developers a strong starting point they can clone and build on, with common product needs already in place: authentication handling, blog post creation flows, and an administration area.

- Website: [nextpresskit.com](https://nextpresskit.com)
- Backend API repository: [nextpresskit/backend](https://github.com/nextpresskit/backend)

## Project Concepts

- **Starter-first architecture**: designed for rapid project bootstrapping and customization.
- **Auth-ready foundations**: includes client-side auth integration patterns and services.
- **Content-oriented workflows**: supports blog post and publishing experiences.
- **Admin capabilities**: includes administration screens and structures to manage app data.
- **Modern UI stack**: Tailwind + Shadcn components for fast, consistent interfaces.

## Tech Stack

- [TanStack Start](https://tanstack.com/start)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Vitest](https://vitest.dev/)
- [Biome](https://biomejs.dev/)

## Getting Started

This repository uses **[Bun](https://bun.com/) only** (lockfile `bun.lock`; CI pins Bun 1.3.9). Do not use npm, pnpm or yarn here: they would create a second lockfile. Install-script permissions live in `package.json` `trustedDependencies` (esbuild, lightningcss). Dependencies are pinned to exact versions or caret ranges, never `latest`.

Install dependencies and run the app locally:

```bash
bun install --frozen-lockfile
bun dev
```

Imports from `src/` use the `#/` alias only (`package.json` `imports` and `tsconfig.json` `paths`), for example `import { Button } from "#/components/ui/button"`.

## Create Certificates - One time setup

This is a one time setup to create certificates for the development server.
If you don't have mkcert installed, you can install it with:

For Mac OS:

```bash
brew install mkcert
```

For Windows:

```bash
choco install mkcert
```

For Linux:

```bash
sudo apt install mkcert
```

Then run the following commands to create the certificates:

```bash
mkcert -install
mkcert localhost
```

The development server runs on `https://localhost:3000`.

## Scripts

```bash
bun --bun run dev
bun --bun run build
bun --bun run preview
bun --bun run test
bun --bun run lint
bun --bun run format
bun --bun run check
```

## Backend Integration

NextPressKit frontend is designed to work with the backend API project:

- Backend repo: [https://github.com/nextpresskit/backend](https://github.com/nextpresskit/backend)
- API responsibilities include authentication, content APIs, and admin-related backend operations.
- This project can also be used separately with a different backend or mock/local APIs.

### API configuration

The app talks to the backend through `VITE_API_URL` (see `.env.example`):

```bash
cp .env.example .env.local   # then edit VITE_API_URL if needed
```

- In development, an unset `VITE_API_URL` falls back to `http://localhost:9090`, the backend's default `APP_PORT`.
- Production builds have no fallback: admin screens show a clear "API URL is not configured" error until it is set.
- Requests are sent with credentials because the backend's default auth mode uses HTTP-only cookies (`JWT_AUTH_SOURCE=cookie`). Add this app's origin to the backend's `CORS_ORIGINS` (for example `CORS_ORIGINS=http://127.0.0.1:3000,http://localhost:3000`).
- Auth endpoints used: `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`.
- Admin endpoints used: `GET /admin/posts` (+ `GET|PUT|DELETE /admin/posts/{id}`, `PUT /admin/posts/{id}/seo`) and `GET /admin/users` (backend permission `users:read`, granted to the `admin` role by the backend seed). Backend response shapes are mapped to the admin view models in one place, `src/services/admin/adapters.ts`.
- `VITE_SITE_URL` is this app's public origin; share tags such as `og:image` are built as absolute URLs from it (development default `http://localhost:3000`; production omits `og:image` until it is set).

### Demo images

Sample blog covers and shop images in `public/demo/` are abstract SVGs drawn by `scripts/generate-demo-images.mjs` (no photos, no third-party assets; same licence as this repository). Regenerate with `bun scripts/generate-demo-images.mjs`.

## Internationalization

This project includes ParaglideJS for localized routing and message formatting.

- Messages live in `messages/` (`messages/{locale}.json`, configured in `project.inlang/settings.json`).
- URLs are localized through the Paraglide Vite plugin and router rewrite hooks.
- Running the dev server or build regenerates `src/paraglide` outputs.

## Shadcn Components

Use the latest Shadcn CLI to add components:

```bash
bunx --bun shadcn@latest add button
```
