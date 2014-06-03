(function() {
  window.addEventListener('DOMContentLoaded', setScrollBar, false);
  window.addEventListener('load', setScrollBar, false);

  function setScrollBar(ev) {
    window.removeEventListener('DOMContentLoaded', setScrollBar, false);
    window.removeEventListener('load', setScrollBar, false);

    var root = document.compatMode === 'BackCompat' ? document.body : document.documentElement;

    var scrollbar = document.createElement('div');
    var sb = scrollbar.style;
    sb.position = 'fixed';
    sb.padding = 0;
    sb.margin = 0;
    sb.right = 0;
    sb.top = 0;
    sb.width = '10px';
    sb.height = '100%';
    sb.backgroundColor = 'white';
    sb.zIndex = '10000';
    sb.opacity = 0;
    document.body.appendChild(scrollbar);

    var scroller = document.createElement('div');
    var ss = scroller.style;
    ss.position = 'relative';
    ss.marginLeft = '1px';
    ss.marginRight = '1px';
    ss.borderRadius = '4px';
    ss.width = '8px';
    ss.backgroundColor = 'black';
    scrollbar.appendChild(scroller);

    var timeout;
    var interval;

    var showScrollBar = function() {
      clearTimeout(timeout);
      clearInterval(interval);

      ss.height = Math.max(10, root.clientHeight / root.scrollHeight * root.clientHeight) + 'px';
      ss.top = root.scrollTop / root.scrollHeight * root.clientHeight + 'px';
      sb.opacity = 0.4;

      timeout = setTimeout(function() {
        var steps = 20;
        interval = setInterval(function() {
          sb.opacity = (--steps) * 0.02;
          if (steps <= 0) return clearInterval(interval);
        }, 25);
      }, 500);
    };

    if (ev.type === 'load') {
      showScrollBar();
    } else {
      window.addEventListener('load', showScrollBar, false);
    }
    window.addEventListener('scroll', showScrollBar, false);
  }
}())