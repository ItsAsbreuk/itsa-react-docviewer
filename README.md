[![Build Status](https://travis-ci.org/ItsAsbreuk/itsa-react-docviewer.svg?branch=master)](https://travis-ci.org/ItsAsbreuk/itsa-react-docviewer)

React component that views documents. Supports Google Doc Viewer for remote documents and native browser rendering for local files (PDF, images, HTML, text, and more).

## How to use:

```js
import ReactDOM from "react-dom";
import Component from "itsa-react-docviewer";

// Remote document via Google Doc Viewer (default for non-browser-native formats)
const props = {
  allowFullScreen: true,
  src: "http://projects.itsasbreuk.nl/react-components/itsa-docviewer/example.pdf",
};

ReactDOM.render(
  <Component {...props} />,
  document.getElementById("component-container"),
);
```

## Viewer modes

The `viewer` prop controls how documents are rendered:

| Value              | Description                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"auto"` (default) | Auto-detects based on file extension. Browser-native formats (PDF, images, HTML, text, SVG, video, audio) render directly in an iframe. All other formats use Google Doc Viewer. |
| `"google"`         | Always uses Google Doc Viewer. Requires the document to be at a publicly accessible URL.                                                                                         |
| `"browser"`        | Always renders directly in an iframe. Works with local paths, relative URLs, Blob URLs, and data URIs.                                                                           |

### Examples

```js
// Auto-detect: PDF files render natively in the browser
<Component src="/local/documents/report.pdf" />

// Auto-detect: DOCX files go through Google Doc Viewer
<Component src="https://example.com/report.docx" />

// Force browser-native rendering (e.g., for a local PDF)
<Component src="/files/invoice.pdf" viewer="browser" />

// Force Google Doc Viewer (e.g., for a remote PDF you want Google to render)
<Component src="https://example.com/report.pdf" viewer="google" />

// Works with Blob URLs (from file input, fetch, etc.)
<Component src={blobUrl} viewer="browser" />
```

### Browser-native formats (auto-detected)

These file types render directly in the browser iframe without Google Doc Viewer:

- **PDF**: `.pdf`
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.svg`, `.webp`, `.avif`, `.ico`
- **Web**: `.html`, `.htm`
- **Text**: `.txt`, `.csv`, `.xml`, `.json`, `.css`, `.js`
- **Video**: `.mp4`, `.webm`, `.ogg`
- **Audio**: `.mp3`, `.wav`

## About the css

You need the right css in order to make use of `itsa-react-docviewer`. There are 2 options:

1. You can use the css-files inside the `css`-folder.
2. You can use: `import Component from 'itsa-react-docviewer/styled';` and build your project with `webpack` or `vite`. This is needed, because you need the right plugin to handle the `scss`-file.

[View live example](http://projects.itsasbreuk.nl/react-components/itsa-docviewer/component.html)

[API](http://projects.itsasbreuk.nl/react-components/itsa-docviewer/api/)

#### If you want to express your appreciation

Feel free to donate to one of these addresses; my thanks will be great :)

- Ether: 0xE096EBC2D19eaE7dA8745AA5D71d4830Ef3DF963
- Bitcoin: 37GgB6MrvuxyqkQnGjwxcn7vkcdont1Vmg
