/*
* matchMedia() polyfill - test whether a CSS media type or media query applies
* primary author: Scott Jehl
* Copyright (c) 2010 Filament Group, Inc
* MIT license
* adapted by Paul Irish to use the matchMedia API
* http://dev.w3.org/csswg/cssom-view/#dom-window-matchmedia
* which webkit now supports: http://trac.webkit.org/changeset/72552
*
* Doesn't implement media.type as there's no way for crossbrowser property
* getters. instead of media.type == 'tv' just use media.matchMedium('tv')
*/

if ( !(window.matchMedia) ){
  
  window.matchMedia = (function(doc, undefined){
    
    var bool,
        docElem = doc.documentElement,
        fakeBody = doc.createElement('body'),
        testDiv = doc.createElement('div');
    
    testDiv.setAttribute('id','ejs-qtest');
    fakeBody.appendChild(testDiv);
    
    return function(q){
      
        var styleBlock = doc.createElement('style'),
            cssrule = '@media '+q+' { #ejs-qtest { position: absolute; } }';
        
        styleBlock.type = "text/css";	//must set type for IE!	
        if (styleBlock.styleSheet){ 
          styleBlock.styleSheet.cssText = cssrule;
        } 
        else {
          styleBlock.appendChild(doc.createTextNode(cssrule));
        } 
        docElem.insertBefore(fakeBody, docElem.firstChild);
        docElem.insertBefore(styleBlock, docElem.firstChild);
        bool = ((window.getComputedStyle ? window.getComputedStyle(testDiv,null) : testDiv.currentStyle)['position'] == 'absolute');
        docElem.removeChild(fakeBody);
        docElem.removeChild(styleBlock);
        
        return { matches: bool, media: q };
    };
    
  })(document);

}



/*
 * EXAMPLE USAGE
 */

//test 'tv' media type
if (matchMedia('tv').matches) {
  // tv media type supported
}

//test a mobile device media query
if (matchMedia('screen and (max-width: 480px)').matches) {
  // smartphone/iphone... maybe run some small-screen related dom scripting?
}

//test landscape orientation
if (matchMedia('(orientation:landscape)').matches) {
  // probably tablet in widescreen view
}

