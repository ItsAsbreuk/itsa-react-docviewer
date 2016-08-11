"use strict";

/**
 * React component that views documents using Google Doc Viewer.
 *
 *
 *
 * <i>Copyright (c) 2016 ItsAsbreuk - http://itsasbreuk.nl</i><br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module component.jsx
 * @class Component
 * @since 15.0.0
*/

const React = require("react"),
    ReactDom = require("react-dom"),
    BASE_URL = "https://docs.google.com/viewer?embedded=true&toolbar=hide&url=",
    MAIN_CLASS = "itsa-docviewer",
    MAIN_CLASS_PREFIX = MAIN_CLASS+"-",
    IS_NODE = require("itsa-utils").isNode,
    PropTypes = React.PropTypes;

// polyfill Element.requestFullScreen:
if (!IS_NODE) {
    (function(ElementPrototype) {
        ElementPrototype.requestFullScreen ||
        (ElementPrototype.requestFullScreen = ElementPrototype.webkitRequestFullScreen ||
                                              ElementPrototype.mozRequestFullScreen ||
                                              ElementPrototype.msRequestFullScreen);
    }(window.Element.prototype));

}

const Component = React.createClass({

    propTypes: {
        /**
         * Allowed to be displayed into full screen mode, by calling `fullScreen()`
         *
         * @property allowFullScreen
         * @type Boolean
         * @since 15.0.0
        */
        allowFullScreen: PropTypes.bool,

        /**
         * Any class to be set on the main component.
         *
         * @property className
         * @type String
         * @since 15.0.0
        */
        className: PropTypes.string,

        /**
         * Whether the browser should provide a scroll bar when needed.
         * Either `auto`, `yes` or `no`
         *
         * @property scrolling
         * @default "auto"
         * @type String
         * @since 15.0.0
        */
        scrolling: PropTypes.string,

        /**
         * The url of the document to be viewed. May be absolute or relative.
         *
         * @property src
         * @type String
         * @since 15.0.0
        */
        src: PropTypes.string.isRequired
    },

    /**
     * componentDidMount will call `this.activatePlaces()`;
     *
     * @method componentDidMount
     * @since 0.0.1
     */
    componentDidMount() {
        this._iframeNode = ReactDom.findDOMNode(this).firstChild;
    },

    /**
     * Will show the content into the full screen. Only if `props.allowFullScreen`===true.
     *
     * @method fullScreen
     * @since 0.0.1
     */
    fullScreen() {
        this.props.allowFullScreen && this._iframeNode.requestFullScreen && this._iframeNode.requestFullScreen();
    },

    /**
     * Defines the default props.
     *
     * @method getDefaultProps
     * @since 0.0.1
     */
    getDefaultProps() {
        return {
            scrolling: "auto"
        };
    },

    /**
     * React render-method --> renderes the Component.
     *
     * @method render
     * @return ReactComponent
     * @since 15.0.0
     */
    render() {
        let className = MAIN_CLASS,
            source, fullscreenBtn;
        const props = this.props,
            propsClass = props.className;

        source = props.src;
        if (!IS_NODE && (source.substr(0, 7).toLowerCase()!=="http://") && (source.substr(0, 8).toLowerCase()!=="https://")) {
           source = window.location.protocol + "//" + window.location.host + source;
        }
        propsClass && (className+=" "+propsClass);
        IS_NODE || (source=encodeURI(BASE_URL + source));
        if (props.allowFullScreen) {
            fullscreenBtn = (
                <div
                    className={MAIN_CLASS_PREFIX+"full-screen"}
                    onClick={this.fullScreen} />
            );
        }
        return (
            <div className={className}>
                <iframe
                    allowFullScreen={props.allowFullScreen}
                    frameBorder="0"
                    height="100%"
                    scrolling={props.scrolling}
                    src={source}
                    width="100%" />
                {fullscreenBtn}
            </div>
        );
    }

});

module.exports = Component;
