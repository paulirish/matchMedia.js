/* MediaMatch v.2.0.2 - Testing css media queries in Javascript. Authors & copyright (c) 2013: WebLinc, David Knight. */

(function(win) {
    'use strict';

    if (win.matchMedia) {
        return;
    }

    // Internal globals
    var _dpi,
        _doc = win.document,
        _viewport = _doc.documentElement,
        _type = '',
        _features = {},
        // only screen
        // only screen and
        // not screen
        // not screen and
        // screen
        // screen and
        _units = {
            cm: 2.54,
            mm: 25.4,
            pt: 72,
            pc: 6,
            'in': 1
        },
        _typeExpr = /\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i,
        // (-vendor-min-width: 300px)
        // (min-width: 300px)
        // (width: 300px)
        // (width)
        // (orientation: portrait|landscape)
        _mediaExpr = /^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/,
        _styleMedia = win.styleMedia || win.media,

        // Helper methods

        /*
            _matches
         */
        _matches = function(media) {
            // styleMedia.matchMedium IE 9 way
            if (_styleMedia) {
                return _styleMedia.matchMedium(media);
            }
            // screen and (min-width: 400px), screen and (max-width: 500px)
            var mql = (media.indexOf(',') !== -1 && media.split(',')) || [media],
                mqIndex = mql.length - 1,
                mqLength = mqIndex,
                mq = null,

                // not screen, screen
                negateType = null,
                negateTypeFound = '',
                negateTypeIndex = 0,
                negate = false,
                type = '',

                // (min-width: 400px), (min-width)
                exprListStr = '',
                exprList = null,
                exprIndex = 0,
                exprLength = 0,
                expr = null,

                prefix = '',
                length = '',
                unit = '',
                value = '',
                feature = '',

                match = false;

            if (media === '') {
                return true;
            }

            do {
                mq = mql[mqLength - mqIndex];
                negate = false;
                negateType = mq.match(_typeExpr);

                if (negateType) {
                    negateTypeFound = negateType[0];
                    negateTypeIndex = negateType.index;
                }

                if (!negateType || ((mq.substring(0, negateTypeIndex).indexOf('(') === -1) && (negateTypeIndex || (!negateType[3] && negateTypeFound !== negateType.input)))) {
                    match = false;
                    continue;
                }

                exprListStr = mq;

                negate = negateType[1] === 'not';

                if (!negateTypeIndex) {
                    type = negateType[2];
                    exprListStr = mq.substring(negateTypeFound.length);
                }

                // Test media type
                // Test type against this device or if 'all' or empty ''
                match = type === _type || type === 'all' || type === '';

                exprList = (exprListStr.indexOf(' and ') !== -1 && exprListStr.split(' and ')) || [exprListStr];
                exprIndex = exprList.length - 1;
                exprLength = exprIndex;

                if (match && exprIndex >= 0 && exprListStr !== '') {
                    do {
                        expr = exprList[exprIndex].match(_mediaExpr);

                        if (!expr || !_features[expr[3]]) {
                            match = false;
                            break;
                        }

                        prefix = expr[2];
                        length = expr[5];
                        value = length;
                        unit = expr[7];
                        feature = _features[expr[3]];
                        feature = feature.call ? feature() : feature;

                        // Convert unit types
                        if (unit) {
                            if (unit === 'px') {
                                // If unit is px
                                value = Number(length);
                            } else if (_units[unit]) {
                                // If unit is absolute length units
                                value = _toFixed(length * _dpi / _units[unit]);
                            } else if (unit === 'em' || unit === 'rem') {
                                // Convert relative length unit to pixels
                                // Assumed base font size is 16px
                                value = 16 * length;
                            } else if (expr[8]) {
                                // Convert aspect ratio to decimal
                                value = _toFixed(length / expr[8]);
                            } else if (unit === 'dppx') {
                                // Convert resolution dppx unit to pixels
                                value = length * 96;
                            } else if (unit === 'dpcm') {
                                // Convert resolution dpcm unit to pixels
                                value = length * 0.3937;
                            } else {
                                // default
                                value = Number(length);
                            }
                        }

                        // Test for prefix min or max
                        // Test value against feature
                        if (prefix === 'min-' && value) {
                            match = feature >= value;
                        } else if (prefix === 'max-' && value) {
                            match = feature <= value;
                        } else if (value) {
                            match = feature === value;
                        } else {
                            match = !!feature;
                        }

                        // If 'match' is false, break loop
                        // Continue main loop through query list
                        if (!match) {
                            break;
                        }
                    } while (exprIndex--);
                }

                // If match is true, break loop
                // Once matched, no need to check other queries
                if (match) {
                    break;
                }
            } while (mqIndex--);

            return negate ? !match : match;
        },

        /*
            _watch
         */
        _toFixed = function(num) {
            return parseFloat(num.toFixed(4));
        },

        /*
            _init
         */
        _init = function() {
            var head = _doc.getElementsByTagName('head')[0],
                style = _doc.createElement('style'),
                info = null,
                typeList = ['screen', 'print', 'speech', 'projection', 'handheld', 'tv', 'braille', 'embossed', 'tty'],
                typeIndex = 0,
                typeLength = typeList.length,
                cssText = '#mediamatchjs { position: relative; z-index: 0; }',
                w = function() {
                    return win.innerWidth || _viewport.clientWidth;
                },
                h = function() {
                    return win.innerHeight || _viewport.clientHeight;
                },
                screen = win.screen,
                dw = screen.width,
                dh = screen.height,
                c = screen.colorDepth,
                logicalXDPI = screen.logicalXDPI,
                ratio = win.devicePixelRatio || (screen.deviceXDPI / logicalXDPI) || 1;

            _dpi = logicalXDPI || (ratio * 96);

            // Sets properties of '_features' that change on resize and/or orientation.
            _features['aspect-ratio'] = function() {
                return _toFixed(w() / h());
            };
            _features.orientation = function() {
                return (h() >= w() ? 'portrait' : 'landscape');
            };

            _features.width = w;
            _features.height = h;
            _features['device-width'] = dw;
            _features['device-height'] = dh;
            _features['device-aspect-ratio'] = _toFixed(dw / dh);
            _features.color = c;
            _features['color-index'] = Math.pow(2, c);
            _features.resolution = _dpi;
            _features['device-pixel-ratio'] = ratio;

            style.type = 'text/css';
            style.id = 'mediamatchjs';

            head.appendChild(style);

            // Must be placed after style is inserted into the DOM for IE
            info = (win.getComputedStyle && win.getComputedStyle(style, null)) || style.currentStyle;

            // Create media blocks to test for media type
            for (; typeIndex < typeLength; typeIndex++) {
                cssText += '@media ' + typeList[typeIndex] + ' { #mediamatchjs { position: relative; z-index: ' + typeIndex + ' } }';
            }

            // Add rules to style element
            if (style.styleSheet) {
                style.styleSheet.cssText = cssText;
            } else {
                style.textContent = cssText;
            }

            // Get media type
            _type = typeList[(info.zIndex * 1) || 0];

            head.removeChild(style);
        };

    _init();

    /*
        A list of parsed media queries, ex. screen and (max-width: 400px), screen and (max-width: 800px)
    */
    win.matchMedia = function(media) {
        return {
            matches: media === '' ? true : _matches(media),
            media: media
        };
    };
})(window);