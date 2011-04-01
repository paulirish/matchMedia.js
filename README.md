#matchMedia() polyfill

## test whether a CSS media type or media query applies

* **Authors**: Scott Jehl, Paul Irish, Nicholas Zakas 
* **Spec**: [dev.w3.org/csswg/cssom-view/#dom-window-matchmedia](http://dev.w3.org/csswg/cssom-view/#dom-window-matchmedia)
* **Native support**: in Chrome [since m10](http://trac.webkit.org/changeset/72552).



## Usage

#### test 'tv' media type
    if (matchMedia('tv').matches) {
      // tv media type supported
    }

### test a mobile device media query
    if (matchMedia('only screen and (max-width: 480px)').matches) {
      // smartphone/iphone... maybe run some small-screen related dom scripting?
    }
    
#### test landscape orientation
    if (matchMedia('all and (orientation:landscape)').matches) {
      // probably tablet in widescreen view
    }


## Used in: 

* [Respond.js](https://github.com/scottjehl/Respond)
* [MarshallJS](https://github.com/PaulKinlan/marshall)
* [Modernizr](http://www.modernizr.com/)