// ==UserScript==
// @name val_gCalendar.js
// @author yNk
// @version 1.0
// @description Custom Google Calendar
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	if (location.href.indexOf('https://www.google.com/calendar/render') == 0){

		// タイトル変更 --------------------------------------------------------
		document.title = 'Google Calendar Prime';

		// 非表示  -------------------------------------------------------------
		document.getElementById('gbar').style.display = 'none';
		document.getElementById('guser').style.display = 'none';
		document.getElementById('topBar').style.display = 'none';
		document.getElementById('clst_fav').style.display = 'none';
		document.getElementById('rhstogglecell').style.display = 'none';
		document.getElementById('gadgetcell').style.display = 'none';


		// ----------------------------
		// ハシビロ先生召喚
		// ----------------------------
		// divタグを生成・追加
		var test = document.getElementsByClassName('noprint');
		var tag = document.createElement('div');
		var noPrint = document.getElementsByClassName('noprint');
		tag.setAttribute('id', 'uTag');
		tag.setAttribute('width', '163px');
		tag.setAttribute('style', 'text-align: center; overflow: hidden; position: absolute; float: left; top: 0px; left: 100px; z-index: 10000;');
		tag.addEventListener('click', function(){
			if (noPrint[0].style.display != 'none' ){
				for (var i = 0, len = noPrint.length; len >= i; i++){
					noPrint[i].style.display = 'none';
				}
			} else {
				for (var i = 0, len = noPrint.length; len >= i; i++){
					noPrint[i].style.display = 'block';
					document.getElementById('gadgetcell').style.display = 'none';
				}
			}
		}, false);
		document.body.appendChild(tag);

		// imgタグを生成・追加
		var tag = document.createElement('img');
		tag.setAttribute('src', 'http://192.168.50.117/link/dora.png');
		tag.setAttribute('alt', 'ハシビロさん');
		tag.setAttribute('title', 'ハシビロさん');
		tag.setAttribute('width', '30px');
		tag.setAttribute('width', '40px');
		document.getElementById('uTag').appendChild(tag);
	}
},false);
