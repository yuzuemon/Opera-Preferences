// ==UserScript==
// @name      docs_info_viewer.user.js
// @namespace yuzuemon
// @include   http://jira.co.jp/*
// ==/UserScript==

(function(){
  // oyakusoku
  var w = window;
  var d = w.document;

  // get shortlink, wikilink
  var title = d.title || '';
  title = title.replace(' - Jira ', '');
  var jira_id = title.slice(title.indexOf('#')+1, title.indexOf(']'));
  var url = location.href;
  if (url.indexOf('?') != -1 ) {
    url = url.slice(0, url.indexOf('?'));
  }

  var div = d.createElement('div');
  div.id = 'jira_info_viewer';
  div.class = 'userjs';

  var ai = d.createElement('input');
  ai.value = jira_id;
  ai.type = 'text';
  ai.readOnly = true;
  ai.onclick = function(){this.select(0, this.value.length);};
  ai.style.borderWidth = '0';
  ai.style.background = '#00ff99';
  div.appendChild(ai);
  div.appendChild(d.createElement('br'));
  var si = d.createElement('input');
  si.value = '{jira:' + jira_id + '}';
  si.type = 'text';
  si.readOnly = true;
  si.onclick = function(){this.select(0, this.value.length);};
  si.style.borderWidth = '0';
  si.style.background = '#00ff99';
  div.appendChild(si);
  div.appendChild(d.createElement('br'));
  var wi = d.createElement('input');
  wi.value = title + ' - ' + location.href;
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
  css.fontSize = '12pt';
  css.fontWeight = 'bold';
  css.color = '#242424';
  css.backgroundColor = '#00ff99';
  css.WebkitBorderRadius = '15px 0px 0px 0px';
  css.borderRadius = '15px 0px 0px 0px';
  css.opacity = '0.8';
  css.textAlign = 'left';
  css.right = '0px';
  css.bottom = '-78px';

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
  // behindBox(20, 1000);
})();
