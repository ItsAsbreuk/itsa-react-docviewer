/*global describe, it, before, after */

import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";

import chai from "chai";
const expect = chai.expect;
import equalJSX from "chai-equal-jsx";
const renderer = TestUtils.createRenderer();

chai.use(equalJSX);

import Component from "../lib/component.jsx";

describe("React Component", function () {
  before(async function () {
    const jsdomGlobal = await import("jsdom-global");
    this.jsdom = jsdomGlobal.default();
  });

  after(function () {
    this.jsdom();
  });

  it("Rendering component", function () {
    renderer.render(<Component />);
    const actual = renderer.getRenderOutput();
    const expected = (
      <div className="itsa-docviewer" style={undefined}>
        <iframe
          allowFullScreen={undefined}
          frameBorder="0"
          height="100%"
          onLoad={function noRefCheck() {}}
          ref={function noRefCheck() {}}
          scrolling="auto"
          src={undefined}
          width="100%"
        />
      </div>
    );
    expect(actual).to.equalJSX(expected);
  });

  it("Rendering component with allowFullScreen", function () {
    renderer.render(<Component allowFullScreen={true} />);
    const actual = renderer.getRenderOutput();
    const expected = (
      <div className="itsa-docviewer" style={undefined}>
        <iframe
          allowFullScreen={true}
          frameBorder="0"
          height="100%"
          onLoad={function noRefCheck() {}}
          ref={function noRefCheck() {}}
          scrolling="auto"
          src={undefined}
          width="100%"
        />
        <div
          className="itsa-docviewer-full-screen"
          onClick={function noRefCheck() {}}
        />
      </div>
    );
    expect(actual).to.equalJSX(expected);
  });

  it("Rendering component with scrolling", function () {
    renderer.render(<Component scrolling={true} />);
    const actual = renderer.getRenderOutput();
    const expected = (
      <div className="itsa-docviewer" style={undefined}>
        <iframe
          allowFullScreen={undefined}
          frameBorder="0"
          height="100%"
          onLoad={function noRefCheck() {}}
          ref={function noRefCheck() {}}
          scrolling="true"
          src={undefined}
          width="100%"
        />
      </div>
    );
    expect(actual).to.equalJSX(expected);
  });

  it("Rendering component with className", function () {
    renderer.render(<Component className="dummy" />);
    const actual = renderer.getRenderOutput();
    const expected = (
      <div className="itsa-docviewer dummy" style={undefined}>
        <iframe
          allowFullScreen={undefined}
          frameBorder="0"
          height="100%"
          onLoad={function noRefCheck() {}}
          ref={function noRefCheck() {}}
          scrolling="auto"
          src={undefined}
          width="100%"
        />
      </div>
    );
    expect(actual).to.equalJSX(expected);
  });

  it("Rendering component with onload message", function () {
    renderer.render(<Component showLoadingMsg={true} />);
    const actual = renderer.getRenderOutput();
    const expected = (
      <div className="itsa-docviewer" style={undefined}>
        <iframe
          allowFullScreen={undefined}
          frameBorder="0"
          height="100%"
          onLoad={function noRefCheck() {}}
          ref={function noRefCheck() {}}
          scrolling="auto"
          src={undefined}
          width="100%"
        />
        <div className="itsa-docviewer-loading-msg">
          <div>loading...</div>
        </div>
      </div>
    );
    expect(actual).to.equalJSX(expected);
  });

  it("Rendering component with different onload message", function () {
    renderer.render(<Component loadingMsg="busy..." showLoadingMsg={true} />);
    const actual = renderer.getRenderOutput();
    const expected = (
      <div className="itsa-docviewer" style={undefined}>
        <iframe
          allowFullScreen={undefined}
          frameBorder="0"
          height="100%"
          onLoad={function noRefCheck() {}}
          ref={function noRefCheck() {}}
          scrolling="auto"
          src={undefined}
          width="100%"
        />
        <div className="itsa-docviewer-loading-msg">
          <div>busy...</div>
        </div>
      </div>
    );
    expect(actual).to.equalJSX(expected);
  });
});
