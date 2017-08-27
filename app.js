"use strict";

const React = require("react"),
    ReactDOM = require("react-dom"),
    Component = require("./lib/component-styled.jsx");

const props = {
    allowFullScreen: false,
    showLoadingMsg: true,
    src: "http://projects.itsasbreuk.nl/react-components/itsa-docviewer/example.pdf"
};

ReactDOM.render(
    <Component {...props} />,
    document.getElementById("component-container")
);
