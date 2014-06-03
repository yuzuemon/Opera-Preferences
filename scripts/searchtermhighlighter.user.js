// Search Term Highlighter user script
// version 1.0
// 2005-06-16
// Copyright (c) 2005, Reify
//
// --------------------------------------------------------------------
//
// This is a user script.
//
// To install for Internet Explorer, you need Turnabout:
// http://www.reifysoft.com/turnabout.php
// See instructions for using Turnabout here:
// http://www.reifysoft.com/turnabout.php?p=u
//
// To install for Firefox, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// 2006/7/3: hacked by Gimite Ichikawa:
//       Patches from http://www3.atwiki.jp/safari/pages/9.html
//
// 2006/1/17: hacked by Gimite Ichikawa:
//       Now works in Opera 8.5.
//       Now works in Firefox 1.5 with Greasemonkey 0.6.4.
//       Now supports *.co.* search engines.
//       Workaround for pages including prototype.js v1.4.0.
//       Now supports non-ASCII (UTF-8) query terms.
//
// 0.71: Term checkboxes are checked by default in IE as they should be.
//
// 0.70: Now only highlights if the referrer is a search engine with
//       search terms in the query string.
//
// 0.65: Now works in Internet Explorer 6 with Turnabout.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Search Term Highlighter
// @namespace     http://www.reifysoft.com/?scr=sth
// @description   Highlight my search terms
// @include       *
// @exclude       *:4664/*
// @exclude       *mail.google.com/*
// @exclude       *maps.google.com/*
// ==/UserScript==

/*
  To-do
  - Remove getTermIndex()
  - Supports Google cache
  - Better tokenizing
  
  - BUG: Toolbar doesn't show up (right?) on pages with frames
  - BUG: Only restore highlight style to former cursor element if that term's highlighting is still enabled
  - Expose options in UI
*/

