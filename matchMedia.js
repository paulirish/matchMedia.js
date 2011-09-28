/*
* matchMedia() polyfill - test whether a CSS media type or media query applies
* authors: Scott Jehl, Paul Irish, Nicholas Zakas, Chuck Harmston
* Copyright (c) 2011 Scott, Paul, Nicholas, and chuck.
* Dual MIT/BSD license
*/

window.matchMedia = /*window.matchMedia || */(function(doc, undefined){

  // Mock interface of the MediaQueryListListener object
  // https://developer.mozilla.org/en/DOM/MediaQueryListListener
  var MediaQueryListListener = function(listener){
    this.handleChange = listener;
  };

  // Mock interface of the MediaQueryList object, augmented by methods + propertiesneeded by the polyfill
  // https://developer.mozilla.org/en/DOM/MediaQueryList
  var MediaQueryList = function(q){
    this.media = q;
    this.matches = false;
    this.addListener = function(listener){
      this._listeners.push(new MediaQueryListListener(listener));
    };
    this.removeListener = function(listener){
      this._listeners.remove(new MediaQueryListListener(listener));
    };
    this._listeners = [];
    this._matchCheck = function(scope){
      var mql = (typeof scope == "undefined") ? this : scope;
      if(mql._testElement.offsetWidth == 42 != mql.matches){
        mql.matches = !mql.matches;
        for(var i = 0; i < mql._listeners.length; i++){
          mql._listeners[i].handleChange(mql);
        }
      }
    };
  };

  return function(q){

    var mqList = new MediaQueryList(q);

    var docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        fakeBody = doc.createElement('body'),
        div = doc.createElement('div');
    div.id = 'mq-' + mqList.media.replace(/[^A-Z0-9]/gi,'').replace('and', '-').replace('or', '_');
    div.innerHTML = '&shy;<style media="' + q + '"> #' + div.id + ' { width: 42px; }</style>';
    div.style.cssText = "position:absolute;top:-100em";
    docElem.insertBefore(fakeBody, refNode);
    fakeBody.appendChild(div);
    mqList._testElement = div;

    setInterval(function(){
      mqList._matchCheck(mqList);
    }, 41.667);

    return mqList;
    
  };

})(document);
