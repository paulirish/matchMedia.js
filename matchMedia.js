/*
* matchMedia() polyfill - test whether a CSS media type or media query applies
* authors: Scott Jehl, Paul Irish, Nicholas Zakas
* Copyright (c) 2010 Filament Group, Inc
* MIT license

* dev.w3.org/csswg/cssom-view/#dom-window-matchmedia
* in Chrome since m10: http://trac.webkit.org/changeset/72552
*/


window.matchMedia = window.matchMedia || (function(doc, undefined){
  
  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');
  
  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.appendChild(div);
  
  return function(q){
    
    div.innerHTML = '_<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';
    
    docElem.insertBefore(fakeBody, refNode);
    div.removeChild(div.firstChild);
    bool = div.offsetWidth == 42;  
    docElem.removeChild(fakeBody);
    
    return { matches: bool, media: q };
  };
  
})(document);



/*
 * EXAMPLE USAGE
 */

// test 'tv' media type
if (matchMedia('tv').matches) {
  // tv media type supported
}

// test a mobile device media query
if (matchMedia('only screen and (max-width: 480px)').matches) {
  // smartphone/iphone... maybe run some small-screen related dom scripting?
}

// test landscape orientation
if (matchMedia('all and (orientation:landscape)').matches) {
  // probably tablet in widescreen view
}

