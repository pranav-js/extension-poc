# Vue Chrome Extension

A modern Chrome extension built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- Built with Vue 3 and TypeScript
- Styled with Tailwind CSS
- Modern development environment with Vite
- Chrome Extension Manifest V3 support
- Hot Module Replacement (HMR) during development

## Prerequisites

- Node.js (v16 or higher)
- pnpm
- Chrome browser

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vue-chrome-extension
```

2. Install dependencies:
```bash
pnpm install
```

## Development

To start the development server:

```bash
pnpm dev
```

This will:
- Start Vite dev server
- Enable HMR
- Watch for file changes

## Building for Production

To build the extension:

```bash
pnpm build
```

The built extension will be in the `dist` directory.

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` directory

## Project Structure

```
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Vue components
│   ├── manifest.json   # Chrome extension manifest
│   ├── App.vue         # Root component
│   └── main.ts         # Entry point
├── public/             # Public static assets
└── dist/              # Built extension
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code
- `pnpm format` - Format code

## License

ISC 