// ==UserScript==
// @name dyeJS
// @author mallowlabs
// @version 0.0.1
// @description : Syntax highlighting on Apache log
// @published 2006-11-23
// @modified 2006-11-23
// @include *.log
// ==/UserScript==

// =========================================
// =========================================

(function () {
if(location.href.match(/\.log$/i)){

	// syntax highlighting
	var pre = document.getElementsByTagName('PRE')[0];
	var text = pre.innerHTML;
	text = text
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/([\"])(.+?)([\"])/g,'<span class=\"path\">$1$2$3</span>')			// path
		.replace(/(line)( [0-9]+?)([,])/g,'<span class=\"line\">$1$2</span>$3')		// line
		.replace(/([^ ]*)(Error:)(.*)(,)/g,'<span class=\"error\">$1$2</span><span class=\"errorExplain\">$3</span>$4')		// Error
//		.replace(/(referer:)(.*)/g,'<span class=\"referer\">$1$2</span>')			// referer
		//.replace(/(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|while|with)([ \.\"\'\{\(\);,&<])/g,'<span class=\"special\">$1</span>$2') // keywords
		//.replace(/(RegExp|Array|Date|location|Math|document|navigator|String|window)([ \.\"\'\{\(\);,&<])/g,'<span class=\"keyword\">$1</span>$2') // special words
		//.replace(/\/\/(.*)/g,'<span class=\"comment\">//$1</span>') // comments
		//.replace(/\/\*((\n|.)+?)\*\//g,'<span class=\"comment\">/*$1*/</span>') // comments

		pre.innerHTML = text;
	
	// concat style node
	var st = document.createElement('STYLE');
	var stt = document.createTextNode(logText());
	st.appendChild(stt);
	var hd = document.getElementsByTagName('BODY')[0];
	hd.appendChild(st);
	
	function logText(){
		var stat = [
			'.path{color:blue;}',
			'.line{color:red; font-weight:bold;}',
			'.error{color:red; font-weight:bold;}',
			'.errorExplain{color:red;}',
			'.referer{color:magenta;}',
			'.keyword{color:#0000aa;}',
			'.special{color:#aa0000;}',
			'.literal{color:#ff5555;}',
			'.comment{color:#006600;}'
		];
		return stat.join(' ');
	}
}
})();