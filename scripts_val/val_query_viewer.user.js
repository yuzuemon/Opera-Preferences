// ==UserScript==
// @name		val_query_viewer
// @namespace	yNk
// ==/UserScript==

(function(){
	// Queryの内容を取得して表示
	var queryList = location.href.split('?')[1].split('&');
	var queryObj = {};
	var query = '';
		var title = '';
		var div = document.createElement('div');
		div.toggle = true;
		var css = div.style;
		css.height = 'auto';
		css.width = 'auto';
		css.position = 'fixed';
		css.padding = '5px 5px 10px 5px';
		css.margin = '0pt';
		css.zIndex = '1001';
		css.fontSize = '14px';
		css.fontWeight = 'bold';
		css.color = '#242424';
		css.backgroundColor = '#00ff99';
		css.borderRadius = '0px 15px 0px 0px';
		css.opacity = '0.8';
		css.textAlign = 'left';
		css.left = '0px';
		css.bottom = '0px';
		css.cursor = 'pointer';

	// Queryオブジェクト生成
	for (var i = 0, len = queryList.length; len > i; i++) {
		if (queryList[i].indexOf('=') != -1) {
			var key = queryList[i].split('=')[0];
			var val = queryList[i].split('=')[1];
			queryObj[key] = val;
			if (key == 'val_htmb') {
				title = '<font color=\"#ff0099\">' + queryList[i].split('=')[1] + '</font>.htmb';
			}
		}
	}
	// イントラじゃ無い場合
	if (title === '') {
		title = '<font color=\"#ff0099\">' + document.title + '</font>';
	}

	// QueryをHTML化 -----
	// keyList取得/ソート
	var keyList = [];
	for (var key in queryObj) {
		keyList.push(key)
	}
	keyList.sort();

	// ソート順にQueryをhtml化
	query += '<table><tbody>';
	for (var i = 0, len = keyList.length; len > i; i++){
		if(keyList[i] == 'val_htmb'){
			query += '<tr><td>' + keyList[i] + '</td><td>: <font color=\"#ff0099\">' + queryObj[keyList[i]] + '</font></td></tr>';
			continue;
		}
		query += '<tr><td>' + keyList[i] + '</td><td>: ' + queryObj[keyList[i]] + '</td></tr>';
	}
	query += '</tbody></table>';

	// DOM追加
	div.innerHTML = title;

	// イベント生成
	div.addEventListener('click', function(){
		if(div.toggle){
			div.innerHTML = query;
			div.toggle = false;
		} else {
			div.innerHTML = title;
			div.toggle = true;
		}
	}, false);

	if(document.body)document.body.appendChild(div);
})();
