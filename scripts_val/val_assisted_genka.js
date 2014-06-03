// ==UserScript==
// @name val_assisted_genka.js
// @author yNk
// @version 1.0
// @description Assist 原価管理システム
// ==/UserScript==

(function(){
	// 共通部分 ------------------------------------------------
	var url = location.href;
	var d = document;

	// トップページ --------------------------------------------
	if(url.indexOf('http://shark/genka/Login') == 0){
		// DOM読み込み後に、前回のCookieが残っていたら削除
		window.addEventListener('DOMContentLoaded', clearCookie, false);
		// 前回のCookie削除関数
		function clearCookie(){
			if(msg.innerText == '前回の接続情報が残っているため、ログインできません。ブラウザを起動しなおしてください。'){
				d.cookie = 'JSESSIONID=; expires=Sat, 01 Jan 2000 00:00:00 GMT;';
			}
		}
	}

	// 月報一覧 ------------------------------------------------
	else if(url.indexOf('http://shark/genka/GeppoIchiran') == 0){
		window.addEventListener('DOMContentLoaded', addTargetBlank, false);
		function addTargetBlank(){
			var as = d.querySelectorAll('a');
			// 小ウィンドウで開くリンクに仕立て上げ
			for(var i = 0, len = as.length; len > i; i++){
				as[i].addEventListener('click', function(evt){
					var childWindow = window.open(this.getAttribute('href'), 'hoge');
					childWindow.focus();
					evt.preventDefault();
				}, false);
			}
		}
	}

	// 月報入力 ------------------------------------------------
	else if(url.indexOf('http://shark/genka/GeppoNyuryoku') == 0){
		window.addEventListener('DOMContentLoaded', DOMContentLoadedFunction, false);
		function DOMContentLoadedFunction(){
			if(frm_main.mode.value == 1){
				console.log('登録が完了しました。')
				frm_main.mode.value = 0;
			}
		}
		//window.opera.defineMagicVariable('frm_main.mode.value', function(curVal){return 0;}, null);

		window.opera.defineMagicFunction('fncToroku', function(){
			console.log('登録処理を実行します。')
			fncSumSagyojikan(1);

			frm_main.mode.value = 1;
			frm_main.submit();
		});

		/*
		// DOM読み込み後に実行する関数群 -------------------------------------------
		window.addEventListener('DOMContentLoaded', DOMContentLoadedFunction, false);
		function DOMContentLoadedFunction(){
			// 工程変更時に自動でプロジェクト選択
			var kotei = d.getElementsByName('kotei');
			for(var i=0,len=kotei.length;len > i; i++){
				kotei[i].addEventListener('change', autoSelectIntraProject(i), false);
			}
		}
		*/
	}
})();

