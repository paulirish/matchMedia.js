[![npm](https://img.shields.io/npm/v/matchmedia-polyfill.svg)](https://npmjs.com/package/matchmedia-polyfill)

# matchMedia() polyfill

## test whether a CSS media type or media query applies

## Usage

```js
// Likely want to requier both polyfills..
require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');
```

#### test 'tv' media type
```js
if (matchMedia('tv').matches) {
  // tv media type supported
}
```

### test a mobile device media query
```js
if (matchMedia('only screen and (max-width: 480px)').matches) {
  // smartphone/iphone... maybe run some small-screen related dom scripting?
}
```

#### test landscape orientation
```js
if (matchMedia('all and (orientation:landscape)').matches) {
  // probably tablet in widescreen view
}
```


## Used in: 

* [Respond.js](https://github.com/scottjehl/Respond)
* [FormFactor](https://github.com/PaulKinlan/formfactor)
* [Modernizr](http://www.modernizr.com/)


### How about resizing the browser?
Paul Hayes [tackled this using CSS transitions and their transitionEnd event](http://www.paulrhayes.com/2011-11/use-css-transitions-to-link-media-queries-and-javascript/) 

His code: https://github.com/fofr/matchMedia.js -- though currently it doesnt support IE6-9, since they dont have transitions, obviously. :)

----------

* **Authors**: Scott Jehl, Paul Irish, Nicholas Zakas 
* **Spec**: [dev.w3.org/csswg/cssom-view/#dom-window-matchmedia](http://dev.w3.org/csswg/cssom-view/#dom-window-matchmedia)
* **Native support**: Chrome [since m10](http://trac.webkit.org/changeset/72552), Firefox [since 6](https://developer.mozilla.org/en/Firefox/Releases/6), and Safari [since 5.1](https://developer.mozilla.org/en/DOM/window.matchMedia#Browser_compatibility)
