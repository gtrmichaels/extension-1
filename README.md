# Simple Browser Extension

A basic browser extension template that you can use as a starting point for your own extension.

## Structure

```
├── manifest.json       # Extension manifest file
├── popup.html         # Main popup interface
├── css/
│   └── popup.css      # Styles for the popup
├── js/
│   └── popup.js       # JavaScript for the popup
└── icons/             # Extension icons (you need to add these)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Installation

1. Open Chrome/Edge and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this directory

## Development

- Modify `popup.html` to change the extension's interface
- Style your extension in `css/popup.css`
- Add functionality in `js/popup.js`
- Update `manifest.json` to add permissions or change extension properties

## Adding Icons

Before using this extension, you'll need to add icon files in the following sizes:
- 16x16 pixels: `icons/icon16.png`
- 48x48 pixels: `icons/icon48.png`
- 128x128 pixels: `icons/icon128.png` 