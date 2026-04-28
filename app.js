import React from "react";
import ReactDOM from "react-dom";
import Component from "./lib/component-styled.jsx";

const props = {
  allowFullScreen: false,
  showLoadingMsg: true,
  src: "http://projects.itsasbreuk.nl/react-components/itsa-docviewer/example.pdf",
};

ReactDOM.render(
  <Component {...props} />,
  document.getElementById("component-container"),
);
