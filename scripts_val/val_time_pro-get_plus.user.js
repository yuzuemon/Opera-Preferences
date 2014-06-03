// ==UserScript==
// @name val_time_pro-get_plus
// @author yNk
// @version 1.0
// @description Customized Time Pro Get
// @include		http://flexweb/getweb/*.asp
// @include		http://flexweb/getweb/page/*.asp?*
// ==/UserScript==
(function(){
	if(location.href.indexOf('http://flexweb/getweb/') == 0 ) {
		var url = location.href;
		var title = document.title;
		var num = ['00000xxx'];			// ← xxxを自分の社員番号に
		var time = '19:00';				// ← 残業開始時刻

		if(title == 'Webメニュー画面'){						// 背景を見易く
			var tables = document.getElementsByTagName('table');
			for(var i = 0, len = tables.length; len > i; i++){
				var bgColor = tables[i].getAttribute('bgcolor');
				if(bgColor == '#003399'){
					tables[i].setAttribute('bgcolor', '#A0CDFF');
				}
			}

		} else if(title == '就業週報・月報'){				// デフォルトで自分 + 今月を選択
			var tables = document.getElementsByTagName('table');
			if(tables.length == 4 && document.referrer == 'http://flexweb/getweb/Xgw0000.asp'){
				SelectEmpCallBack(num, '');
			} else if(document.referrer.indexOf('Title=%8FA%8B%C6%8FT%95%F1%81E%8C%8E%95%F1') > 0){
				var date = new Date();
				var work = date.getMonth() + 1;
				var year = '' + date.getFullYear();
				var month =
					(work < 10)? '0' + work:
					(work < 13)? '' + work:
					'01';
				var yyyymm = year + month;

				var url = './Xaw1500.asp';
				url += '?MainMenuNo=&SubMenuNo=&Arg0=&ReLoad=1';
				url += '&Time=' + GetParmTime();
				url += '&YM=' + yyyymm;
				url += '&Option0=0&Option4=1&Option5=1';
				location.href = url;
			} else {
				// 過不足残業を計測
				var div = document.createElement('div');
				var css = div.style;
				css.height = 'auto'
				css.width = 'auto';
				css.padding = '5px 5px 10px 5px';
				css.margin = '0pt';
				css.zIndex = '1001';
				css.fontSize = '12px';
				css.fontWeight = 'bold';
				css.color = '#242424';
				css.backgroundColor = '#00ff99';
				css.borderRadius = '12px 0px 0px 0px';
				css.position = 'absolute';
				css.bottom = '0px';
				css.right = '0px';
				css.position = 'fixed';

				var time = 0;		// 過不足残業(分):
				var tds = document.getElementsByTagName('td');
				console.log(tds);
				for(var i = 0, len = tds.length; len > i; i++){
					if(tds[i].title.indexOf('過不足残業') != -1){
						console.log(tds[i].innerHTML);
						var cache = tds[i].innerHTML;
						console.log(cache);
						if(cache == '----'){						// ----
							continue;
						} else if (cache.indexOf('-') == 0){		// -2:48
							cache = cache.replace('-', '');
							splitedTime = cache.split(':');
							console.log(typeof splitedTime[0]);
							time -= (Number(splitedTime[0]) * 60 + Number(splitedTime[1]));
						} else {								// 0:45
							splitedTime = cache.split(':');
							console.log(typeof splitedTime[0]);
							time += (Number(splitedTime[0]) * 60 + Number(splitedTime[1]));
						}
			}
				}
				div.innerHTML = '残業時間' + Math.floor(time / 60) + ':' + (time % 60);
				// DOMに追加
				document.body.appendChild(div);
			}

		} else if(title == '夜間予定申請'){					// 文字列数チェック機能
			var text = document.getElementById('TxtNotes0');
			var div = document.createElement('div');
			var css = div.style;
			css.height = 'auto'
			css.width = 'auto';
			css.padding = '5px 5px 10px 5px';
			css.margin = '0pt';
			css.zIndex = '1001';
			css.fontSize = '128px';
			css.fontWeight = 'bold';
			css.color = '#242424';
			css.backgroundColor = '#00ff99';
			css.borderRadius = '48px 0px 0px 0px';
			css.position = 'absolute';
			css.bottom = '0px';
			css.right = '0px';

			var viewTextLength = function(){
				interval = setInterval(function() {
					var strSrc = escape(text.value);
					var strLen = 0;
					for(var i = 0, len = strSrc.length; len > i; i++){
						if(strSrc[i] == '%'){
							if(strSrc[++i] == 'u'){
								i+=4;
								strLen+=2;
							}
						} else {
							strLen++;
						}
					}

					if(strLen > 40){
						div.innerHTML = '<font color=\'red\'>' + strLen + '</font>';
					} else {
						div.innerHTML = strLen;
					}

				}, 100);
			};

			// 関数のセット
			viewTextLength();

			// DOMに追加
			document.body.appendChild(div);
		}
	}
})();
