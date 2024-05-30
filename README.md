# Notes
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/cadamsdev/notes/issues)

![Screenshot_30-5-2024_05459_chad lan](https://github.com/cadamsdev/notes/assets/12568665/e7c2fcc1-d56c-4413-b257-8337d93db741)

## Why another note app?
For taking technical notes I wanted a note taking app that has...
- Simple like Apple notes (but has code syntax highlighting)
- Block-based editor like Notion
- Works offline (Like Obsidian)
- Uses tags instead of a folder structure
  - Don't have to worry about categorizing your notes in a hierarchy, just create the note.
  - To categorize the notes add a tag (Also will help you find it)
- Works on Windows, Linux or Mac
- Self hostable
- Privacy respecting (no telemetry, no selling data)
- Secure
- Highly configurable
- Free and open-source

## Roadmap
- Search by tags (Improved search)
- More blocks
- Light mode (currently only dark mode)
- Settings page
- AI Integration
- Password protected notes
- Graph view (like Obsidian)
- Plugins (Extensible)
- Desktop app
- Mobile app
- Support more architectures

## Supported architectures
| Architecture    | Support |
| -------- | ------- |
| x86-64 (AMD64)  | ✅ |
| ARM64 | ✅ |
| x86 (32-bit) | ❌ |

## Current Features
- Self-hostable
- Create notes
- Search notes
- Add tags to notes
- Delete tags
- Block editor
    - Headings (h1, h2, 3)
    - Paragraphs
    - Bulleted list
    - Numbered lists
    - Inline code 
    - Code blocks 

## Local development
1. Npm install
```
npm install
```
2. Start web-app
```
npm run web:dev
```
3. Navigate to http://localhost:5173/

## Self hosting with Docker
1. Pull docker image
```
docker pull cadamsdev/notes:latest
```
2. Run docker container
```
docker run -d -p 4173:4173 -v ~/.notes:/app/data --name notes cadamsdev/notes
```
