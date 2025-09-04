# Copilot Instructions for Notes App

## Architecture Overview

This is a **monorepo** with three main applications:
- **`apps/api/`** - Fastify REST API with SQLite database using better-sqlite3
- **`apps/web-app/`** - Nuxt 3 SPA frontend with TipTap block editor
- **`apps/desktop-app/`** - Electron wrapper (in development)

**Key architectural decisions:**
- SQLite with WAL mode for local-first data storage
- Tag-based organization (no folders) with many-to-many relationships
- Block-based rich text editor using TipTap with JSON storage
- Dockerized deployment with separate API and web containers

## Development Workflow

### Starting the Development Environment
```bash
bun run dev  # Starts API first, then web app when API health check passes
# OR individually:
bun run api:dev  # Port 3001
bun run web:dev  # Port 3000
```

### Database Schema
Located in `apps/api/src/db.ts` - uses auto-seeding pattern:
- `notes` table with JSON content storage
- `tags` table with name/color
- `note_tags` junction table for many-to-many relationships
- `settings` table for user preferences

## Code Patterns & Conventions

### Frontend State Management
- **Nuxt composables** in `composables/` for data fetching (`useNotes`, `useSettings`)
- **Pinia stores** in `stores/` for UI state (modals)
- **Global state** via `useState()` for shared data across components

### Component Structure
Components follow atomic design in `components/`:
- Use `<script setup>` syntax with TypeScript
- Props are type-safe interfaces matching backend models
- TailwindCSS with custom dark theme variables in `nuxt.config.ts`

### API Patterns
- RESTful endpoints with consistent error handling
- Database operations use prepared statements
- Auto-incrementing IDs with `lastInsertRowid`
- Foreign key constraints with cascade deletes

### Editor Integration
`components/Editor.vue` uses TipTap with:
- Custom CodeBlock extension in `lib/tiptap/extensions/`
- Debounced auto-save (500ms) that updates both content and title
- JSON content format stored in database

## Critical Integration Points

### API-Frontend Communication
- Runtime config: `PUBLIC_API_URL` environment variable
- Type sharing: Duplicate interfaces in `apps/api/src/models/` and `composables/useNotes.ts`
- Error handling: Frontend assumes API success, minimal error boundaries

### Build & Deployment
- **Development**: Uses `wait-on` to ensure API readiness before starting frontend
- **Production**: Docker Compose with volume mounts for SQLite persistence
- **Database**: Auto-creates in `apps/api/data/` directory with WAL mode

### Search & Filtering
- Client-side search using Fuse.js in `useNotes` composable
- Tag filtering with intersection logic for multiple tag selection
- Real-time filtering without backend queries

## Development Guidelines

- **Database changes**: Modify the `seed()` function in `apps/api/src/db.ts`
- **New components**: Place in appropriate `components/` subdirectory with TypeScript props
- **State management**: Use composables for data, Pinia stores for UI-only state
- **Styling**: Extend custom theme colors in `nuxt.config.ts`, avoid hardcoded colors
- **Editor features**: Extend TipTap in `lib/tiptap/extensions/` directory

## Common Tasks

### Adding a new API endpoint:
1. Add route handler in `apps/api/src/index.ts`
2. Add database function in `apps/api/src/db.ts`
3. Update frontend composable in `composables/useNotes.ts`

### Adding new note content types:
1. Create TipTap extension in `lib/tiptap/extensions/`
2. Register in `components/Editor.vue`
3. Update content JSON schema handling

### Modifying the database:
1. Update `seed()` function in `apps/api/src/db.ts`
2. Consider migration strategy for existing data
3. Update TypeScript interfaces in both API and frontend
