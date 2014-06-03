// ==UserScript==
// @name		append-hatebu.user.js
// @namespace	http://d.hatena.ne.jp/Yuzuemon/
// @include		http://*
// ==/UserScript==

(function(){
	if(parent === window){
		var url = location.href;
		var hatena = {
			entry: 'http://b.hatena.ne.jp/entry/',
			image: 'http://b.hatena.ne.jp/entry/image/',
			append: 'http://b.hatena.ne.jp/images/append.gif'
			}
		if (url.indexOf(hatena.entry) == 0) return false;

		var d = document;
		var div = d.createElement('div');
		div.setAttribute('id', 'hateblock');
		d.body.appendChild(div);
		var css = div.style;
		css.position = 'fixed';
		css.bottom = '0px';
		css.right = '0px';
		css.zIndex = 9999;

		// Add link
		var a = d.createElement('a');
		a.setAttribute('href', hatena.entry + url);
		a.setAttribute('target', '_blank');
		div.appendChild(a);
		// Add image in the link
		var i = d.createElement('image');
		i.setAttribute('src', hatena.image + url);
		a.appendChild(i);

		// Include Hatena Bookmarklet. http://b.hatena.ne.jp/register
		function bookmarklet(){
			var date = new Date;
			var d = document;
			var s = d.createElement('script');
			s.charset = 'UTF-8';
			s.src = 'http://b.hatena.ne.jp/js/Hatena/Bookmark/let.js?' + date.getFullYear() + date.getMonth() + date.getDate();
			(document.getElementsByTagName('head')[0] || d.body).appendChild(s);
		}
		// Add bookmarklet button
		var b = d.createElement('image');
		b.setAttribute('src', hatena.append);
		var css = b.style;
		css.cursor = 'pointer';
		b.addEventListener('click', bookmarklet, false);
		div.appendChild(b);
	}
})();
