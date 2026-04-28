/**
 * React component that views documents.
 * Supports Google Doc Viewer for remote documents and native browser viewing
 * for local/browser-compatible files (PDF, images, HTML, text, SVG).
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

import "itsa-jsext";

import React from "react";
import itsaUtils from "itsa-utils";
import PropTypes from "prop-types";

const IS_NODE = itsaUtils.isNode;

const GOOGLE_VIEWER_URL = "https://docs.google.com/viewer?embedded=true&url=",
  MAIN_CLASS = "itsa-docviewer",
  MAIN_CLASS_PREFIX = MAIN_CLASS + "-",
  BROWSER_NATIVE_EXTENSIONS = [
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".svg",
    ".webp",
    ".avif",
    ".ico",
    ".html",
    ".htm",
    ".txt",
    ".csv",
    ".xml",
    ".json",
    ".css",
    ".js",
    ".mp4",
    ".webm",
    ".ogg",
    ".mp3",
    ".wav",
  ];

/**
 * Determines the effective viewer mode based on props and file extension.
 *
 * @method getViewerMode
 * @param {String} viewer - The viewer prop value: 'auto', 'google', or 'browser'
 * @param {String} src - The source URL
 * @return {String} 'google' or 'browser'
 * @private
 * @since 17.1.0
 */
const getViewerMode = function (viewer, src) {
  if (viewer === "google" || viewer === "browser") {
    return viewer;
  }
  // auto mode: detect from file extension
  if (src) {
    // strip query string and hash, then get extension
    const cleanPath = src.split("?")[0].split("#")[0].toLowerCase();
    const dotIndex = cleanPath.lastIndexOf(".");
    if (dotIndex !== -1) {
      const ext = cleanPath.substring(dotIndex);
      if (BROWSER_NATIVE_EXTENSIONS.indexOf(ext) !== -1) {
        return "browser";
      }
    }
  }
  return "google";
};

// polyfill Element.requestFullscreen:
if (!IS_NODE) {
  (function (ElementPrototype) {
    ElementPrototype.requestFullscreen ||
      (ElementPrototype.requestFullscreen =
        ElementPrototype.webkitRequestFullscreen ||
        ElementPrototype.webkitRequestFullScreen ||
        ElementPrototype.mozRequestFullScreen ||
        ElementPrototype.msRequestFullscreen);
  })(window.Element.prototype);
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    const instance = this;
    instance.state = {
      loading: true,
    };
    instance._mounted = true;
    instance._ready = Promise.itsa_manage();
    instance.fullScreen = instance.fullScreen.bind(instance);
    instance.handleSrcLoad = instance.handleSrcLoad.bind(instance);
  }

  componentDidUpdate(prevProps) {
    const instance = this,
      props = instance.props;
    if (prevProps.src !== props.src) {
      instance._ready = Promise.itsa_manage();
      if (props.src) {
        instance.setState({
          loading: true,
        });
      } else {
        instance.setState({ loading: false }, function () {
          instance._ready.fulfill();
        });
      }
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  /**
   * Will show the content into the full screen. Only if `props.allowFullScreen`===true.
   *
   * @method fullScreen
   * @since 0.0.1
   */
  fullScreen() {
    this.props.allowFullScreen &&
      this._iframeNode.requestFullscreen &&
      this._iframeNode.requestFullscreen();
  }

  /**
   * Prints the document content. Returns a Promise that resolves after printing.
   *
   * @method print
   * @return Promise
   * @since 15.0.0
   */
  print() {
    // return a Promise!
    const instance = this;
    if (instance.props.src) {
      return instance._ready.then(function () {
        if (instance._mounted && instance._iframeNode) {
          const win =
            instance._iframeNode.contentWindow || instance._iframeNode;
          if (typeof win.print === "function") {
            win.print();
          }
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
    if (instance._mounted) {
      instance.setState({ loading: false }, function () {
        instance._ready.fulfill();
      });
    }
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
      source,
      fullscreenBtn,
      scrolling,
      loadingMsg;
    const instance = this,
      props = instance.props,
      propsClass = props.className;

    scrolling = props.scrolling;
    typeof scrolling === "boolean" && (scrolling = scrolling.toString());
    source = props.src;

    if (!IS_NODE && source) {
      const viewerMode = getViewerMode(props.viewer, source);
      if (viewerMode === "google") {
        // Google Doc Viewer: needs an absolute, publicly accessible URL
        if (
          source.substr(0, 7).toLowerCase() !== "http://" &&
          source.substr(0, 8).toLowerCase() !== "https://"
        ) {
          source =
            window.location.protocol + "//" + window.location.host + source;
        }
        source = GOOGLE_VIEWER_URL + encodeURIComponent(source);
      }
      // else 'browser': pass source as-is to the iframe (works with local/relative paths)
    }
    propsClass && (className += " " + propsClass);
    if (props.allowFullScreen) {
      fullscreenBtn = (
        <div
          className={MAIN_CLASS_PREFIX + "full-screen"}
          onClick={instance.fullScreen}
        />
      );
    }
    if (instance.state.loading && props.showLoadingMsg) {
      loadingMsg = (
        <div className={MAIN_CLASS_PREFIX + "loading-msg"}>
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
          ref={(node) => (instance._iframeNode = node)}
          scrolling={scrolling}
          src={source}
          width="100%"
        />
        {fullscreenBtn}
        {loadingMsg}
      </div>
    );
  }
}

Component.displayName = "DocViewer";

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
  src: PropTypes.string,

  /**
   * Inline styles for the main wrapper div.
   *
   * @property style
   * @type Object
   * @since 15.0.0
   */
  style: PropTypes.object,

  /**
   * Which viewer to use for rendering the document.
   *
   * - `"auto"` (default): Auto-detect based on file extension. Browser-native formats
   *   (PDF, images, HTML, text, SVG, video, audio) use the browser's built-in viewer.
   *   All other formats use Google Doc Viewer.
   * - `"google"`: Always use Google Doc Viewer (requires publicly accessible URL).
   * - `"browser"`: Always use the browser's native rendering via iframe
   *   (works with local/relative paths, Blob URLs, and data URIs).
   *
   * @property viewer
   * @default "auto"
   * @type String
   * @since 17.1.0
   */
  viewer: PropTypes.oneOf(["auto", "google", "browser"]),
};

Component.defaultProps = {
  loadingMsg: "loading...",
  scrolling: "auto",
  showLoadingMsg: false,
  viewer: "auto",
};

export default Component;