(function(){ // Anonymous function to prevent tainting global scope (in case of Opera)

/****** Constants ******/

// Options: Tweak these for happy fun times
var ENABLE_TERM_LOOKUP = true;  // Lets you click the search term on the toolbar to find it on the page
var ENABLE_ON_SE_PAGES = false; // Highlight your terms on the search engine results page
var WHOLE_WORDS_ONLY = false;  // If true, only search complete words (e.g. hello.jpg in a page doesn't match a search string of ".jpg")
var KNOWN_SEARCH_ENGINES_ONLY = true; // If this is false, the script will try to pick up terms from any page it visits by looking for QUERYATTR_DEFAULT in every URL.

// Settings for understanding search engines' query syntax
var TERMDELIMITERS = [ "+", "%20", "%E3%80%80" ];  // Try splitting up the list of terms by these
var QUERYATTR_DEFAULT = "q";  // Use this when the search engine is unknown

// Script settings: Users can ignore these
var NS = "dnl2baSTH-";  // Prefix for some attributes, variables, etc. to help avoid collisions
var STORAGE_TERMS = "terms";  // Store terms with this variable name

var BENCHMARK = false;



/*
  Search engine list
  ------------------
  Add new search engines here if their query attribute isn't the same as QUERYATTR_DEFAULT (above).  The script will look for the "ident" string in each page's URL and use the corresponding query attribute.
*/
var SEs =
{
  googleImages:
  {
    ident: "images.google.co", // google.com, google.co.*
    queryAttr: "q"
  },
  google:
  {
    ident: "google.co",
    queryAttr: "q"
  },
  msn:
  {
    ident: "search.msn.co",
    queryAttr: "q"
  },
  yahooLocal:
  {
    ident: "local.yahoo.co",
    queryAttr: "stx"
  },
  yahoo:
  {
    ident: "search.yahoo.co",  // *.search.yahoo.com
    queryAttr: "p"
  },
  askjeeves:
  {
    ident: "web.ask.com",
    queryAttr: "q"
  }
};



/****** Style sheets ******/

function defineStyles()
{
  style_highlight =
  [
    { color: "black", backgroundColor: "#ffa" },
    { color: "black", backgroundColor: "#cff" },
    { color: "black", backgroundColor: "#cfc" },
    { color: "black", backgroundColor: "#fcf" },
    { color: "black", backgroundColor: "#ccf" },
    { color: "black", backgroundColor: "#fcc" }
  ];

  style_toolbar =
  {
    backgroundColor: "#f5f5f5",
    color: "#000",
    borderTop: "2px solid #ccc",

    textAlign: "left",
    fontSize: "9pt",
    fontFamily: "verdana, arial, sans-serif",

    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,

    height: "2em",
    minHeight: "2em",
    padding: "0 0 0 0",
    overflow: "hidden"
  };

  style_toolbarLabel =
  {
    display: "inline",
    padding: "4px .5em 4px 4px"
  };

  style_toolbarTermList =
  {
    display: "inline",

    listStyleType: "none",
    padding: "0 0 4px",
    margin: 0
  };

  style_toolbarTerm =
  {
    display: "inline",
    margin: "0 .5em 0 0",
    padding: 0
  };

  style_toolbarTermAnchor =
  {
    textDecoration: "none",
    color: "#000",
    fontSize: "9pt",
    fontFamily: "verdana, arial, sans-serif"
  };

  style_toolbarTermToggler =
  {
  };

  style_toolbarTermLookupEnabled =
  {
    borderBottom: "1px solid blue",
    cursor: "pointer",
    MozUserFocus: "ignore",
    MozUserSelect: "none"
  };

  style_toolbarClearButton =
  {
    position: "absolute",
    right: "2px",
    bottom: "2px",
    zIndex: 1010
  };

  style_cursor =
  {
    //border: "2px inset gray",
    //fontSize: "120%",
    //fontWeight: "bold",
    //textDecoration: "blink",
    backgroundColor: "navy",
    color: "white"
  };

  // Maps exceptions to the usual JS/CSS name conversion rules
  specialStyleMap =
  {
    styleFloat: "float"
  };
}

var SE = identifySE(document.referrer);
if (!SE) return;

var terms = getSearchTerms(SE);
var nodesWithTerms = new Array();
var glStyleSheet = null;
var origCursorStyles = {};

/****** Main ******/

function main()
{
  if (BENCHMARK)
  {
    var d1 = new Date();
    var d1_ms = Date.parse(d1.toString()) + d1.getMilliseconds();
  }

  if (!SE || !terms || !document.body || (!ENABLE_ON_SE_PAGES && identifySE(location.href)))
    return;

  ua = detectUA();  // global var

  defineStyles();
  initInstanceTracker();
  doHighlight();
  if (top == self) makeToolbar(terms);  // not in iframes or frames

  if (BENCHMARK)
  {
    var d2 = new Date();
    var d2_ms = Date.parse(d2.toString()) + d2.getMilliseconds();
    GM_log("Initialization took " + (d2_ms - d1_ms) + " ms");
  }
}

function $(id) { return document.getElementById(id); }

function doHighlight()
{
  var frames = document.getElementsByTagName("frame");
  for (var i = 0; i < frames.length; i++)
  {
    var f = frames[i]["name"];
    if (f && f.document && f.document.body) markSearchTerms(f.document.body, terms);
  }

  if (frames.length == 0) markSearchTerms(document.body, terms);
}


/****** Search terms ******/

function getSearchTerms(searchEngine)
{
  var terms =
    (searchEngine || !KNOWN_SEARCH_ENGINES_ONLY) ?
    getSearchTermsFromQueryString(searchEngine, document.referrer) :
    null;

  return terms;
}

function identifySE(uri)
{
  for (var i in SEs)
    if (uri.indexOf(SEs[i].ident) != -1) return SEs[i];

  return null;
}

function getSearchTermsFromQueryString(searchEngine, uri)
{
  if (uri.indexOf("?") == -1) return null;

  var nvPairs = uri.substring(uri.indexOf("?") + 1, uri.length).split("&");
  for (var i= 0; i<nvPairs.length; ++i)
  {
    var halves = nvPairs[i].split("=");
    if (halves[0] == (searchEngine ? searchEngine.queryAttr : QUERYATTR_DEFAULT))
    {
      for (var j= 0; j<TERMDELIMITERS.length; ++j)
      {
        if (halves[1].indexOf(TERMDELIMITERS[j]) == -1) continue; // Wrong delimiter, or there're no delimiters
        return cleanTerms(halves[1].split(TERMDELIMITERS[j]));
      }
      return cleanTerms(new Array(halves[1]));
    }
  }
  return null;  // Couldn't identify the query attribute
}

function cleanTerms(terms)
{
  for (var i = 0; i < terms.length; i++)
  {
    var term = utf8EncToStr(terms[i]).toLowerCase().replace(/\"/g, "").replace(/\'/g, "");  // remove quotes

    if
    (
      term.search(/(site:|link:|related:|cache:|\.\.)/i) != -1 || // Various search keywords
      term.charAt(0) == "-" ||  // Negative keyword
      term == "or" ||
      term.replace(/^\s*(.*)/, "$1").replace(/(.*?)\s*$/, "$1").length == 0 // Empty after whitespace trim
    )
    {
      terms.splice(i--, 1);
      continue;
    }

    if (term.charAt(0) == "+" || term.charAt(0) == "~")
      term = term.substring(1, term.length);

    terms[i] = term;
  }

  return terms.length > 0 ? terms : null;
}

//Based on http://www.onicos.com/staff/iz/amuse/javascript/expert/
function utf8EncToStr(str){
  
  var out, i, len;
  
  len = str.length;
  i= 0;
  chars= [];
  while(i < len){
    var ch= str.charAt(i);
    if (ch=="%"){
      chars.push(parseInt(str.substring(i+1, i+3), 16));
      i+= 3;
    }else if (ch=="+"){
      chars.push(0x20);
      ++i;
    }else{
      chars.push(str.charCodeAt(i));
      ++i;
    }
  }
  
  out = "";
  len = chars.length;
  i = 0;
  while(i < len) {
    switch (chars[i] >> 4){
      case 14: // 1110 xxxx  10xx xxxx  10xx xxxx
        wchar= ((chars[i++] & 0x0F) << 12) |
          ((chars[i++] & 0x3F) << 6) |
          ((chars[i++] & 0x3F) << 0);
        break;
      case 12: case 13: // 110x xxxx  10xx xxxx
        wchar= ((chars[i++] & 0x1F) << 6) | (chars[i++] & 0x3F);
        break;
      default: // 0xxxxxxx
        wchar= chars[i++];
        break;
    }
    var hex= wchar.toString(16);
    while (hex.length<4) hex= "0"+hex;
    out+= "%u"+hex;
  }
  
  return unescape(out);
  
}


/****** Find-and-replace ******/

function markSearchTerms(baseNode, terms)
{
  getNodesWithTerms(baseNode, terms);
  for (var i= 0; i<nodesWithTerms.length; ++i)
  {
    var nodes = new Array(nodesWithTerms[i]); // We're going to expand this with more nodes as we find them
    while (nodes.length > 0)
    {
      var node = nodes.shift();
      for (var j= 0; j<terms.length; ++j)
      {
        var termLoc = node.nodeValue.search(new RegExp(
          (WHOLE_WORDS_ONLY ? "\\b" : "") + terms[j] + (WHOLE_WORDS_ONLY ? "\\b" : ""), "i"));
        if (termLoc == -1) continue;
        else if (termLoc == 0)  // if starts with term
        {
          if (node.parentNode.className && node.parentNode.className.indexOf(NS + "term") != -1) continue;  // duplicate.  Why does this happen?

          if (node.nodeValue.length > terms[j].length)
          {
            node.splitText(terms[j].length);
            nodes.push(node.nextSibling);
          }

          var s = document.createElement("span");
          s.className = NS + "term " + NS + "termColor" + (j % style_highlight.length);
          s.id = NS + "instance" + instanceCount++;
          highlightInstance(s, j % style_highlight.length, true);
          node.parentNode.insertBefore(s, node);
          s.appendChild(node);

          instanceTracker[terms[j]].push(s.id);
        }
        else  // if term comes later
        {
          node.splitText(termLoc);
          nodes.unshift(node.nextSibling);
        }
      }
    }
  }
}

function getNodesWithTerms(node, terms)
{
  if (node.nodeType == 3)
  {
    var wb = WHOLE_WORDS_ONLY ? "\\b" : "";
    if (node.nodeValue.search(new RegExp(wb + "(" + terms.join("|") + ")" + wb, "i")) != -1)
      nodesWithTerms.push(node);
  }
  else if (node && node.nodeType == 1 && node.hasChildNodes() && !node.tagName.match(/(head|script|style|frameset|frame|iframe)/i))
    for (var i= 0; i<node.childNodes.length; ++i)
      getNodesWithTerms(node.childNodes[i], terms);
}


// Can't extend prototypes for some reason in this script.
function copyProperties(from, to, positive)
{
  for (var i in from)
    to[i] = (positive == undefined || positive) ? from[i] : null;
}


/****** Toolbar ******/

function makeToolbar(terms)
{
  var toolbar = document.createElement("div");
  toolbar.id = NS + "toolbar";
  copyProperties(style_toolbar, toolbar.style);

  var labelEl = document.createElement("div");
  labelEl.id = NS + "description";
  labelEl.appendChild(document.createTextNode("Your search terms:"));
  copyProperties(style_toolbarLabel, labelEl.style);

  var termList = document.createElement("ul");
  termList.id = NS + "termList";
  copyProperties(style_toolbarTermList, termList.style);

  var highlightTogglers = new Array();

  for (var i= 0; i<terms.length; ++i)
  {
    var termEl = document.createElement("span");
    termEl.className = NS + "term " + NS + "termColor" + i;
    copyProperties(style_toolbarTerm, termEl.style);
    highlightInstance(termEl, i % style_highlight.length, true);

    var highlightToggler = document.createElement("input");
    highlightToggler.type = "checkbox";
    addClickListener(highlightToggler, function(j){
      return function(e, box){ highlightTerm(j, box.checked); }
    }(i));
    copyProperties(style_toolbarTermToggler, highlightToggler);
    termEl.appendChild(highlightToggler);
    highlightTogglers.push(highlightToggler); // save till later; can't check them yet in IE b/c not attached to the document
    
    var anchor = document.createElement("a");
    anchor.href= "javascript:void(0);";
    copyProperties(style_toolbarTermAnchor, anchor.style);
    anchor.appendChild(
      document.createTextNode(
        unescape(terms[i]) +
        (ENABLE_TERM_LOOKUP ? " (" + instanceTracker[terms[i]].length + ")" : "")
      )
    );
    termEl.appendChild(anchor);

    if (ENABLE_TERM_LOOKUP)
    {
      addClickListener(anchor, (function(term){
        return function(e, c){
          findNextInstance(term);
          stopEventPropagation(e);
        };
      })(terms[i]));
      copyProperties(style_toolbarTermLookupEnabled, termEl.style);
    }

    termList.appendChild(termEl);

  }


  var clearButton = document.createElement("button");
  clearButton.appendChild(document.createTextNode("x"));
  addClickListener(clearButton, function(){
    hide();
    GM_setValue(STORAGE_TERMS, "");
  });
  copyProperties(style_toolbarClearButton, clearButton.style);

  toolbar.appendChild(labelEl);
  toolbar.appendChild(termList);
  toolbar.appendChild(clearButton);

  if (document.body)
  {
    document.body.appendChild(toolbar);
    for (var i = 0; i < highlightTogglers.length; i++)
      highlightTogglers[i].checked = true;  // we can check these now (IE requires them to be attached to the document first)
  }


  if (ua == "iewin")
  {
    toolbar.style["position"] = "absolute";
    window.attachEvent("onscroll", repositionToolbar);
    window.attachEvent("onresize", repositionToolbar);
    // document.documentElement.onscroll = repositionToolbar;
    repositionToolbar();
  }

}

function addClickListener(node, listener)
{
  if (node.addEventListener){ // Firefox, Opera
    node.addEventListener('click', function(e){ listener(e, this); }, false);
  }else{ // IE
    node.onclick= function(){
      listener(window.event, this);
      return !window.event.cancelBubble;
    };
  }
}

// For browsers that don't support position: fixed
function repositionToolbar()
{
  var t = $(NS + "toolbar");
  t.style["top"] = (Utility.scrollTop() + Utility.viewportHeight() - t.offsetHeight) + "px";
  t.style["left"] = Utility.scrollLeft() + "px";
  t.style["width"] = Utility.viewportWidth() + "px";
}



/****** Instance lookup ******/

// Global variables for tracking terms
function initInstanceTracker()
{
  instanceCount = 0;  // Helps make unique IDs
  instanceTracker = new Object(); // Here, we'll associate each term with a list of its instances
  for (var i= 0; i<terms.length; ++i) instanceTracker[terms[i]] = new Array();
  cursor = null;
}

function findNextInstance(term)
{
  if (BENCHMARK)
  {
    var d1 = new Date();
    var d1_ms = Date.parse(d1.toString()) + d1.getMilliseconds();
  }

  if (cursor != null)
    restoreOrigCursorStyle($(cursor));
  
  if (instanceTracker[term] == null || instanceTracker[term].length == 0) return;

  cursor = instanceTracker[term].shift();
  instanceTracker[term].push(cursor);

  var cursorElNew = $(cursor);
  setNewCursorStyle(cursorElNew);

  scrollTo(0, elementTop(cursorElNew) - 100); // should cover 99% of cases (no left scroll)
  // cursorElNew.scrollIntoView(true);

  if (BENCHMARK)
  {
    var d2 = new Date();
    var d2_ms = Date.parse(d2.toString()) + d2.getMilliseconds();
    GM_log("Find took " + (d2_ms - d1_ms) + " ms");
  }
}

function setNewCursorStyle(el)
{
  if (typeof origCursorStyles[el.id] != undefined) origCursorStyles[el.id] = new Object();
  for (var i in style_cursor)
  {
    var s = getStyle(el, ua == "iewin" ? i : mapJSStylePropertyToCSS(i));
    origCursorStyles[el.id][i] = s == undefined ? "" : s;  // IE likes blank, but not null or undefined
  }
  copyProperties(style_cursor, el.style);
}

function restoreOrigCursorStyle(el)
{
  // TODO:  Only if highlighting on this term is enabled

  if (typeof origCursorStyles[el.id] != undefined)
    copyProperties(origCursorStyles[el.id], el.style);
}


// Maps JS style properties to CSS, e.g. "backgroundColor" to "background-color"
function mapJSStylePropertyToCSS(property)
{
  if
  (
    (ua == "iewin" && typeof specialStyleMap[property] != undefined) || // If it's not in the map, typeof is undefined in IE but defined in Moz
    (ua != "iewin" && specialStyleMap[property])  // need to short-circuit before IE hits this so it doesn't throw an exception
  )
    return specialStyleMap[property];
  if ((new RegExp("[AZ]+")).test(property))
    return property;

  var outStr = "";
  for (var i = 0; i < property.length; i++)
  {
    var chCode = property.charCodeAt(i);
    outStr += chCode >= 97 ? property.charAt(i) : "-" + String.fromCharCode(chCode + 32);
  }

  return outStr;
}


function hide()
{
  $(NS + "toolbar").style.display = "none";
  $(NS + "toolbar").style.zIndex = "-5";  // if the display didn't do it (like on yahoo.com front page)

  if (cursor) restoreOrigCursorStyle($(cursor));

  for (var i= 0; i<terms.length; ++i) highlightTerm(i, false, true);
}

function highlightTerm(termIndex, positive, force)
{
  var term = terms[termIndex];
  var tracker = instanceTracker[term];
  
  for (var instance= 0; instance<tracker.length; ++instance)
    highlightInstance($(tracker[instance]), termIndex % style_highlight.length, positive, force);
}

function highlightInstance(el, hsInd, positive, force)
{
  if (el.id == cursor && !force) return;

  for (var i in style_highlight[hsInd])
    el.style[i] = positive ? style_highlight[hsInd][i] : "";
}

function stopEventPropagation(e)
{
  if (!e) var e = window.event;
  e.cancelBubble = true;  // MS way
  if (e.preventDefault) e.preventDefault(); // Firefox 1.5 way?
  if (e.stopPropagation) e.stopPropagation(); // W3C way
}

function detectUA()
{
  var knownAgents = [ "konqueror", "safari", "opera", "msie", "mozilla/5", "netscape" ];
  var uaString = navigator.userAgent.toLowerCase();

  for (var i = 0; i < knownAgents.length; i++)
    if (uaString.indexOf(knownAgents[i]) != -1)
      return uaStringToNice(knownAgents[i]);

  return null;
}

function uaStringToNice(str)
{
  if (str == "msie") return "iewin";
  else if (str == "mozilla/5") return "gecko";
  else if (str == "konqueror" || str == "safari") return "khtml";
  else if (str == null) return "unknown";
  return str;
}


/* The following cross-browser functions taken or adapted from PPK of Quirksmode */

/* The top coordinate of el relative to the viewport. */
function elementTop(el)
{
  if (!el) return;
  if (!el.offsetTop || !el.offsetParent) return -1;

  var topCoord = 0;
  while (el.offsetParent)
  {
    topCoord += el.offsetTop;
    el = el.offsetParent;
  }

  return topCoord;
}

function getStyle(someElement, styleProp)
{
  if (document.defaultView) // Netscape way
    return document.defaultView.getComputedStyle(someElement, null).getPropertyValue(styleProp);
  else if (someElement.currentStyle)  // MS way
    return someElement.currentStyle[styleProp];
  else
    return null;
}

var Utility =
{
  
  viewportWidth: function() { return Utility.detectAndUseAppropriateObj("clientWidth"); },
  viewportHeight: function() { return Utility.detectAndUseAppropriateObj("clientHeight"); },
  scrollLeft: function() { return Utility.detectAndUseAppropriateObj("scrollLeft"); },
  scrollTop: function() { return Utility.detectAndUseAppropriateObj("scrollTop"); },

  // Thanks to PPK of Quirksmode for this detection scheme.
  detectAndUseAppropriateObj: function(prop)
  {
    if (document.documentElement && document.documentElement[prop])
      return document.documentElement[prop];
    else if (document.body && document.body[prop])
      return document.body[prop];
    else
      return -1;
  }
  
};

main();

})(); // End of anonymous function
