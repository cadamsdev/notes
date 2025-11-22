## [0.7.1](https://github.com/usenotex/notex/compare/v0.7.0...v0.7.1) (2025-11-22)

### 🐛 Bug Fixes
- Use auto resizable Textarea ([#69](https://github.com/usenotex/notex/pull/69))


## [0.7.0](https://github.com/usenotex/notex/compare/v0.6.0...v0.7.0) (2025-11-16)

### 🚀 New Features
- Can now collapse/expand notes ([#65](https://github.com/usenotex/notex/pull/65))

### 🐛 Bug Fixes
- Fix issue showing placeholder text ([ae981a7](https://github.com/usenotex/notex/commit/ae981a7))
- Showing the wrong app version in the settings modal ([943d024](https://github.com/usenotex/notex/commit/943d024))
- Update TAG_REGEX to ensure it captures tags starting with a letter ([1154ca8](https://github.com/usenotex/notex/commit/1154ca8))
- Fix create note textbox height ([b639b27](https://github.com/usenotex/notex/commit/b639b27))
- Fix some scrolling issues ([1d9ae2c](https://github.com/usenotex/notex/commit/1d9ae2c))
- Fix issue where tags are getting cut off when using hypens ([#67](https://github.com/usenotex/notex/pull/67))
- Fix showing vertical scrollbar in the notes list ([#64](https://github.com/usenotex/notex/pull/64))

### 🏠 Chores
- Cycle between only light and dark theme instead of 3 modes ([f4d671a](https://github.com/usenotex/notex/commit/f4d671a))
- Improve edit view ([#62](https://github.com/usenotex/notex/pull/62))

### 🎨 Styles
- Fix issue with code block border ([6f1bbf9](https://github.com/usenotex/notex/commit/6f1bbf9))
- Made improvements to light and dark theme ([#68](https://github.com/usenotex/notex/pull/68))
- Make the tags smaller ([83f73a4](https://github.com/usenotex/notex/commit/83f73a4))
- Improve the button styles ([#66](https://github.com/usenotex/notex/pull/66))

### ♻️ Refactors
- Use Vue scoped styles instead of Tailwind ([#59](https://github.com/usenotex/notex/pull/59))

### 🤖 Automation
- Check code formatting using prettier ([#61](https://github.com/usenotex/notex/pull/61))
- Added linting using oxlint ([#60](https://github.com/usenotex/notex/pull/60))


## [0.6.0](https://github.com/cadamsdev/notes/compare/v0.5.0...v0.6.0) (2025-11-13)

### ⚠️ Breaking Changes
- Complete Rewrite + Redesign with a focus on the desktop app ([#55](https://github.com/cadamsdev/notes/pull/55))

### 🚀 New Features
- Added a custom shiki code block ([#54](https://github.com/cadamsdev/notes/pull/54))

### 🐛 Bug Fixes
- Set a better default value for APU_URL env var ([f2f993d](https://github.com/cadamsdev/notes/commit/f2f993d))
- Showing tags when they are adding or removed ([7a0a54b](https://github.com/cadamsdev/notes/commit/7a0a54b))
- Create database.sqlite file if it does not exist ([08227da](https://github.com/cadamsdev/notes/commit/08227da))
- Turn off autocomplete and spellcheck on the TagCombobox input ([0c3daa3](https://github.com/cadamsdev/notes/commit/0c3daa3))

### 🏠 Chores
- Show create note button when there's no notes ([5db9550](https://github.com/cadamsdev/notes/commit/5db9550))
- Create API_URL env var ([cc29aea](https://github.com/cadamsdev/notes/commit/cc29aea))

### 🤖 Automation
- Fix issue with Release PR markdown ([fc864cc](https://github.com/cadamsdev/notes/commit/fc864cc))