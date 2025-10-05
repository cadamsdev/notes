# Copilot Instructions for Notes App

## Project Architecture

This is a **Tauri v2 + Vue 3 + Vite** desktop application using a monorepo structure managed by Bun workspaces.

### Repository Structure
- **Root**: Monorepo managed with Bun workspaces (`bun.lock`, `package.json`)
- **`desktop/`**: The Tauri application workspace
  - Frontend: Vue 3 SFCs with `<script setup>` syntax
  - Build tool: Vite with Tailwind CSS v4
  - Backend: Rust using Tauri framework v2

### Key Architecture Points
- The Rust library is named `notes_lib` (not just `notes`) to avoid Windows binary name conflicts
- Tauri backend is in `desktop/src-tauri/src/lib.rs` with commands registered via `tauri::generate_handler![]`
- Frontend runs on `localhost:1420` (strict port) during development
- Vite HMR uses port `1421` when using `TAURI_DEV_HOST`

## Development Workflows

### Running the Application
```bash
# From root - uses workspace filter
bun run desktop

# From desktop/ directory
bun run tauri dev
```

### Build Commands
```bash
# Development (frontend only)
cd desktop && bun run dev

# Production build (creates bundle)
cd desktop && bun run build
cd desktop && bun run tauri build
```

### Project Setup
- Uses **Bun** as the package manager (not npm/yarn)
- Rust toolchain required for Tauri backend
- VSCode extensions recommended: `Vue.volar`, `tauri-apps.tauri-vscode`, `rust-lang.rust-analyzer`

## Technology Stack Conventions

### Vue 3 (Frontend)
- Use `<script setup lang="ts">` syntax (Composition API)
- Global styles imported in `App.vue`: `import './styles/global.css'`
- Tailwind CSS v4 with Vite plugin (`@tailwindcss/vite`)
- Single global CSS file: `desktop/src/styles/global.css` imports Tailwind via `@import "tailwindcss"`
- **Dynamic Classes**: Always use Vue's `:class` binding for conditional/dynamic classes
  - Use array syntax with objects for conditional classes: `:class="['base-class', { 'conditional-class': condition }]"`
  - Never build class strings manually with computed properties using array.push() or string concatenation
  - Example: `:class="[{ 'text-lg': size === 'large', 'text-sm': size === 'small' }]"` instead of computed string building
- **Tailwind Custom Properties**: Use direct Tailwind utility classes, NOT `[var(...)]` syntax
  - ✅ Correct: `text-x-text-primary`, `bg-btn-primary`, `border-x-border`
  - ❌ Wrong: `text-[var(--color-x-text-primary)]`, `bg-[var(--color-btn-primary)]`, `border-[var(--color-x-border)]`
  - Custom properties defined in `@theme` in global.css automatically become Tailwind utilities
  - Example: `--color-x-text-primary` becomes `text-x-text-primary` utility class
- **Theme**: Modern, clean, minimal **black/white theme inspired by SpaceX** with glassmorphism aesthetics
- **Light & Dark Mode**: Full theme support with toggle button (`ThemeToggle.vue`)
  - Light mode: Clean white/light gray backgrounds with crisp frosted glass panels
  - Dark mode: Pure black/dark gray color scheme inspired by SpaceX's minimalist aesthetic with darker glass panels
  - Theme persists via localStorage and respects system preference on first load
- **Glassmorphism**: Frosted glass UI with backdrop blur effects
  - `.glass` class: Main glass panels with `backdrop-filter: blur(20px)`, `rgba(255,255,255,0.7)` backgrounds
  - `.glass-dark` class: Slightly more opaque variant for headers/sidebars
  - Dark mode automatically adapts glass panels to darker translucent backgrounds
