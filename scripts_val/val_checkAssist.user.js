// ==UserScript==
// @name		val_checkAssist.user.js
// @author		yNk
// @version		1.1
// ==/UserScript==

(function(){
	if (location.href.indexOf('http://192.168.50.108/checkTool') == 0) {
		var d = document;									// document
		var f = d.getElementsByTagName('form');				// forms
		var selectTag = d.getElementById('targetserver');	// selectタグのID

		// 初期処理 ------------------------------------------------------------
		var start = function () {
			// 入力パラメータテーブルの拡大
			var divs = d.getElementsByTagName('div');
			for (var i = 0, len = divs.length; len >= i; i++) {
				if (typeof divs[i].style.height != 'undefined') {
					var divHeight = divs[i].style.height;
					if (divHeight == '350px') {
						divs[i].style.height = '640px';
						break;
					}
				}
			}

			// 不要な要素の非表示
			d.getElementById('ssiteHome').style.display = 'none';
			d.getElementById('supportSiteHeader').style.display = 'none';
			d.getElementById('supportSiteFooter').style.display = 'none';

			// div追加
			var userDiv = d.createElement('div');
			userDiv.setAttribute('id', 'div_button');
			selectTag.parentNode.insertBefore(userDiv, selectTag.parentNode.firstChild);

			// ボタン作成
			var UserButton = function (num) {
				this.elem;				// 要素
				this.valid = false;		// 有効
				this.setup(num);		// 設定(ボタン番号)
			}

			//

			// プロトタイプ
			UserButton.prototype = {
				// ラベル:設定 ---------
				setup: function (num) {
					// 引数格納
					var buttonId		= 'button' + num;
					var buttonValue		= 'パラメータセット' + num;
					var buttonMessage	= buttonValue + 'を自動挿入します。';

					// プロパティ設定
					this.elem = d.createElement('input');
					with (this.elem) {
						setAttribute('id',		buttonId);
						setAttribute('type',	'button');
						setAttribute('value',	buttonValue);
						setAttribute('title',	buttonMessage);
						setAttribute('alt',		buttonMessage);
						setAttribute('style',	'color: blue; font-size: large;');
					}
					userDiv.appendChild(this.elem);

					// 実行設定
					var self = this;
					this.elem.addEventListener('click', function () {
						if (self.valid) {
							self.off(num);	// off:を参照
						} else {
							self.on(num);	// on: を参照
						}
					}, false);
				},

				// ラベル:有効 ---------
				on: function (num) {
					// 3回回して全部offにする。
					for (var i = 1; 3 >= i; i++) {
						this.off(i);
					}

					apply(num);
					var buttonId		= 'button' + num;
					var buttonValue		= 'パラメータセット' + num;
					var buttonMessage	= buttonValue + 'を適用解除します。';
					var userButtonId	= d.getElementById(buttonId);

					userButtonId.setAttribute('title',	buttonMessage);
					userButtonId.setAttribute('alt',	buttonMessage);
					userButtonId.setAttribute('style',	'color: lime; font-size: large;');
					this.valid = true;
				},

				// ラベル:無効 ---------
				off: function (num) {
					nonapply();
					var buttonId		= 'button' + num;
					var buttonValue		= 'パラメータセット' + num;
					var buttonMessage	= buttonValue + 'を自動挿入します。';
					var userButtonId	= d.getElementById(buttonId);

					userButtonId.setAttribute('title',	buttonMessage);
					userButtonId.setAttribute('alt',	buttonMessage);
					userButtonId.setAttribute('style',	'color: blue; font-size: large;');
					this.valid = false;
				}
			}

			/*** 好きな数だけ増やしてね☆ *************************************/
			// 暫定3個
			var userButton1 = new UserButton(1);
			var userButton2 = new UserButton(2);
			var userButton3 = new UserButton(3);
			/******************************************************************/

			// 送信ボタンの追加
			var submitButton = d.createElement('input');
			with (submitButton) {
				setAttribute('type',		'submit');
				setAttribute('value',		'送信');
				setAttribute('onclick',		'sendCommand(true);return false;');
				setAttribute('onkeyenter',	'sendCommand(true);return false;');
				setAttribute('style',		'color: red; font-size: large;');
			}
			userDiv.appendChild(submitButton);

			// ステータスの追加
			var status = d.createElement('span');
			status.setAttribute('id',		'status');
			status.setAttribute('style',	'color: lime; font-size: large;');
			userDiv.appendChild(status);
		}

		var apply = function (num) {

			/*** 好きな値を入れてね☆ *****************************************/
			// オレのサーバー
			var url		= 'http://192.168.50.117/hoge.cgi';
			var urlName	= 'hoge';

			// パラメータセット(userButtonの数だけ増設可能)
			var paramSet = {};
			paramSet[1] = {
				val_from				: '高円寺',
				val_to					: '東京',
				val_year				: '2009',
				val_month				: '8',
				val_day					: '21',
				val_hour				: '10',
				val_minute				: '15',
				val_searchtype			: '0',
				val_oneway				: '1',
				val_popupmenu			: '111',
				val_co2mode				: '1'
			}
			paramSet[2] = {
				val_from				: '高円寺',
				val_to					: '東京',
				val_year				: '2009',
				val_month				: '8',
				val_day					: '21',
				val_hour				: '10',
				val_minute				: '15',
				val_searchtype			: '0',
				val_oneway				: '2',
				val_popupmenu			: '111'
			}
			paramSet[3] = {
				val_from				: '高円寺',
				val_to					: '東京',
				val_year				: '2009',
				val_month				: '8',
				val_day					: '21',
				val_hour				: '10',
				val_minute				: '15',
				val_searchtype			: '0',
				val_oneway				: '2',
				val_popupmenu			: '111',
				val_tassignmode			: '1',
				val_tassign_reflect		: '0',
				val_tassign_entryname	: 'て'
			}
			/******************************************************************/

			// インクリメンタルサーチ無効化
			d.forms[0].val_from.onkeyup = '';
			d.forms[0].val_to.onkeyup = '';

			// パラメータ自動入力処理
			for (var index in paramSet[num]) {
				var paramName  = index;
				var paramValue = paramSet[num][index];
				var obj = d.forms[0][paramName];

				// 存在したら自動入力
				if (typeof d.forms[0][paramName] != 'undefined') {
					obj.value = paramValue;
				}
			}

			// 選択されたoptionタグを削除
			selectTag.childNodes[1].removeAttribute('selected');

			// optionタグを追加(selectedも付加)
			if (selectTag.lastChild.value != url) {
				var tag = d.createElement('option');
				tag.setAttribute('value', url);
				tag.setAttribute('selected', 'selected');
				tag.innerText = urlName;
				selectTag.appendChild(tag);
			}

			// User JavaScript 適用を通知
			d.getElementById('status').innerText = '適用中';
		}

		var nonapply = function () {
			// パラメータ削除処理
			d.forms[0].reset();

			// 検証先を戻す
			//getElementById('userServer').removeAttribute('selected');
			//getElementById('windowsServer').setAttribute('selected', 'selected');

			// User JavaScript 適用を非通知
			d.getElementById('status').innerText = '';
		}

		// 実行条件
		if (d.body.innerHTML.indexOf('検証ページ') >= 0) {
			window.addEventListener("load", start, false);
		}
	}
})();
