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
    BASE_URL = "https://docs.google.com/viewer?embedded=true&url=",
    MAIN_CLASS = "itsa-docviewer",
    MAIN_CLASS_PREFIX = MAIN_CLASS+"-",
    IS_NODE = require("itsa-utils").isNode,
    PropTypes = require("prop-types");

// polyfill Element.requestFullScreen:
if (!IS_NODE) {
    (function(ElementPrototype) {
        ElementPrototype.requestFullScreen ||
        (ElementPrototype.requestFullScreen = ElementPrototype.webkitRequestFullScreen ||
                                              ElementPrototype.mozRequestFullScreen ||
                                              ElementPrototype.msRequestFullScreen);
    }(window.Element.prototype));

}

class Component extends React.Component {
    constructor(props) {
        super(props);
        const instance = this;
        instance.fullScreen = instance.fullScreen.bind(instance);
    }

    /**
     * Will show the content into the full screen. Only if `props.allowFullScreen`===true.
     *
     * @method fullScreen
     * @since 0.0.1
     */
    fullScreen() {
        this.props.allowFullScreen && this._iframeNode.requestFullScreen && this._iframeNode.requestFullScreen();
    }

    /**
     * React render-method --> renderes the Component.
     *
     * @method render
     * @return ReactComponent
     * @since 15.0.0
     */
    render() {
        let className = MAIN_CLASS,
            source, fullscreenBtn, scrolling;
        const props = this.props,
            propsClass = props.className;

        scrolling = props.scrolling;
        (typeof scrolling==='boolean') && (scrolling=scrolling.toString());
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
                    ref={node => this._iframeNode = node}
                    scrolling={props.scrolling}
                    src={source}
                    width="100%" />
                {fullscreenBtn}
            </div>
        );
    }

}

Component.propTypes = {
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
     * @type String|Boolean
     * @since 15.0.0
    */
    scrolling: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

    /**
     * The url of the document to be viewed. May be absolute or relative.
     *
     * @property src
     * @type String
     * @since 15.0.0
    */
    src: PropTypes.string.isRequired
};

Component.defaultProps = {
    scrolling: "auto"
};

module.exports = Component;
