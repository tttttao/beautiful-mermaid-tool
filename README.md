# Beautiful Mermaid Tool

A web-based Mermaid editor, previewer, and PNG exporter built with Vue 3, Vite, Tailwind CSS, Monaco Editor, and [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid).

Live site:
[https://tttttao.github.io/beautiful-mermaid-tool/](https://tttttao.github.io/beautiful-mermaid-tool/)

## Features

- Split-screen editing experience with Monaco on the left and a canvas preview on the right
- Realtime Mermaid rendering with debounce
- Zoom, pan, reset, and fullscreen preview interactions
- PNG export based on the rendered SVG
- Error-tolerant preview that keeps the last valid diagram visible
- GitHub Pages deployment via GitHub Actions

## Tech Stack

- Vue 3 with `<script setup>` and TypeScript
- Vite
- Tailwind CSS
- `beautiful-mermaid`
- `monaco-editor`
- `d3-selection` + `d3-zoom`
- Vitest + Vue Test Utils
- Playwright

## Getting Started

### Requirements

- Node.js 20+ recommended
- npm 10+ recommended

### Install

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

## Test Commands

Run unit/component tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## Project Structure

```text
src/
  components/
    MermaidEditor.vue
    MermaidCanvas.vue
    FloatingToolbar.vue
    FullscreenPreview.vue
  composables/
    useMermaidMonaco.ts
    useZoomPan.ts
  constants/
    defaultMermaidSource.ts
  types/
    mermaid.ts
  App.vue
```

## GitHub Pages Deployment

This repository is configured to deploy automatically to GitHub Pages through GitHub Actions.

Workflow file:
[`/.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)

The Vite `base` path is configured for project Pages deployment:

```ts
base: '/beautiful-mermaid-tool/'
```

To make deployment work in GitHub:

1. Open the repository settings.
2. Go to `Pages`.
3. Under `Build and deployment`, choose `GitHub Actions` as the source.
4. Push to `main`.

## Notes

- If you later move this project to a custom domain or to a user site repository such as `tttttao.github.io`, update the Vite `base` accordingly.
- Monaco is the heaviest part of the bundle, so production build output is expected to contain large chunks.

## License

[MIT](./LICENSE)
