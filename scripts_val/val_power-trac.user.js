// ==UserScript==
// @name val_power-trac.user.js
// @author yNk
// @version 1.0
// @description exteded power egg && trac.
// ==/UserScript==

(function(){
	var d = document;
	var url = location.href;
	var title = d.title;

	// Trac拡張 --------------------------------------------
	if(url.indexOf('http://trac.co.jp/') === 0){
		var textArea;
		if(url.indexOf('/ticket') >= 0 || url.indexOf('/newticket') >= 0){
			textArea = d.getElementById('field-description');
		} else if (url.indexOf('/wiki') >= 0){
			textArea = d.getElementById('text');
		}

		// テキストエリアの拡大
		textArea.setAttribute('cols', '130');
		textArea.setAttribute('rows', '40');
	}

	// PowerEgg拡張 ----------------------------------------
	if(url.indexOf('http://PowerEggServlet') === 0) {
		if(title === 'POWER EGG ナビビュー'){
			// ドラちゃん ----------------------------------
			/*
			var span = d.getElementById('girlmessage');
			span.innerHTML = 'いや、<br>そのりくつは<br>おかしい。';
			var style = span.parentNode.getAttribute('style');
			span.parentNode.setAttribute('style', style + 'text-align: left');
			*/

			var imgList = d.getElementsByTagName('img');
			for(var i = 0, len = imgList.length; len > i; i++){
				if(imgList[i].getAttribute('src') === '/pe4j/NNV/image/nic.gif'){
					imgList[i].setAttribute('src', 'http://localhost/link/dora.png');
				}
			}
		}

		if(title === '電子会議室データ登録'){
			var texts = d.getElementsByClassName('text_on');
			var textAreas = d.getElementsByClassName('textarea_on');

			// テキストエリアの拡大 ------------------------
			textAreas[0].setAttribute('cols', '130');
			textAreas[0].setAttribute('rows', '30');
			textAreas[0].setAttribute('wrap', 'soft');

			// テンプレート挿入ボタンリスト ----------------
			var listener = {
				handleEvent: function(event){
					this.target.value = this.template;
				}
			}

			var button = function(target, value, template){
				this.target = d.getElementsByClassName(target)[0];		// 対象(classで指定)
				this.elem = d.createElement('input');					// 要素
				this.elem.setAttribute('type', 'button');
				this.elem.setAttribute('value', value);					// ボタン名
				this.template = template;								// テンプレート
				this.elem.addEventListener('click', listener, false);	// イベントセット
				this.target.parentNode.appendChild(this.elem);
			}

			var test = new button('text_on', 'てすと', 'ああああ');
		}
	}
})();
