if( location.href.match(/\.css$/i)){
	document.addEventListener('load', function(){
		var st = document.createElement('STYLE');
		var stt = document.createTextNode(cssText());
		st.appendChild(stt);
		var hd = document.getElementsByTagName('BODY')[0];
		hd.appendChild(st);
		var pre = document.getElementsByTagName('PRE')[0];
		var text = pre.innerText;
		text = text
			.replace(cssProp(), '<span class=\"prop\">$1</span>')
			.replace(/([\{\}])/g, '<span class=\"bracket\">$1</span>')
			.replace(/(\/\*.*?\*\/)/g, '<span class=\"comment\">$1</span>');
		pre.innerHTML = text;
		
		function cssText(){
			var stat = [
				'.prop{color:#0000aa;}',
				'.bracket{color:#aa0000;}',
				'.comment{color:#00aaaa!important;}'
			];
			return stat.join(' ');
		}
		function cssProp(){
			var propName = 'background background-attachment background-color background-image background-position background-repeat border border-collapse border-color border-spacing border-style border-top border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width border-bottom-width border-left-width border-width bottom caption-side clear clip color content counter-increment counter-reset cursor direction display empty-cells float font font-family font-size font-style font-variant font-weight height left letter-spacing line-height list-style list-style-image list-style-position list-style-type margin margin-right margin-left margin-top margin-bottom max-height max-width min-height min-width outline outline-color outline-style outline-width overflow padding padding-top padding-right padding-bottom padding-left position property-name quotes right table-layout text-align text-decoration text-indent text-transform top unicode-bidi vertical-align visibility white-space width word-spacing z-index';
			propName = '(' + propName.split(' ').join('|') + ')';
			return new RegExp(propName,'g');
		}
	}, false);
}
