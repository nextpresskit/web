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

Install dependencies and run the app locally:

```bash
bun install
bun dev
```

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
