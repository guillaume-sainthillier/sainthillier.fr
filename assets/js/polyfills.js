/* Polyfill service DEVELOPMENT MODE - for live use set NODE_ENV to 'production'
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 *
 * Features requested: Element.prototype.append,Element.prototype.matches,CustomEvent,fetch,defaults,es5,es6,es7
 *
 * - _mutation, License: CC0 (required by "Element.prototype.append")
 * - Element.prototype.append, License: CC0
 * - Element.prototype.matches, License: CC0
 * - Event, License: CC0 (required by "CustomEvent")
 * - CustomEvent, License: CC0
 * - URL, License: CC0-1.0 (required by "fetch")
 * - fetch, License: MIT
 *
 * These features were not recognised:
 * - defaults */

(function (self, undefined) {
    // _mutation
    var _mutation = (function () {
        // eslint-disable-line no-unused-vars

        function isNode(object) {
            // DOM, Level2
            if (typeof Node === 'function') {
                return object instanceof Node;
            }
            // Older browsers, check if it looks like a Node instance)
            return (
                object && typeof object === 'object' && object.nodeName && object.nodeType >= 1 && object.nodeType <= 12
            );
        }

        // http://dom.spec.whatwg.org/#mutation-method-macro
        return function mutation(nodes) {
            if (nodes.length === 1) {
                return isNode(nodes[0]) ? nodes[0] : document.createTextNode(nodes[0] + '');
            }

            var fragment = document.createDocumentFragment();
            for (var i = 0; i < nodes.length; i++) {
                fragment.appendChild(isNode(nodes[i]) ? nodes[i] : document.createTextNode(nodes[i] + ''));
            }
            return fragment;
        };
    })();
    if (!('Element' in self && 'append' in Element.prototype)) {
        // Element.prototype.append
        /* global _mutation */
        Document.prototype.append = Element.prototype.append = function append() {
            this.appendChild(_mutation(arguments));
        };
    }

    if (!('document' in self && 'matches' in document.documentElement)) {
        // Element.prototype.matches
        Element.prototype.matches =
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            function matches(selector) {
                var element = this;
                var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
                var index = 0;

                while (elements[index] && elements[index] !== element) {
                    ++index;
                }

                return !!elements[index];
            };
    }

    if (
        !(function (n) {
            if (!('Event' in n)) return !1;
            try {
                return new Event('click'), !0;
            } catch (n) {
                return !1;
            }
        })(self)
    ) {
        // Event
        (function () {
            // This polyfill depends on availability of `document` so will not run in a worker
            // However, we asssume there are no browsers with worker support that lack proper
            // support for `Event` within the worker
            if (typeof document === 'undefined' || typeof window === 'undefined') return;

            var existingProto = (window.Event && window.Event.prototype) || null;
            function Event(type, eventInitDict) {
                if (!type) {
                    throw new Error('Not enough arguments');
                }

                var event;
                // Shortcut if browser supports createEvent
                if ('createEvent' in document) {
                    event = document.createEvent('Event');
                    var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
                    var cancelable =
                        eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

                    event.initEvent(type, bubbles, cancelable);

                    return event;
                }

                event = document.createEventObject();

                event.type = type;
                event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
                event.cancelable =
                    eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

                return event;
            }
            Event.NONE = 0;
            Event.CAPTURING_PHASE = 1;
            Event.AT_TARGET = 2;
            Event.BUBBLING_PHASE = 3;
            window.Event = Window.prototype.Event = Event;
            if (existingProto) {
                Object.defineProperty(window.Event, 'prototype', {
                    configurable: false,
                    enumerable: false,
                    writable: true,
                    value: existingProto,
                });
            }

            if (!('createEvent' in document)) {
                window.addEventListener =
                    Window.prototype.addEventListener =
                    Document.prototype.addEventListener =
                    Element.prototype.addEventListener =
                        function addEventListener() {
                            var element = this,
                                type = arguments[0],
                                listener = arguments[1];

                            if (!element._events) {
                                element._events = {};
                            }

                            if (!element._events[type]) {
                                element._events[type] = function (event) {
                                    var list = element._events[event.type].list,
                                        events = list.slice(),
                                        index = -1,
                                        length = events.length,
                                        eventElement;

                                    event.preventDefault = function preventDefault() {
                                        if (event.cancelable !== false) {
                                            event.returnValue = false;
                                        }
                                    };

                                    event.stopPropagation = function stopPropagation() {
                                        event.cancelBubble = true;
                                    };

                                    event.stopImmediatePropagation = function stopImmediatePropagation() {
                                        event.cancelBubble = true;
                                        event.cancelImmediate = true;
                                    };

                                    event.currentTarget = element;
                                    event.relatedTarget = event.fromElement || null;
                                    event.target = event.target || event.srcElement || element;
                                    event.timeStamp = new Date().getTime();

                                    if (event.clientX) {
                                        event.pageX = event.clientX + document.documentElement.scrollLeft;
                                        event.pageY = event.clientY + document.documentElement.scrollTop;
                                    }

                                    while (++index < length && !event.cancelImmediate) {
                                        if (index in events) {
                                            eventElement = events[index];

                                            if (list.includes(eventElement) && typeof eventElement === 'function') {
                                                eventElement.call(element, event);
                                            }
                                        }
                                    }
                                };

                                element._events[type].list = [];

                                if (element.attachEvent) {
                                    element.attachEvent('on' + type, element._events[type]);
                                }
                            }

                            element._events[type].list.push(listener);
                        };

                window.removeEventListener =
                    Window.prototype.removeEventListener =
                    Document.prototype.removeEventListener =
                    Element.prototype.removeEventListener =
                        function removeEventListener() {
                            var element = this,
                                type = arguments[0],
                                listener = arguments[1],
                                index;

                            if (element._events && element._events[type] && element._events[type].list) {
                                index = element._events[type].list.indexOf(listener);

                                if (index !== -1) {
                                    element._events[type].list.splice(index, 1);

                                    if (!element._events[type].list.length) {
                                        if (element.detachEvent) {
                                            element.detachEvent('on' + type, element._events[type]);
                                        }
                                        delete element._events[type];
                                    }
                                }
                            }
                        };

                window.dispatchEvent =
                    Window.prototype.dispatchEvent =
                    Document.prototype.dispatchEvent =
                    Element.prototype.dispatchEvent =
                        function dispatchEvent(event) {
                            if (!arguments.length) {
                                throw new Error('Not enough arguments');
                            }

                            if (!event || typeof event.type !== 'string') {
                                throw new Error('DOM Events Exception 0');
                            }

                            var element = this,
                                type = event.type;

                            try {
                                if (!event.bubbles) {
                                    event.cancelBubble = true;

                                    var cancelBubbleEvent = function (event) {
                                        event.cancelBubble = true;

                                        (element || window).detachEvent('on' + type, cancelBubbleEvent);
                                    };

                                    this.attachEvent('on' + type, cancelBubbleEvent);
                                }

                                this.fireEvent('on' + type, event);
                            } catch (error) {
                                event.target = element;

                                do {
                                    event.currentTarget = element;

                                    if ('_events' in element && typeof element._events[type] === 'function') {
                                        element._events[type].call(element, event);
                                    }

                                    if (typeof element['on' + type] === 'function') {
                                        element['on' + type].call(element, event);
                                    }

                                    element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
                                } while (element && !event.cancelBubble);
                            }

                            return true;
                        };

                // Add the DOMContentLoaded Event
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        document.dispatchEvent(
                            new Event('DOMContentLoaded', {
                                bubbles: true,
                            })
                        );
                    }
                });
            }
        })();
    }

    if (
        !(
            'CustomEvent' in self &&
            ('function' == typeof self.CustomEvent ||
                self.CustomEvent.toString().indexOf('CustomEventConstructor') > -1)
        )
    ) {
        // CustomEvent
        self.CustomEvent = function CustomEvent(type, eventInitDict) {
            if (!type) {
                throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
            }

            var event;
            eventInitDict = eventInitDict || { bubbles: false, cancelable: false, detail: null };

            try {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
            } catch (error) {
                // for browsers which don't support CustomEvent at all, we use a regular event instead
                event = document.createEvent('Event');
                event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
                event.detail = eventInitDict.detail;
            }
            return event;
        };

        CustomEvent.prototype = Event.prototype;
    }

    if (
        !(function (r) {
            'use strict';
            try {
                var a = new r.URL('http://example.com');
                if ('href' in a && 'searchParams' in a) {
                    var e = new URL('http://example.com');
                    if (
                        ((e.search = 'a=1&b=2'),
                        'http://example.com/?a=1&b=2' === e.href && ((e.search = ''), 'http://example.com/' === e.href))
                    ) {
                        if (!('sort' in r.URLSearchParams.prototype)) return !1;
                        var t = new r.URLSearchParams('a=1'),
                            n = new r.URLSearchParams(t);
                        if ('a=1' !== String(n)) return !1;
                        var c = new r.URLSearchParams({ a: '1' });
                        if ('a=1' !== String(c)) return !1;
                        var h = new r.URLSearchParams([['a', '1']]);
                        return 'a=1' === String(h);
                    }
                }
                return !1;
            } catch (r) {
                return !1;
            }
        })(self)
    ) {
        // URL
        /* global Symbol */
        // URL Polyfill
        // Draft specification: https://url.spec.whatwg.org

        // Notes:
        // - Primarily useful for parsing URLs and modifying query parameters
        // - Should work in IE9+ and everything more modern, with es5.js polyfills

        (function (global) {
            'use strict';

            function isSequence(o) {
                if (!o) return false;
                if ('Symbol' in global && 'iterator' in global.Symbol && typeof o[Symbol.iterator] === 'function')
                    return true;
                if (Array.isArray(o)) return true;
                return false;
            }

            (function () {
                // eslint-disable-line no-extra-semi

                // Browsers may have:
                // * No global URL object
                // * URL with static methods only - may have a dummy constructor
                // * URL with members except searchParams
                // * Full URL API support
                var origURL = global.URL;
                var nativeURL;
                try {
                    if (origURL) {
                        nativeURL = new global.URL('http://example.com');
                        if ('searchParams' in nativeURL) {
                            var url = new URL('http://example.com');
                            url.search = 'a=1&b=2';
                            if (url.href === 'http://example.com/?a=1&b=2') {
                                url.search = '';
                                if (url.href === 'http://example.com/') {
                                    return;
                                }
                            }
                        }
                        if (!('href' in nativeURL)) {
                            nativeURL = undefined;
                        }
                        nativeURL = undefined;
                    }
                    // eslint-disable-next-line no-empty
                } catch (_) {}

                // NOTE: Doesn't do the encoding/decoding dance
                function urlencoded_serialize(pairs) {
                    var output = '',
                        first = true;
                    pairs.forEach(function (pair) {
                        var name = encodeURIComponent(pair.name);
                        var value = encodeURIComponent(pair.value);
                        if (!first) output += '&';
                        output += name + '=' + value;
                        first = false;
                    });
                    return output.replace(/%20/g, '+');
                }

                // https://url.spec.whatwg.org/#percent-decode
                var cachedDecodePattern;
                function percent_decode(bytes) {
                    // This can't simply use decodeURIComponent (part of ECMAScript) as that's limited to
                    // decoding to valid UTF-8 only. It throws URIError for literals that look like percent
                    // encoding (e.g. `x=%`, `x=%a`, and `x=a%2sf`) and for non-UTF8 binary data that was
                    // percent encoded and cannot be turned back into binary within a JavaScript string.
                    //
                    // The spec deals with this as follows:
                    // * Read input as UTF-8 encoded bytes. This needs low-level access or a modern
                    //   Web API, like TextDecoder. Old browsers don't have that, and it'd a large
                    //   dependency to add to this polyfill.
                    // * For each percentage sign followed by two hex, blindly decode the byte in binary
                    //   form. This would require TextEncoder to not corrupt multi-byte chars.
                    // * Replace any bytes that would be invalid under UTF-8 with U+FFFD.
                    //
                    // Instead we:
                    // * Use the fact that UTF-8 is designed to make validation easy in binary.
                    //   You don't have to decode first. There are only a handful of valid prefixes and
                    //   ranges, per RFC 3629. <https://datatracker.ietf.org/doc/html/rfc3629#section-3>
                    // * Safely create multi-byte chars with decodeURIComponent, by only passing it
                    //   valid and full characters (e.g. "%F0" separately from "%F0%9F%92%A9" throws).
                    //   Anything else is kept as literal or replaced with U+FFFD, as per the URL spec.

                    if (!cachedDecodePattern) {
                        // In a UTF-8 multibyte sequence, non-initial bytes are always between %80 and %BF
                        var uContinuation = '%[89AB][0-9A-F]';

                        // The length of a UTF-8 sequence is specified by the first byte
                        //
                        // One-byte sequences: 0xxxxxxx
                        // So the byte is between %00 and %7F
                        var u1Bytes = '%[0-7][0-9A-F]';
                        // Two-byte sequences: 110xxxxx 10xxxxxx
                        // So the first byte is between %C0 and %DF
                        var u2Bytes = '%[CD][0-9A-F]' + uContinuation;
                        // Three-byte sequences: 1110xxxx 10xxxxxx 10xxxxxx
                        // So the first byte is between %E0 and %EF
                        var u3Bytes = '%E[0-9A-F]' + uContinuation + uContinuation;
                        // Four-byte sequences: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                        // So the first byte is between %F0 and %F7
                        var u4Bytes = '%F[0-7]' + uContinuation + uContinuation + uContinuation;

                        var anyByte = '%[0-9A-F][0-9A-F]';

                        // Match some consecutive percent-escaped bytes. More precisely, match
                        // 1-4 bytes that validly encode one character in UTF-8, or 1 byte that
                        // would be invalid in UTF-8 in this location.
                        cachedDecodePattern = new RegExp(
                            '(' + u4Bytes + ')|(' + u3Bytes + ')|(' + u2Bytes + ')|(' + u1Bytes + ')|(' + anyByte + ')',
                            'gi'
                        );
                    }

                    return bytes.replace(cachedDecodePattern, function (match, u4, u3, u2, u1, uBad) {
                        return uBad !== undefined ? '\uFFFD' : decodeURIComponent(match);
                    });
                }

                // NOTE: Doesn't do the encoding/decoding dance
                //
                // https://url.spec.whatwg.org/#concept-urlencoded-parser
                function urlencoded_parse(input, isindex) {
                    var sequences = input.split('&');
                    if (isindex && sequences[0].indexOf('=') === -1) sequences[0] = '=' + sequences[0];
                    var pairs = [];
                    sequences.forEach(function (bytes) {
                        if (bytes.length === 0) return;
                        var index = bytes.indexOf('=');
                        if (index !== -1) {
                            var name = bytes.substring(0, index);
                            var value = bytes.substring(index + 1);
                        } else {
                            name = bytes;
                            value = '';
                        }
                        name = name.replace(/\+/g, ' ');
                        value = value.replace(/\+/g, ' ');
                        pairs.push({ name: name, value: value });
                    });
                    var output = [];
                    pairs.forEach(function (pair) {
                        output.push({
                            name: percent_decode(pair.name),
                            value: percent_decode(pair.value),
                        });
                    });
                    return output;
                }

                function URLUtils(url) {
                    if (nativeURL) return new origURL(url);
                    var anchor = document.createElement('a');
                    anchor.href = url;
                    return anchor;
                }

                function URLSearchParams(init) {
                    var $this = this;
                    this._list = [];

                    if (init === undefined || init === null) {
                        // no-op
                    } else if (init instanceof URLSearchParams) {
                        // In ES6 init would be a sequence, but special case for ES5.
                        this._list = urlencoded_parse(String(init));
                    } else if (typeof init === 'object' && isSequence(init)) {
                        Array.from(init).forEach(function (e) {
                            if (!isSequence(e)) throw TypeError();
                            var nv = Array.from(e);
                            if (nv.length !== 2) throw TypeError();
                            $this._list.push({ name: String(nv[0]), value: String(nv[1]) });
                        });
                    } else if (typeof init === 'object' && init) {
                        Object.keys(init).forEach(function (key) {
                            $this._list.push({ name: String(key), value: String(init[key]) });
                        });
                    } else {
                        init = String(init);
                        if (init.substring(0, 1) === '?') init = init.substring(1);
                        this._list = urlencoded_parse(init);
                    }

                    this._url_object = null;
                    this._setList = function (list) {
                        if (!updating) $this._list = list;
                    };

                    var updating = false;
                    this._update_steps = function () {
                        if (updating) return;
                        updating = true;

                        if (!$this._url_object) return;

                        // Partial workaround for IE issue with 'about:'
                        if ($this._url_object.protocol === 'about:' && $this._url_object.pathname.indexOf('?') !== -1) {
                            $this._url_object.pathname = $this._url_object.pathname.split('?')[0];
                        }

                        $this._url_object.search = urlencoded_serialize($this._list);

                        updating = false;
                    };
                }

                Object.defineProperties(URLSearchParams.prototype, {
                    append: {
                        value: function (name, value) {
                            this._list.push({ name: name, value: value });
                            this._update_steps();
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    delete: {
                        value: function (name) {
                            for (var i = 0; i < this._list.length; ) {
                                if (this._list[i].name === name) this._list.splice(i, 1);
                                else ++i;
                            }
                            this._update_steps();
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    get: {
                        value: function (name) {
                            for (var i = 0; i < this._list.length; ++i) {
                                if (this._list[i].name === name) return this._list[i].value;
                            }
                            return null;
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    getAll: {
                        value: function (name) {
                            var result = [];
                            for (var i = 0; i < this._list.length; ++i) {
                                if (this._list[i].name === name) result.push(this._list[i].value);
                            }
                            return result;
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    has: {
                        value: function (name) {
                            for (var i = 0; i < this._list.length; ++i) {
                                if (this._list[i].name === name) return true;
                            }
                            return false;
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    set: {
                        value: function (name, value) {
                            var found = false;
                            for (var i = 0; i < this._list.length; ) {
                                if (this._list[i].name === name) {
                                    if (!found) {
                                        this._list[i].value = value;
                                        found = true;
                                        ++i;
                                    } else {
                                        this._list.splice(i, 1);
                                    }
                                } else {
                                    ++i;
                                }
                            }

                            if (!found) this._list.push({ name: name, value: value });

                            this._update_steps();
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    entries: {
                        value: function () {
                            return new Iterator(this._list, 'key+value');
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    keys: {
                        value: function () {
                            return new Iterator(this._list, 'key');
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    values: {
                        value: function () {
                            return new Iterator(this._list, 'value');
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    forEach: {
                        value: function (callback) {
                            var thisArg = arguments.length > 1 ? arguments[1] : undefined;
                            this._list.forEach(function (pair) {
                                callback.call(thisArg, pair.value, pair.name);
                            });
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    },

                    toString: {
                        value: function () {
                            return urlencoded_serialize(this._list);
                        },
                        writable: true,
                        enumerable: false,
                        configurable: true,
                    },

                    sort: {
                        value: function sort() {
                            var entries = this.entries();
                            var entry = entries.next();
                            var keys = [];
                            var values = {};

                            while (!entry.done) {
                                var value = entry.value;
                                var key = value[0];
                                keys.push(key);
                                if (!Object.prototype.hasOwnProperty.call(values, key)) {
                                    values[key] = [];
                                }
                                values[key].push(value[1]);
                                entry = entries.next();
                            }

                            keys.sort();
                            for (var i = 0; i < keys.length; i++) {
                                this.delete(keys[i]);
                            }
                            for (var j = 0; j < keys.length; j++) {
                                key = keys[j];
                                this.append(key, values[key].shift());
                            }
                        },
                    },
                });

                function Iterator(source, kind) {
                    var index = 0;
                    this.next = function () {
                        if (index >= source.length) return { done: true, value: undefined };
                        var pair = source[index++];
                        return {
                            done: false,
                            value: kind === 'key' ? pair.name : kind === 'value' ? pair.value : [pair.name, pair.value],
                        };
                    };
                }

                if ('Symbol' in global && 'iterator' in global.Symbol) {
                    Object.defineProperty(URLSearchParams.prototype, global.Symbol.iterator, {
                        value: URLSearchParams.prototype.entries,
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    });
                    Object.defineProperty(Iterator.prototype, global.Symbol.iterator, {
                        value: function () {
                            return this;
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    });
                }

                function URL(url, base) {
                    if (!(this instanceof global.URL))
                        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator.");

                    if (base) {
                        url = (function () {
                            if (nativeURL) return new origURL(url, base).href;
                            var iframe;
                            try {
                                var doc;
                                // Use another document/base tag/anchor for relative URL resolution, if possible
                                if (Object.prototype.toString.call(window.operamini) === '[object OperaMini]') {
                                    iframe = document.createElement('iframe');
                                    iframe.style.display = 'none';
                                    document.documentElement.appendChild(iframe);
                                    doc = iframe.contentWindow.document;
                                } else if (document.implementation && document.implementation.createHTMLDocument) {
                                    doc = document.implementation.createHTMLDocument('');
                                } else if (document.implementation && document.implementation.createDocument) {
                                    doc = document.implementation.createDocument(
                                        'http://www.w3.org/1999/xhtml',
                                        'html',
                                        null
                                    );
                                    doc.documentElement.appendChild(doc.createElement('head'));
                                    doc.documentElement.appendChild(doc.createElement('body'));
                                } else if (window.ActiveXObject) {
                                    doc = new window.ActiveXObject('htmlfile');
                                    doc.write('<head></head><body></body>');
                                    doc.close();
                                }

                                if (!doc) throw Error('base not supported');

                                var baseTag = doc.createElement('base');
                                baseTag.href = base;
                                doc.getElementsByTagName('head')[0].appendChild(baseTag);
                                var anchor = doc.createElement('a');
                                anchor.href = url;
                                return anchor.href;
                            } finally {
                                if (iframe) iframe.parentNode.removeChild(iframe);
                            }
                        })();
                    }

                    // An inner object implementing URLUtils (either a native URL
                    // object or an HTMLAnchorElement instance) is used to perform the
                    // URL algorithms.

                    var instance = URLUtils(url || '');

                    var self = this;

                    var query_object = new URLSearchParams(instance.search ? instance.search.substring(1) : null);
                    query_object._url_object = self;

                    Object.defineProperties(self, {
                        href: {
                            get: function () {
                                return instance.href;
                            },
                            set: function (v) {
                                instance.href = v;
                                tidy_instance();
                                update_steps();
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        origin: {
                            get: function () {
                                if (this.protocol.toLowerCase() === 'data:') {
                                    return null;
                                }

                                if ('origin' in instance) return instance.origin;
                                return this.protocol + '//' + this.host;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        protocol: {
                            get: function () {
                                return instance.protocol;
                            },
                            set: function (v) {
                                instance.protocol = v;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        username: {
                            get: function () {
                                return instance.username;
                            },
                            set: function (v) {
                                instance.username = v;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        password: {
                            get: function () {
                                return instance.password;
                            },
                            set: function (v) {
                                instance.password = v;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        host: {
                            get: function () {
                                // IE returns default port in |host|
                                var re = { 'http:': /:80$/, 'https:': /:443$/, 'ftp:': /:21$/ }[instance.protocol];
                                return re ? instance.host.replace(re, '') : instance.host;
                            },
                            set: function (v) {
                                instance.host = v;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        hostname: {
                            get: function () {
                                return instance.hostname;
                            },
                            set: function (v) {
                                instance.hostname = v;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        port: {
                            get: function () {
                                return instance.port;
                            },
                            set: function (v) {
                                instance.port = v;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        pathname: {
                            get: function () {
                                // IE does not include leading '/' in |pathname|
                                if (instance.pathname.charAt(0) !== '/') return '/' + instance.pathname;
                                return instance.pathname;
                            },
                            set: function (v) {
                                instance.pathname = v;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        search: {
                            get: function () {
                                return instance.search;
                            },
                            set: function (v) {
                                if (instance.search === v) return;
                                instance.search = v;
                                tidy_instance();
                                update_steps();
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        searchParams: {
                            get: function () {
                                return query_object;
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        hash: {
                            get: function () {
                                return instance.hash;
                            },
                            set: function (v) {
                                instance.hash = v;
                                tidy_instance();
                            },
                            enumerable: true,
                            configurable: true,
                        },
                        toString: {
                            value: function () {
                                return instance.toString();
                            },
                            enumerable: false,
                            configurable: true,
                        },
                        valueOf: {
                            value: function () {
                                return instance.valueOf();
                            },
                            enumerable: false,
                            configurable: true,
                        },
                    });

                    function tidy_instance() {
                        var href = instance.href.replace(/#$|\?$|\?(?=#)/g, '');
                        if (instance.href !== href) instance.href = href;
                    }

                    function update_steps() {
                        query_object._setList(instance.search ? urlencoded_parse(instance.search.substring(1)) : []);
                        query_object._update_steps();
                    }

                    return self;
                }

                if (origURL) {
                    for (var i in origURL) {
                        if (Object.prototype.hasOwnProperty.call(origURL, i) && typeof origURL[i] === 'function')
                            URL[i] = origURL[i];
                    }
                }

                global.URL = URL;
                global.URLSearchParams = URLSearchParams;
            })();

            // Patch native URLSearchParams constructor to handle sequences/records
            // if necessary.
            (function () {
                if (
                    new global.URLSearchParams([['a', 1]]).get('a') === '1' &&
                    new global.URLSearchParams({ a: 1 }).get('a') === '1'
                )
                    return;
                var orig = global.URLSearchParams;
                global.URLSearchParams = function (init) {
                    if (init && typeof init === 'object' && isSequence(init)) {
                        var o = new orig();
                        Array.from(init).forEach(function (e) {
                            if (!isSequence(e)) throw TypeError();
                            var nv = Array.from(e);
                            if (nv.length !== 2) throw TypeError();
                            o.append(nv[0], nv[1]);
                        });
                        return o;
                    } else if (init && typeof init === 'object') {
                        o = new orig();
                        Object.keys(init).forEach(function (key) {
                            o.set(key, init[key]);
                        });
                        return o;
                    } else {
                        return new orig(init);
                    }
                };
            })();
        })(self);
    }

    if (
        !(
            'fetch' in self &&
            'Request' in self &&
            (function () {
                try {
                    return 'signal' in new Request('');
                } catch (e) {
                    return !1;
                }
            })()
        )
    ) {
        // fetch
        (function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined'
                ? factory(exports)
                : typeof define === 'function' && define.amd
                ? define(['exports'], factory)
                : factory((global.WHATWGFetch = {}));
        })(this, function (exports) {
            'use strict';

            var global =
                (typeof globalThis !== 'undefined' && globalThis) ||
                (typeof self !== 'undefined' && self) ||
                (typeof global !== 'undefined' && global);

            var support = {
                searchParams: 'URLSearchParams' in global,
                iterable: 'Symbol' in global && 'iterator' in Symbol,
                blob:
                    'FileReader' in global &&
                    'Blob' in global &&
                    (function () {
                        try {
                            new Blob();
                            return true;
                        } catch (e) {
                            return false;
                        }
                    })(),
                formData: 'FormData' in global,
                arrayBuffer: 'ArrayBuffer' in global,
            };

            function isDataView(obj) {
                return obj && DataView.prototype.isPrototypeOf(obj);
            }

            if (support.arrayBuffer) {
                var viewClasses = [
                    '[object Int8Array]',
                    '[object Uint8Array]',
                    '[object Uint8ClampedArray]',
                    '[object Int16Array]',
                    '[object Uint16Array]',
                    '[object Int32Array]',
                    '[object Uint32Array]',
                    '[object Float32Array]',
                    '[object Float64Array]',
                ];

                var isArrayBufferView =
                    ArrayBuffer.isView ||
                    function (obj) {
                        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
                    };
            }

            function normalizeName(name) {
                if (typeof name !== 'string') {
                    name = String(name);
                }
                if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
                    throw new TypeError('Invalid character in header field name: "' + name + '"');
                }
                return name.toLowerCase();
            }

            function normalizeValue(value) {
                if (typeof value !== 'string') {
                    value = String(value);
                }
                return value;
            }

            // Build a destructive iterator for the value list
            function iteratorFor(items) {
                var iterator = {
                    next: function () {
                        var value = items.shift();
                        return { done: value === undefined, value: value };
                    },
                };

                if (support.iterable) {
                    iterator[Symbol.iterator] = function () {
                        return iterator;
                    };
                }

                return iterator;
            }

            function Headers(headers) {
                this.map = {};

                if (headers instanceof Headers) {
                    headers.forEach(function (value, name) {
                        this.append(name, value);
                    }, this);
                } else if (Array.isArray(headers)) {
                    headers.forEach(function (header) {
                        this.append(header[0], header[1]);
                    }, this);
                } else if (headers) {
                    Object.getOwnPropertyNames(headers).forEach(function (name) {
                        this.append(name, headers[name]);
                    }, this);
                }
            }

            Headers.prototype.append = function (name, value) {
                name = normalizeName(name);
                value = normalizeValue(value);
                var oldValue = this.map[name];
                this.map[name] = oldValue ? oldValue + ', ' + value : value;
            };

            Headers.prototype['delete'] = function (name) {
                delete this.map[normalizeName(name)];
            };

            Headers.prototype.get = function (name) {
                name = normalizeName(name);
                return this.has(name) ? this.map[name] : null;
            };

            Headers.prototype.has = function (name) {
                return this.map.hasOwnProperty(normalizeName(name));
            };

            Headers.prototype.set = function (name, value) {
                this.map[normalizeName(name)] = normalizeValue(value);
            };

            Headers.prototype.forEach = function (callback, thisArg) {
                for (var name in this.map) {
                    if (this.map.hasOwnProperty(name)) {
                        callback.call(thisArg, this.map[name], name, this);
                    }
                }
            };

            Headers.prototype.keys = function () {
                var items = [];
                this.forEach(function (value, name) {
                    items.push(name);
                });
                return iteratorFor(items);
            };

            Headers.prototype.values = function () {
                var items = [];
                this.forEach(function (value) {
                    items.push(value);
                });
                return iteratorFor(items);
            };

            Headers.prototype.entries = function () {
                var items = [];
                this.forEach(function (value, name) {
                    items.push([name, value]);
                });
                return iteratorFor(items);
            };

            if (support.iterable) {
                Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
            }

            function consumed(body) {
                if (body.bodyUsed) {
                    return Promise.reject(new TypeError('Already read'));
                }
                body.bodyUsed = true;
            }

            function fileReaderReady(reader) {
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(reader.error);
                    };
                });
            }

            function readBlobAsArrayBuffer(blob) {
                var reader = new FileReader();
                var promise = fileReaderReady(reader);
                reader.readAsArrayBuffer(blob);
                return promise;
            }

            function readBlobAsText(blob) {
                var reader = new FileReader();
                var promise = fileReaderReady(reader);
                reader.readAsText(blob);
                return promise;
            }

            function readArrayBufferAsText(buf) {
                var view = new Uint8Array(buf);
                var chars = new Array(view.length);

                for (var i = 0; i < view.length; i++) {
                    chars[i] = String.fromCharCode(view[i]);
                }
                return chars.join('');
            }

            function bufferClone(buf) {
                if (buf.slice) {
                    return buf.slice(0);
                } else {
                    var view = new Uint8Array(buf.byteLength);
                    view.set(new Uint8Array(buf));
                    return view.buffer;
                }
            }

            function Body() {
                this.bodyUsed = false;

                this._initBody = function (body) {
                    /*
        fetch-mock wraps the Response object in an ES6 Proxy to
        provide useful test harness features such as flush. However, on
        ES5 browsers without fetch or Proxy support pollyfills must be used;
        the proxy-pollyfill is unable to proxy an attribute unless it exists
        on the object before the Proxy is created. This change ensures
        Response.bodyUsed exists on the instance, while maintaining the
        semantic of setting Request.bodyUsed in the constructor before
        _initBody is called.
      */
                    this.bodyUsed = this.bodyUsed;
                    this._bodyInit = body;
                    if (!body) {
                        this._bodyText = '';
                    } else if (typeof body === 'string') {
                        this._bodyText = body;
                    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                        this._bodyBlob = body;
                    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                        this._bodyFormData = body;
                    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                        this._bodyText = body.toString();
                    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                        this._bodyArrayBuffer = bufferClone(body.buffer);
                        // IE 10-11 can't handle a DataView body.
                        this._bodyInit = new Blob([this._bodyArrayBuffer]);
                    } else if (
                        support.arrayBuffer &&
                        (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))
                    ) {
                        this._bodyArrayBuffer = bufferClone(body);
                    } else {
                        this._bodyText = body = Object.prototype.toString.call(body);
                    }

                    if (!this.headers.get('content-type')) {
                        if (typeof body === 'string') {
                            this.headers.set('content-type', 'text/plain;charset=UTF-8');
                        } else if (this._bodyBlob && this._bodyBlob.type) {
                            this.headers.set('content-type', this._bodyBlob.type);
                        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                            this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        }
                    }
                };

                if (support.blob) {
                    this.blob = function () {
                        var rejected = consumed(this);
                        if (rejected) {
                            return rejected;
                        }

                        if (this._bodyBlob) {
                            return Promise.resolve(this._bodyBlob);
                        } else if (this._bodyArrayBuffer) {
                            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                        } else if (this._bodyFormData) {
                            throw new Error('could not read FormData body as blob');
                        } else {
                            return Promise.resolve(new Blob([this._bodyText]));
                        }
                    };

                    this.arrayBuffer = function () {
                        if (this._bodyArrayBuffer) {
                            var isConsumed = consumed(this);
                            if (isConsumed) {
                                return isConsumed;
                            }
                            if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
                                return Promise.resolve(
                                    this._bodyArrayBuffer.buffer.slice(
                                        this._bodyArrayBuffer.byteOffset,
                                        this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                                    )
                                );
                            } else {
                                return Promise.resolve(this._bodyArrayBuffer);
                            }
                        } else {
                            return this.blob().then(readBlobAsArrayBuffer);
                        }
                    };
                }

                this.text = function () {
                    var rejected = consumed(this);
                    if (rejected) {
                        return rejected;
                    }

                    if (this._bodyBlob) {
                        return readBlobAsText(this._bodyBlob);
                    } else if (this._bodyArrayBuffer) {
                        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
                    } else if (this._bodyFormData) {
                        throw new Error('could not read FormData body as text');
                    } else {
                        return Promise.resolve(this._bodyText);
                    }
                };

                if (support.formData) {
                    this.formData = function () {
                        return this.text().then(decode);
                    };
                }

                this.json = function () {
                    return this.text().then(JSON.parse);
                };

                return this;
            }

            // HTTP methods whose capitalization should be normalized
            var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

            function normalizeMethod(method) {
                var upcased = method.toUpperCase();
                return methods.indexOf(upcased) > -1 ? upcased : method;
            }

            function Request(input, options) {
                if (!(this instanceof Request)) {
                    throw new TypeError(
                        'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
                    );
                }

                options = options || {};
                var body = options.body;

                if (input instanceof Request) {
                    if (input.bodyUsed) {
                        throw new TypeError('Already read');
                    }
                    this.url = input.url;
                    this.credentials = input.credentials;
                    if (!options.headers) {
                        this.headers = new Headers(input.headers);
                    }
                    this.method = input.method;
                    this.mode = input.mode;
                    this.signal = input.signal;
                    if (!body && input._bodyInit != null) {
                        body = input._bodyInit;
                        input.bodyUsed = true;
                    }
                } else {
                    this.url = String(input);
                }

                this.credentials = options.credentials || this.credentials || 'same-origin';
                if (options.headers || !this.headers) {
                    this.headers = new Headers(options.headers);
                }
                this.method = normalizeMethod(options.method || this.method || 'GET');
                this.mode = options.mode || this.mode || null;
                this.signal = options.signal || this.signal;
                this.referrer = null;

                if ((this.method === 'GET' || this.method === 'HEAD') && body) {
                    throw new TypeError('Body not allowed for GET or HEAD requests');
                }
                this._initBody(body);

                if (this.method === 'GET' || this.method === 'HEAD') {
                    if (options.cache === 'no-store' || options.cache === 'no-cache') {
                        // Search for a '_' parameter in the query string
                        var reParamSearch = /([?&])_=[^&]*/;
                        if (reParamSearch.test(this.url)) {
                            // If it already exists then set the value with the current time
                            this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
                        } else {
                            // Otherwise add a new '_' parameter to the end with the current time
                            var reQueryString = /\?/;
                            this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
                        }
                    }
                }
            }

            Request.prototype.clone = function () {
                return new Request(this, { body: this._bodyInit });
            };

            function decode(body) {
                var form = new FormData();
                body.trim()
                    .split('&')
                    .forEach(function (bytes) {
                        if (bytes) {
                            var split = bytes.split('=');
                            var name = split.shift().replace(/\+/g, ' ');
                            var value = split.join('=').replace(/\+/g, ' ');
                            form.append(decodeURIComponent(name), decodeURIComponent(value));
                        }
                    });
                return form;
            }

            function parseHeaders(rawHeaders) {
                var headers = new Headers();
                // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
                // https://tools.ietf.org/html/rfc7230#section-3.2
                var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
                // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
                // https://github.com/github/fetch/issues/748
                // https://github.com/zloirock/core-js/issues/751
                preProcessedHeaders
                    .split('\r')
                    .map(function (header) {
                        return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header;
                    })
                    .forEach(function (line) {
                        var parts = line.split(':');
                        var key = parts.shift().trim();
                        if (key) {
                            var value = parts.join(':').trim();
                            headers.append(key, value);
                        }
                    });
                return headers;
            }

            Body.call(Request.prototype);

            function Response(bodyInit, options) {
                if (!(this instanceof Response)) {
                    throw new TypeError(
                        'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
                    );
                }
                if (!options) {
                    options = {};
                }

                this.type = 'default';
                this.status = options.status === undefined ? 200 : options.status;
                this.ok = this.status >= 200 && this.status < 300;
                this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
                this.headers = new Headers(options.headers);
                this.url = options.url || '';
                this._initBody(bodyInit);
            }

            Body.call(Response.prototype);

            Response.prototype.clone = function () {
                return new Response(this._bodyInit, {
                    status: this.status,
                    statusText: this.statusText,
                    headers: new Headers(this.headers),
                    url: this.url,
                });
            };

            Response.error = function () {
                var response = new Response(null, { status: 0, statusText: '' });
                response.type = 'error';
                return response;
            };

            var redirectStatuses = [301, 302, 303, 307, 308];

            Response.redirect = function (url, status) {
                if (redirectStatuses.indexOf(status) === -1) {
                    throw new RangeError('Invalid status code');
                }

                return new Response(null, { status: status, headers: { location: url } });
            };

            exports.DOMException = global.DOMException;
            try {
                new exports.DOMException();
            } catch (err) {
                exports.DOMException = function (message, name) {
                    this.message = message;
                    this.name = name;
                    var error = Error(message);
                    this.stack = error.stack;
                };
                exports.DOMException.prototype = Object.create(Error.prototype);
                exports.DOMException.prototype.constructor = exports.DOMException;
            }

            function fetch(input, init) {
                return new Promise(function (resolve, reject) {
                    var request = new Request(input, init);

                    if (request.signal && request.signal.aborted) {
                        return reject(new exports.DOMException('Aborted', 'AbortError'));
                    }

                    var xhr = new XMLHttpRequest();

                    function abortXhr() {
                        xhr.abort();
                    }

                    xhr.onload = function () {
                        var options = {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
                        };
                        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
                        var body = 'response' in xhr ? xhr.response : xhr.responseText;
                        setTimeout(function () {
                            resolve(new Response(body, options));
                        }, 0);
                    };

                    xhr.onerror = function () {
                        setTimeout(function () {
                            reject(new TypeError('Network request failed'));
                        }, 0);
                    };

                    xhr.ontimeout = function () {
                        setTimeout(function () {
                            reject(new TypeError('Network request failed'));
                        }, 0);
                    };

                    xhr.onabort = function () {
                        setTimeout(function () {
                            reject(new exports.DOMException('Aborted', 'AbortError'));
                        }, 0);
                    };

                    function fixUrl(url) {
                        try {
                            return url === '' && global.location.href ? global.location.href : url;
                        } catch (e) {
                            return url;
                        }
                    }

                    xhr.open(request.method, fixUrl(request.url), true);

                    if (request.credentials === 'include') {
                        xhr.withCredentials = true;
                    } else if (request.credentials === 'omit') {
                        xhr.withCredentials = false;
                    }

                    if ('responseType' in xhr) {
                        if (support.blob) {
                            xhr.responseType = 'blob';
                        } else if (
                            support.arrayBuffer &&
                            request.headers.get('Content-Type') &&
                            request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
                        ) {
                            xhr.responseType = 'arraybuffer';
                        }
                    }

                    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
                        Object.getOwnPropertyNames(init.headers).forEach(function (name) {
                            xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
                        });
                    } else {
                        request.headers.forEach(function (value, name) {
                            xhr.setRequestHeader(name, value);
                        });
                    }

                    if (request.signal) {
                        request.signal.addEventListener('abort', abortXhr);

                        xhr.onreadystatechange = function () {
                            // DONE (success or failure)
                            if (xhr.readyState === 4) {
                                request.signal.removeEventListener('abort', abortXhr);
                            }
                        };
                    }

                    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
                });
            }

            fetch.polyfill = true;

            global.fetch = fetch;
            global.Headers = Headers;
            global.Request = Request;
            global.Response = Response;

            exports.Headers = Headers;
            exports.Request = Request;
            exports.Response = Response;
            exports.fetch = fetch;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    }
})(
    ('object' === typeof window && window) ||
        ('object' === typeof self && self) ||
        ('object' === typeof global && global) ||
        {}
);
