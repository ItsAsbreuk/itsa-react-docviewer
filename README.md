[![Build Status](https://travis-ci.org/ItsAsbreuk/COMPONENT_NAME.svg?branch=master)](https://travis-ci.org/ItsAsbreuk/COMPONENT_NAME)

React component that views documents using Google Doc Viewer

Lightweight, focussable and responses to the spacebar.

## How to use:

```js
const ReactDOM = require("react-dom"),
    Component = require("itsa-react-docviewer/lib/component-styled.jsx");

const props = {
    allowFullScreen: true,
    src: "http://projects.itsasbreuk.nl/react-components/itsa-docviewer/example.pdf"
};

ReactDOM.render(
    <Component {...props} />,
    document.getElementById("component-container")
);
```

## About the css

You need the right css in order to make use of `itsa-react-checkbox`. There are 2 options:

1. You can use the css-files inside the `css`-folder.
2. You can use: `Component = require("itsa-react-docviewer/lib/component-styled.jsx");` and build your project with `webpack`. This is needed, because you need the right plugin to handle a requirement of the `scss`-file.


[View live example](http://projects.itsasbreuk.nl/react-components/itsa-docviewer/component.html)

[API](http://projects.itsasbreuk.nl/react-components/itsa-docviewer/api/)