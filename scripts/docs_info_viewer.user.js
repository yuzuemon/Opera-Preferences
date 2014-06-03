// ==UserScript==
// @name      docs_info_viewer.user.js
// @namespace yuzuemon
// @include   http://docs.co.jp/*
// ==/UserScript==

(function(){
  // oyakusoku
  var w = window;
  var d = w.document;

  // hide sidebar
  var sidebar = d.querySelector('#personal-info-sidebar');
  if (sidebar !== null)  {
    sidebar.className = 'noprint collapsed';
    var content = d.querySelector('#content');
    content.className = 'sidebarge view sidebar-collapsed';
  }

  // get shortlink, wikilink
  var linkList = d.head.querySelectorAll('link');
  var metaList = d.head.querySelectorAll('meta');
  var title = d.title || '';
  var sl = wl = '';
  for (var i = 0, len = linkList.length; len > i; i++) {
    if (linkList[i].rel == 'shortlink') {
      sl = linkList[i].href;
      break;
    }
  }
  for (var i = 0, len = metaList.length; len > i; i++) {
    if (metaList[i].name == 'wikilink') {
      wl = metaList[i].content;
      break;
    }
  }

  if (sl === '' && wl === '') {
    return false;
  }

  var div = d.createElement('div');
  div.id = 'docs_info_viewer';
  div.class = 'userjs';

  var ai = d.createElement('input');
  ai.value = title.split(' - ')[0] + ' - ' + sl;
  ai.type = 'text';
  ai.readOnly = true;
  ai.onclick = function(){this.select(0, this.value.length);};
  ai.style.borderWidth = '0';
  ai.style.background = '#00ff99';
  div.appendChild(ai);
  div.appendChild(d.createElement('br'));
  var si = d.createElement('input');
  si.value = sl;
  si.type = 'text';
  si.readOnly = true;
  si.onclick = function(){this.select(0, this.value.length);};
  si.style.borderWidth = '0';
  si.style.background = '#00ff99';
  div.appendChild(si);
  div.appendChild(d.createElement('br'));
  var wi = d.createElement('input');
  wi.value = wl;
  wi.type = 'text';
  wi.readOnly = true;
  wi.onclick = function(){this.select(0, this.value.length);};
  wi.style.borderWidth = '0';
  wi.style.background = '#00ff99';
  div.appendChild(wi);

  var css = div.style;
  css.height = 'auto';
  css.width = 'auto';
  css.position = 'fixed';
  css.padding = '5px 5px 10px 5px';
  css.margin = '0pt';
  css.zIndex = '1001';
  css.fontSize = '14px';
  css.fontWeight = 'bold';
  css.color = '#242424';
  css.backgroundColor = '#00ff99';
  css.WebkitBorderRadius = '15px 0px 0px 0px';
  css.borderRadius = '15px 0px 0px 0px';
  css.opacity = '0.8';
  css.textAlign = 'left';
  css.right = '0px';
  css.bottom = '-75px';

  // auto hide, show
  var timeout;
  var interval;
  var behindBox = function(step, wait){
    clearTimeout(timeout);
    clearInterval(interval);

    timeout = setTimeout(function(){
      var bottom = css.bottom.replace('px', '');
      var height = div.clientHeight;
      interval = setInterval(function(){
        css.bottom = bottom-- + 'px';
        if(height <= - bottom + 2) return clearInterval(interval);
      }, step);
    }, wait);
  };

  var showBox = function(step){
    clearTimeout(timeout);
    clearInterval(interval);
    var bottom = css.bottom.replace('px', '') - 0;
    interval = setInterval(function(){
      bottom += 2;
      if(bottom > 0){
        css.bottom = '0px';
        return clearInterval(interval);
      }
      css.bottom = bottom + 'px';
    }, step);
  };

  // add event
  div.addEventListener('mouseover', function(){showBox(10);}, false);
  div.addEventListener('mouseout', function(){behindBox(10, 200);}, false);
  d.body.appendChild(div);
  //behindBox(20, 1000);
})();

