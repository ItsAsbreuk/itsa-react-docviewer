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

require("itsa-jsext");

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
        instance.state = {
            loading: true
        };
        instance._ready = Promise.itsa_manage();
        instance.fullScreen = instance.fullScreen.bind(instance);
        instance.handleSrcLoad = instance.handleSrcLoad.bind(instance);
    }

    componentDidUpdate(prevProps) {
        const instance = this,
            props = instance.props;
        // console.warn('docviewer componentDidUpdate');
        if (prevProps.src!==props.src) {
            // console.warn('docviewer componentDidUpdate reset promise', prevProps.src, props.src);
            instance._ready = Promise.itsa_manage();
            if (props.src) {
                instance.setState({
                    loading: true
                });
            }
            else {
                instance.setState({loading: false}, function() {
                    // console.warn('docviewer componentDidUpdate no src fulfilling promise');
                    instance._ready.fulfill();
                });
            }
        }
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

    print() { // return a Promise!
        console.warn('docviewer.print', this.props.src);
        const instance = this;
        if (instance.props.src) {
            console.warn('docviewer.printing waiting for src to be loaded');
            return instance._ready.then(function() {
                console.warn('docviewer.printing', instance.props.src);
                const win = instance._iframeNode.contentWindow || instance._iframeNode;
                if (typeof win.print==='function') {
                    win.print();
                }
            });
        }
        return Promise.resolve();
    }

    /**
     * Hides the "load-message" as specified by this.props.loadingMsg
     *
     * @method handleSrcLoad
     * @since 16.0.5
     */
    handleSrcLoad() {
        const instance = this;
        instance.setState({loading: false}, function() {
            // console.warn('docviewer handleSrcLoad fulfilling promise', instance.props.src);
            instance._ready.fulfill();
        });
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
            source, fullscreenBtn, scrolling, loadingMsg;
        const instance = this,
            props = instance.props,
            propsClass = props.className;

        scrolling = props.scrolling;
        (typeof scrolling==='boolean') && (scrolling=scrolling.toString());
        source = props.src;
        if (!IS_NODE && source) {
            if ((source.substr(0, 7).toLowerCase()!=="http://") && (source.substr(0, 8).toLowerCase()!=="https://")) {
               source = window.location.protocol + "//" + window.location.host + source;
            }
            source = encodeURI(BASE_URL + source);
        }
        propsClass && (className+=" "+propsClass);
        if (props.allowFullScreen) {
            fullscreenBtn = (
                <div
                    className={MAIN_CLASS_PREFIX+"full-screen"}
                    onClick={instance.fullScreen} />
            );
        }
        if (instance.state.loading && props.showLoadingMsg) {
            loadingMsg = (
                <div className={MAIN_CLASS_PREFIX+"loading-msg"}>
                    <div>{props.loadingMsg}</div>
                </div>
            );
        }
        return (
            <div className={className} style={props.style}>
                <iframe
                    allowFullScreen={props.allowFullScreen}
                    frameBorder="0"
                    height="100%"
                    onLoad={instance.handleSrcLoad}
                    ref={node => instance._iframeNode = node}
                    scrolling={props.scrolling}
                    src={source}
                    width="100%" />
                {fullscreenBtn}
                {loadingMsg}
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
     * The message that shows while the document gets loaded
     *
     * @property loadingMsg
     * @default "loading..."
     * @type String
     * @since 16.0.5
    */
    loadingMsg: PropTypes.string,

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
     * Whether to show a message (this.props.loadingMsg) during document load
     *
     * @property showLoadingMsg
     * @default false
     * @type Boolean
     * @since 16.0.5
    */
    showLoadingMsg: PropTypes.bool,

    /**
     * The url of the document to be viewed. May be absolute or relative.
     *
     * @property src
     * @type String
     * @since 15.0.0
    */
    src: PropTypes.string
};

Component.defaultProps = {
    loadingMsg: "loading...",
    scrolling: "auto",
    showLoadingMsg: false
};

module.exports = Component;
