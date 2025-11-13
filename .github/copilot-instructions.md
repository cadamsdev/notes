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
- Global styles imported in `App.vue`: `import './styles/theme.css'` and `import './styles/global.css'`
- Tailwind CSS v4 with Vite plugin (`@tailwindcss/vite`)
- Theme system uses `desktop/src/styles/theme.css` with `@theme` directive
- **Dynamic Classes**: Always use Vue's `:class` binding for conditional/dynamic classes
  - Use array syntax with objects for conditional classes: `:class="['base-class', { 'conditional-class': condition }]"`
  - Never build class strings manually with computed properties using array.push() or string concatenation
  - Example: `:class="[{ 'text-lg': size === 'large', 'text-sm': size === 'small' }]"` instead of computed string building
- **Tailwind Custom Properties**: Use direct Tailwind utility classes based on theme tokens
  - Custom properties defined in `@theme` in theme.css automatically become Tailwind utilities
  - Example: `--color-text-primary` becomes `text-text-primary` utility class
  - Example: `--color-surface` becomes `bg-surface` utility class
- **Theme System**: Two-tier token architecture for maintainability
  - **Base Tokens** (named after color/value): Raw values like `--color-gray-100`, `--color-gray-200`, etc.
    - Grayscale: `gray-100` (lightest) through `gray-900` (darkest)
    - Typography: `font-family-base`, `font-family-mono`
  - **Semantic Tokens** (named after purpose): Context-specific tokens that reference base tokens
    - Backgrounds: `background`, `background-overlay`
    - Surfaces: `surface`, `surface-hover`, `surface-active`
    - Borders: `border`, `border-hover`, `border-active`
    - Text: `text-primary`, `text-secondary`
  - **Always use semantic tokens** in components (e.g., `text-text-primary`, `bg-surface`, `border-border`)
  - Semantic tokens automatically adapt to light/dark mode via `body.dark` overrides
- **Light & Dark Mode**: Full theme support with toggle button (`ThemeToggle.vue`)
  - Light mode: Uses lighter grayscale values (`gray-100`, `gray-200`, `gray-700`)
  - Dark mode: Uses darker grayscale values (`gray-800`, `gray-900`, `gray-200`)
  - Theme persists via localStorage and respects system preference on first load
  - Dark mode class added to `<body>` element: `body.dark`
- **Prefer Tailwind utility classes over custom CSS** - use inline classes in templates instead of `<style>` blocks
- Custom CSS should only be used for: theme variables (`@theme`), global resets, or complex animations not achievable with Tailwind
- **Design principles**: Clean minimal aesthetics with semantic color system, subtle shadows, smooth transitions (0.3s), high contrast for readability

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
