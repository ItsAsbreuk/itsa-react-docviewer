/*global describe, it, before, after */

"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
const TestUtils = require("react-dom/test-utils");

const chai = require("chai");
const expect = chai.expect;
const equalJSX = require("chai-equal-jsx");
const renderer = TestUtils.createRenderer();

chai.use(equalJSX);

const Component = require("../lib/component.jsx");

describe("React Component", function () {

    before(function () {
        this.jsdom = require("jsdom-global")();
    });

    after(function () {
        this.jsdom();
    });

    it("Rendering component", function () {
        renderer.render(<Component />);
        const actual = renderer.getRenderOutput();
        const expected = (
            <div className="itsa-docviewer">
                <iframe
                    allowFullScreen={undefined}
                    frameBorder="0"
                    height="100%"
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
            <div className="itsa-docviewer">
                <iframe
                    allowFullScreen={true}
                    frameBorder="0"
                    height="100%"
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
            <div className="itsa-docviewer">
                <iframe
                    allowFullScreen={undefined}
                    frameBorder="0"
                    height="100%"
                    scrolling={true}
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
            <div className="itsa-docviewer dummy">
                <iframe
                    allowFullScreen={undefined}
                    frameBorder="0"
                    height="100%"
                    scrolling="auto"
                    src={undefined}
                    width="100%"
                />
            </div>
        );
        expect(actual).to.equalJSX(expected);
    });

});
