// ==UserScript==
// @name dyeJS
// @author mallowlabs
// @namespace http://mallowlabs.s206.xrea.com/
// @version 0.0.1
// @license public domain
// @description : Syntax highlighting on JavaScript
// @published 2006-11-23
// @modified 2006-11-23
// @include *.js
// ==/UserScript==

// =========================================
// =========================================

(function () {
if(location.href.match(/\.js$/i)){

	// syntax highlighting
	var pre = document.getElementsByTagName('PRE')[0];
	var text = pre.innerHTML;
	text = text
//		.replace(/\"/g, "&quot;")
//		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/([\"\'])(.+?)([\"\'])/g,'<span class=\"literal\">$1$2$3</span>') // strings
		.replace(/(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|while|with)([ \.\"\'\{\(\);,&<])/g,'<span class=\"special\">$1</span>$2') // keywords
		.replace(/(RegExp|Array|Date|location|Math|document|navigator|String|window)([ \.\"\'\{\(\);,&<])/g,'<span class=\"keyword\">$1</span>$2') // special words
		.replace(/\/\/(.*)/g,'<span class=\"comment\">//$1</span>') // comments
		.replace(/\/\*((\n|.)+?)\*\//g,'<span class=\"comment\">/*$1*/</span>') // comments

		pre.innerHTML = text;
	
	// concat style node
	var st = document.createElement('STYLE');
	var stt = document.createTextNode(jsText());
	st.appendChild(stt);
	var hd = document.getElementsByTagName('BODY')[0];
	hd.appendChild(st);
	
	function jsText(){
		var stat = [
			'.keyword{color:#0000aa;}',
			'.special{color:#aa0000;}',
			'.literal{color:#ff5555;}',
			'.comment{color:#006600;}'
		];
		return stat.join(' ');
	}
}
})();