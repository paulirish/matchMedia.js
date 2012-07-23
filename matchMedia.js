/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, and Chuck. Dual MIT/BSD license */

// For now, we're not going to use the native matchMedia at all.
// The only browser that has fully implemented it is Firefox, and even then
// it's very buggy: https://bugzilla.mozilla.org/show_bug.cgi?id=670666
// window.matchMedia = window.matchMedia || (function(doc, undefined){

window.matchMedia = (function(doc, undefined){

  // Mock interface of the MediaQueryListListener object
  // https://developer.mozilla.org/en/DOM/MediaQueryListListener
  var MediaQueryListListener = function(listener){
    this.handleChange = listener;
  };

  // Mock interface of the MediaQueryList object, augmented by methods + properties needed by the polyfill
  // https://developer.mozilla.org/en/DOM/MediaQueryList
  var MediaQueryList = function(q){
    this.media = q;
    this.matches = null;
    this.addListener = function(listener){
      this._listeners.push(new MediaQueryListListener(listener));
    };
    this.removeListener = function(listener){
      this._listeners.remove(new MediaQueryListListener(listener));
    };

    // List of listeners to be run when updated.
    this._listeners = [];

    // Checks for match, updates values and runs listeners if appropriate.
    this._matchCheck = function(scope){
      var mql = (typeof scope == "undefined") ? this : scope;
      if(mql._testElement.offsetWidth === 42 != mql.matches){
        mql.matches = !mql.matches;
        
        for(var i = 0; i < mql._listeners.length; i++){
          mql._listeners[i].handleChange(mql);
        }
      }
    };
  };
  
  var addResizeEvent = function (fn) {
    fn();
    
    if(window.addEventListener) {
      window.addEventListener('resize', fn);
    } else {
      window.attachEvent('on' + 'resize', fn);
    }
  };

  return function(q){

    var mqList = new MediaQueryList(q);

    // Set up DOM listeners
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

    addResizeEvent(function () {
      mqList._matchCheck(mqList);
    });

    return mqList;

  };

}(document));