/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    var styleMedia  = (window.styleMedia || window.media);

    // For those that doen't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            info        = null,
            setStyle     = function(text) {
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }
            };

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        document.getElementsByTagName('head')[0].appendChild(style);
        info = ('getComputedStyle' in window) && window.getComputedStyle(style) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }',
                    match;

                // Add css text
                setStyle(text);

                match = info.width === '1px';

                // remove css text
                setStyle('');

                return match;
            }
        };

    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
