# Braden Scale Pro

[![[cloudflarebutton]]](https://deploy.workers.cloudflare.com/?url=${repositoryUrl})

A professional web application for Braden Scale assessment, built with modern React, TypeScript, Tailwind CSS, and deployed on Cloudflare Pages/Workers. This full-stack template includes a responsive UI with shadcn/ui components, API routes powered by Hono, and seamless Cloudflare integration.

## Features

- **Modern React App**: TypeScript, React Router, TanStack Query for data fetching.
- **Beautiful UI**: Tailwind CSS with shadcn/ui components, dark mode, animations.
- **Full-Stack API**: Hono-based routes in Cloudflare Workers with CORS and error handling.
- **Developer Experience**: Hot reload, linting, type generation from Wrangler.
- **Responsive Design**: Mobile-first with sidebar layout option.
- **Theme Support**: Light/dark mode with persistence.
- **Error Handling**: Client-side error reporting to API.
- **Production-Ready**: Optimized builds, Tailwind purging, Cloudflare assets handling.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion, Sonner (toasts), React Router, TanStack Query.
- **Backend**: Hono, Cloudflare Workers, Cloudflare KV/Durable Objects ready.
- **Utils**: Zod (validation), Immer (state), class-variance-authority (CVA), clsx, tw-merge.
- **Dev Tools**: Bun, ESLint, Wrangler, Cloudflare Vite plugin.

## Quick Start

1. **Clone the repo**:
   ```
   git clone <your-repo-url>
   cd braden-scale-pro-z_8fsz8na6w7eqltvos8a
   ```

2. **Install dependencies** (using Bun):
   ```
   bun install
   ```

3. **Start development server**:
   ```
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or your configured port).

## Installation

This project uses **Bun** as the package manager for faster installs and better performance.

```bash
bun install
```

**Note**: Bun is required. Install from [bun.sh](https://bun.sh).

## Development

### Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server with hot reload (port `${PORT:-3000}`). |
| `bun run build` | Build for production. |
| `bun run lint` | Run ESLint. |
| `bun run preview` | Preview production build (port `${PORT:-4173}`). |
| `bun run deploy` | Build + deploy to Cloudflare. |
| `bun run cf-typegen` | Generate types from Wrangler. |

### Folder Structure

```
src/
├── components/     # UI components (shadcn/ui + custom)
├── hooks/          # Custom React hooks
├── lib/            # Utilities (error reporting, utils)
├── pages/          # Page components
└── main.tsx        # App entry

worker/
├── index.ts        # Worker entry (DO NOT MODIFY)
├── userRoutes.ts   # Add your API routes here
└── core-utils.ts   # Env types (DO NOT MODIFY)
```

### Adding API Routes

Edit `worker/userRoutes.ts`:

```ts
import { Hono } from 'hono';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/data', (c) => c.json({ message: 'Hello!' }));
}
```

Routes are available at `/api/*`.

### Customizing UI

- Edit `src/pages/HomePage.tsx` for homepage.
- Use `AppLayout` from `src/components/layout/AppLayout.tsx` for sidebar.
- Components auto-import via `components.json` aliases.
- Theme toggle included in `ThemeToggle.tsx`.

### TypeScript Paths

```
@/*          -> ./src/*
@shared/*    -> ./shared/*
```

## Deployment

Deploy to Cloudflare Pages/Workers in one command:

```bash
bun run deploy
```

This runs `bun run build && wrangler deploy`.

**[cloudflarebutton]**

### Prerequisites

1. Install [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/): `bunx wrangler@latest init` (if first time).
2. Login: `wrangler login`.
3. Configure `wrangler.jsonc` with your account/project details if needed.

### Custom Domain & Assets

- Assets served from `/dist` with SPA fallback.
- API routes (`/api/*`) handled by Worker first.
- Update `wrangler.jsonc` for KV/DO bindings, R2, etc.

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add some AmazingFeature'`).
4. Push (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

MIT License. See [LICENSE](LICENSE) for details.