- **Prefer Tailwind utility classes over custom CSS** - use inline classes in templates instead of `<style>` blocks
- Custom CSS should only be used for: theme variables (`@theme`), global resets, or complex animations not achievable with Tailwind
- Use CSS custom properties (e.g., `var(--color-x-blue)`) defined in `@theme` when Tailwind utilities aren't sufficient
- **Available theme colors** (defined in `@theme` in global.css, adapt in dark mode):
  - Background: `--color-x-dark`, `--color-x-darker` (light: #fafafa, #ffffff; dark: #1a1a1a, #0f0f0f)
  - Borders/UI: `--color-x-border`, `--color-x-hover`
  - Primary: `--color-x-blue` (light: #0066ff; dark: #3b82f6), `--color-x-blue-hover`, `--color-x-blue-light`
  - Accent: `--color-x-rocket` (orange #f97316)
  - Text: `--color-x-text-primary`, `--color-x-text-secondary`, `--color-x-text-muted` (adapt to light/dark)
  - Status: `--color-x-success`, `--color-x-error`, `--color-x-warning`
  - Buttons: `--color-btn-primary`, `--color-btn-primary-hover`, `--color-btn-primary-text`
- **Design principles**: Clean minimal aesthetics inspired by SpaceX's black/white design language, frosted glass panels, subtle shadows, smooth transitions (0.3s), backdrop blur effects, semi-transparent borders (white/30 opacity), high contrast black/white color scheme

#### Component Architecture
- All reusable components are located in `desktop/src/components/`
- Components use TypeScript with proper interface definitions for props and emits
- Follow Vue 3 Composition API patterns with `<script setup lang="ts">`
- Component naming: PascalCase for files (e.g., `CalendarView.vue`, `NoteItem.vue`)
- Props are defined using `defineProps<PropsInterface>()` with TypeScript interfaces
- Events are defined using `defineEmits<EmitsInterface>()` with typed event signatures
- Components should be self-contained and focused on a single responsibility
- Prefer props and events over complex state management for component communication
- Example components in the project:
  - `CalendarView.vue` - Calendar with date selection and note counts
  - `TagsPanel.vue` - Tag filtering interface
  - `NoteCreator.vue` - Note creation form
  - `NoteItem.vue` - Individual note display with edit/delete
  - `EmptyState.vue` - Empty state messaging
  - `SearchBar.vue` - Search input with clear functionality
  - `ThemeToggle.vue` - Light/dark mode toggle button

### Tauri (Backend)
- Commands defined with `#[tauri::command]` attribute in `lib.rs`
- Register new commands in `invoke_handler` macro: `tauri::generate_handler![greet, new_command]`
- Plugin system: Currently uses `tauri-plugin-opener` for external links
- Window configuration in `tauri.conf.json` (800x600 default window)

### Rust Specifics
- Library crate types: `["staticlib", "cdylib", "rlib"]`
- Dependencies: `serde`, `serde_json` for JSON serialization
- The `main.rs` is minimal - just calls `notes_lib::run()`

## Integration Patterns

### Frontend-Backend Communication
- Use `invoke()` from `@tauri-apps/api` to call Rust commands
- Example pattern from existing code:
  ```rust
  #[tauri::command]
  fn greet(name: &str) -> String {
      format!("Hello, {}!", name)
  }
  ```
- Access from Vue: Import `invoke` and call async: `await invoke('greet', { name: 'World' })`

### File Locations
- Tauri config: `desktop/src-tauri/tauri.conf.json`
- Capabilities/permissions: `desktop/src-tauri/capabilities/default.json`
- App icons: `desktop/src-tauri/icons/`
- Build artifacts: `desktop/dist` (frontend), `desktop/src-tauri/target` (Rust - gitignored)

## Project-Specific Notes

- **Identifier**: `com.crazypanda.notes` (used for app bundle)
- **License**: GPL-3.0
- Early stage project (README says "TODO", minimal implementation)
- Uses `better-sqlite3` types (devDependency) suggesting planned database integration
- Has Electron in devDependencies (legacy/alternate approach?)

## Development Tips

- Vite config prevents screen clearing to avoid obscuring Rust errors
- HMR watches exclude `src-tauri/**` to prevent unnecessary reloads
- Build scripts configured in `tauri.conf.json`: `beforeDevCommand`, `beforeBuildCommand`
- Target directory structure in Rust follows Windows conventions (`.dll`, `.pdb`, etc.)
