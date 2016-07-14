(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', 'react'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('react'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.React);
        global.TextTruncate = mod.exports;
    }
})(this, function (module, exports, _react) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _objectWithoutProperties(obj, keys) {
        var target = {};

        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }

        return target;
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var TextTruncate = function (_Component) {
        _inherits(TextTruncate, _Component);

        function TextTruncate() {
            var _Object$getPrototypeO;

            var _temp, _this, _ret;

            _classCallCheck(this, TextTruncate);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(TextTruncate)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.onResize = function () {
                window.requestAnimationFrame(_this.update.bind(_this));
            }, _this.update = function () {
                _this.forceUpdate();
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(TextTruncate, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var canvas = document.createElement('canvas');
                var docFragment = document.createDocumentFragment();
                var style = window.getComputedStyle(this.refs.scope);
                var font = [style['font-weight'], style['font-style'], style['font-size'], style['font-family']].join(' ');

                docFragment.appendChild(canvas);
                this.canvas = canvas.getContext('2d');
                this.canvas.font = font;
                this.forceUpdate();
                window.addEventListener('resize', this.onResize);
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                window.removeEventListener('resize', this.onResize);
            }
        }, {
            key: 'measureWidth',
            value: function measureWidth(text) {
                return this.canvas.measureText(text).width;
            }
        }, {
            key: 'getRenderText',
            value: function getRenderText() {
                var _props = this.props;
                var containerClassName = _props.containerClassName;
                var line = _props.line;
                var text = _props.text;
                var textTruncateChild = _props.textTruncateChild;
                var truncateText = _props.truncateText;

                var props = _objectWithoutProperties(_props, ['containerClassName', 'line', 'text', 'textTruncateChild', 'truncateText']);

                var scopeWidth = this.refs.scope.getBoundingClientRect().width;

                // return if display:none
                if (scopeWidth === 0) {
                    return null;
                }

                // return if all of text can be displayed
                if (scopeWidth >= this.measureWidth(text)) {
                    return _react2.default.createElement(
                        'div',
                        props,
                        text
                    );
                }

                var childText = '';
                if (textTruncateChild && typeof textTruncateChild.type === 'string') {
                    if (['span', 'a'].indexOf(textTruncateChild.type) > -1) {
                        childText = textTruncateChild.props.children;
                    }
                }

                var currentPos = 1;
                var maxTextLength = text.length;
                var truncatedText = '';
                var splitPos = 0;
                var startPos = 0;
                var displayLine = line;
                var width = 0;
                var lastIsEng = false;

                while (displayLine--) {
                    var ext = displayLine ? '' : truncateText + ' ' + childText;
                    while (currentPos <= maxTextLength) {
                        truncatedText = text.substr(startPos, currentPos);
                        width = this.measureWidth(truncatedText + ext);
                        if (width < scopeWidth) {
                            splitPos = text.indexOf(' ', currentPos + 1);
                            if (splitPos === -1) {
                                currentPos += 1;
                                lastIsEng = false;
                            } else {
                                lastIsEng = true;
                                currentPos = splitPos;
                            }
                        } else {
                            do {
                                currentPos--;
                                truncatedText = text.substr(startPos, currentPos);
                                if (truncatedText[truncatedText.length - 1] === ' ') {
                                    truncatedText = text.substr(startPos, currentPos - 1);
                                }
                                if (lastIsEng) {
                                    currentPos = truncatedText.lastIndexOf(' ');
                                    truncatedText = text.substr(startPos, currentPos);
                                }
                                width = this.measureWidth(truncatedText + ext);
                            } while (width >= scopeWidth);
                            startPos += currentPos;
                            break;
                        }
                    }

                    if (currentPos >= maxTextLength) {
                        startPos = maxTextLength;
                        break;
                    }
                }

                if (startPos === maxTextLength) {
                    return text;
                }
                return _react2.default.createElement(
                    'div',
                    props,
                    text.substr(0, startPos) + truncateText + ' ',
                    textTruncateChild
                );
            }
        }, {
            key: 'render',
            value: function render() {
                var _props2 = this.props;
                var text = _props2.text;
                var containerClassName = _props2.containerClassName;


                var renderText = text;
                if (this.refs.scope) {
                    renderText = this.getRenderText();
                }

                return _react2.default.createElement(
                    'div',
                    { ref: 'scope', className: containerClassName, style: { overflow: 'hidden' } },
                    renderText
                );
            }
        }]);

        return TextTruncate;
    }(_react.Component);

    TextTruncate.propTypes = {
        containerClassName: _react2.default.PropTypes.string,
        line: _react2.default.PropTypes.number,
        text: _react2.default.PropTypes.string,
        textTruncateChild: _react2.default.PropTypes.node,
        truncateText: _react2.default.PropTypes.string
    };
    TextTruncate.defaultProps = {
        line: 1,
        text: '',
        truncateText: '…'
    };
    exports.default = TextTruncate;
    ;
    module.exports = exports['default'];
});
