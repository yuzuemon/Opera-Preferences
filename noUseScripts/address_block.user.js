(function(){
	if(parent === window){
		var url = location.href;
		var title = document.title;
		var query = location.search;
		var info = '「' + title + ': ' + url + ' 」';
		var toggle = [];
		var tc = 0;

/*
		// promptInfo
		var promptInfo = function(e){
			prompt('『title + URL』', info);
			e.stopPropagation();
		}
*/

		// promptUrl
		var promptUrl = function(e){
			var newUrl = prompt('URL', url);
			if(newUrl != url && newUrl != null){
				location.href = newUrl;
			}
			e.stopPropagation();
		}
		
		var span = document.createElement('span');
		span.innerHTML = '=>';
		span.style.color = 'white';
		span.style.fontWeight = 'bold';
		span.style.backgroundColor = (url.indexOf('https') == 0)? '#FFFB00': '#00A37E';
		span.style.marginLeft = '5px';
		span.style.borderRadius = '10px';
		span.style.opacity = '0.8';
		//span.addEventListener('click', promptInfo, false);
		span.addEventListener('click', promptUrl, false);

		// url
		if(url)toggle.push(url);

		// title
		if(title)toggle.push(title);

		// query
		if(query){
			var queryList = query.split('?')[1].split('&');
			var queryObj = {};
			// Queryオブジェクト生成
			for(var i = 0, len = queryList.length; len > i; i++){
				if(queryList[i].indexOf('=') != -1){
					var key = queryList[i].split('=')[0];
					var val = queryList[i].split('=')[1];
					queryObj[key] = val;
				} else {
					queryObj[key] = '';
				}
			}
			// keyList生成/ソート
			var keyList = [];
			for(var key in queryObj){
				keyList.push(key)
			}
			keyList.sort();

			// ソート順にQueryをhtml化
			query = '<table><tbody>';
			query += '<tr><th colspan=2><font color=\"#ff0099\">' + title + '</font></th></tr>';
			for(var i = 0, len = keyList.length; len > i; i++){
				query += '<tr><td>' + keyList[i] + '</td><td>: ' + queryObj[keyList[i]] + '</td></tr>';
			}
			query += '</tbody></table>';
			toggle.push(query);
		}

		var tl = toggle.length;

		var div = document.createElement('div');
		var css = div.style;
		css.height = 'auto'
		css.width = 'auto';
		css.position = 'fixed';
		css.padding = '5px 5px 10px 5px';
		css.margin = '0pt';
		css.zIndex = '10001';
		css.fontSize = '14px';
		css.fontWeight = 'bold';
		css.color = '#242424';
		css.backgroundColor = (url.indexOf('https') == 0)? '#FFFB00': '#00ff99';
		css.borderRadius = '0px 0px 15px 0px';
		css.opacity = '0.8';
		css.textAlign = 'left';
		css.top = '0px';
		css.left = '0px';
		css.cursor = 'pointer';

		// toggleAction
		var toggleAction = function(){
			div.innerHTML = toggle[tc];
			div.appendChild(span);
			tc++;
			if(tc >= tl) tc = 0;
		}

		var timeout;
		var interval;
		var behindBox = function(step, wait){
			clearTimeout(timeout);
			clearInterval(interval);

			timeout = setTimeout(function(){
				var top = css.top.replace('px', '');
				var height = div.clientHeight;
				interval = setInterval(function(){
					css.top = top-- + 'px';
					if(height <= - top + 2) return clearInterval(interval);
				}, step);
			}, wait);
		}

		var showBox = function(step){
			clearTimeout(timeout);
			clearInterval(interval);
			var top = css.top.replace('px', '') - 0;
			interval = setInterval(function(){
				top += 2;
				if(top > 0){
					css.top = '0px';
					return clearInterval(interval);
				}
				css.top = top + 'px';
			}, step);
		}

		// イベント生成
		div.addEventListener('click', toggleAction, false);
		div.addEventListener('mouseover', function(){showBox(10)}, false);
		div.addEventListener('mouseout',  function(){behindBox(10, 500)}, false);
		toggleAction();
		document.body.appendChild(div);
		behindBox(20, 1000);
	}
})();