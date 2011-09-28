/*
* matchMedia() polyfill - test whether a CSS media type or media query applies
* authors: Scott Jehl, Paul Irish, Nicholas Zakas
* Copyright (c) 2011 Scott, Paul and Nicholas.
* Dual MIT/BSD license
*/

window.matchMedia = window.matchMedia || (function(doc, undefined){

  var MediaQueryListListener = function(listener){
    this.handleChange = listener;
  };

  var MediaQueryList = function(q){
    this.media = q;
    this.matches = null;
    this.addListener = function(listener){
      //
    };
    this.removeListener = function(listener){
      //
    };
  };


  var bool,
      docElem        = doc.documentElement,
      refNode        = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody       = doc.createElement('body'),
      div            = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';

    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth == 42;

    return {
      matches: bool,
      media: q,
      addListener: addListener,
      removeListener: removeListener
    };
    
  };

})(document);
