'use strict';
window.Library = {
/**
 * @description Индексирует массив по указанному полю
 * @param {Array} data
 * @param {String} id = 'id'
*/
indexBy: function (data, id) {
	if (data && data.isIndexedObject) {
		return data;
	}
	id = id ? id : 'id';
	var i = 0, r = {order:[]};
	$(data).each(function(i, j){
		if (j && j[id]) {
			r[j[id]] = j;
			r.order.push(j[id]);
		}
	});
	r.isIndexedObject = 1;
	return r;
},
/**
 * @description Индексирует массив по указанному полю
 * @param {Array} data
 * @param {String} id = 'id'
 * @return {Object};
*/
storage:function(key, data) {
	var L = window.localStorage;
	if (L) {
		if (data === null) {
			L.removeItem(key);
		}
		if (!(data instanceof String)) {
			data = JSON.stringify(data);
		}
		if (!data) {
			data = L.getItem(key);
			if (data) {
				try {
					data = JSON.parse(data);
				} catch(e){;}
			}
		} else {
			L.setItem(key, data);
		}
	}
	return data;
},
/**
 * @description аналог php $_SERVER[REQUEST_URI]
 * @param {Boolean} base = falseif true return only part before '?'
 * @return {String};
*/
REQUEST_URI:function(base) {
	var s = window.location.href;
	s = s.replace(this.HTTP_HOST(s), '');
	if (base) {
		s = s.split('?')[0].split('#')[0];
	}
	return s;
},
/**
 * @description аналог php $_SERVER[HTTP_HOST]
 * @return {String};
*/
HTTP_HOST:function(s) {
	if (!s) {
		s = window.location.href;
	}
	return s.split('/').slice(0, 3).join('/');
},
/**
 * @description Средство установки переменной по умолчанию в TRUE
 * @return {String};
*/
True:function(val) {
	val = String(val) === 'undefined' ? true : val;
	return val;
},
/**
 * @description Получить значение GET переменной из url
 * @return {String};
*/
_GET: function(v, def, search) {
    if (!def) def = null;
    var s = window.location.href, buf = [], val, map = {};
    s = search ? search : s;
    while (s.indexOf(v + '[]') != -1) {
		val = this._GET(v  + '[]', def, s);
		if (!map[val]) {
			buf.push( decodeURIComponent(val) );
			map[val] = 1;
		}
		s = s.replace(v + '[]=' + val, '');
	}
	if (buf.length) {
		return buf;
	}
    var st = s.indexOf("?" + v + "=");
    if (st == -1) st = s.indexOf("&" + v + "=");
    if (st == -1) return def;
    var en = s.indexOf("&", st + 1);
    if ( en == -1 ) {
        return s.substring( st + v.length + 2);
    }
    return s.substring( st + v.length + 2, en );
},
/**
 * @description Размер вьюпорта
 * @return {String};
*/
getViewport: function() {
	var W = window, D = document, w = W.innerWidth, h = W.innerHeight;
	if (!w && D.documentElement && D.documentElement.clientWidth) {
		w = D.documentElement.clientWidth;
	} else if (!w) {
		w = D.getElementsByTagName('body')[0].clientWidth;
	}
	if (!h && D.documentElement && D.documentElement.clientHeight) {
		h = D.documentElement.clientHeight;
	} else if (!h) {
		h = D.getElementsByTagName('body')[0].clientHeight;
	}
	return {w:w, h:h};
},
isChrome:function() {
	return (window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1);
},
pagination:function ($page, $totalItems, $perPage, $itemInLine, $prevLabel, $nextLabel) {
	$itemInLine = $itemInLine  ? $itemInLine : 10;
	$prevLabel = $prevLabel  ? $prevLabel : '<';
	$nextLabel = $nextLabel  ? $nextLabel : '>';
	var $p = $page, $maxpage, $maxnum, $start, $end, $o, $data, $i,
	    $k = 0;

	$maxpage = $maxnum = Math.ceil($totalItems / $perPage);
	if ($maxnum <= 1) {
		return [];
	}
	$start = $p - Math.floor($itemInLine / 2);
	$start = $start < 1 ? 1 : $start;
	$end = $p + Math.floor($itemInLine / 2);
	$end = $end > $maxnum ? $maxnum : $end;

	$data = [];
	if ($start > 2) {
		$o = {};
		$o.n = 1;
		$data[$k] = $o;
		$k++;
	}
	if ($start > 1) {
		$o = {};
		$o.n = $start - 1;
		$o.text = $prevLabel;
		$data[$k] = $o;
		$k++;
	}
	for ($i = $start; $i <= $end; $i++) {
		$o = {};
		$o.n = $i;
		if ($i == $p) {
			$o.active = 1;
		}
		$data[$k] = $o;
		$k++;
	}
	if ($end + 1 < $maxnum) {
		$o = {};
		$o.n = $end + 1;
		$o.text = $nextLabel;
		$data[$k] = $o;
		$k++;
	}
	if ($end != $maxnum) {
		$o = {};
		$o.n = $maxnum;
		$data[$k] = $o;
		$k++;
	}
	return $data;
},
getCurrenciesArray:function() {
	return {
		'RUR'  : trans('messages.rub'),
		'rur'  : trans('messages.rub'),
		'USD'  : '$',
		'EURO' : '&euro;',
		'SOM'  : trans('messages.sum'),
		'KZT'  : trans('messages.tenge')
	};
},
pluralize:function($n, $root, $one, $less4, $more19) {
	var $m, $n, $lex;
	$m = strval($n);
	if (strlen($m) > 1) {
		$m =  intval( $m.charAt( strlen($m) - 2 ) + $m.charAt( strlen($m) - 1 ) );
	}
	$lex = $root + $less4;
	if ($m > 20) {
		$r = strval($n);
		$i = intval( $r.charAt( strlen($r) - 1 ) );
		if ($i == 1) {
			$lex = $root + $one;
		} else {
			if ($i == 0 || $i > 4) {
			   $lex = $root + $more19;
			}
		}
	} else if ($m > 4 || $m == '00') {
		$lex = $root + $more19;
	} else if ($m == 1) {
		$lex = $root + $one;
	}
	return $lex;
},
lock:function(xpath){
	var block = $(xpath), position = block.css('position'), html, bg, img;
	block.data('position', position);
	
	html = '<div class="prelocker" style="position:absolute;z-index:1000;top:0px; left:0px;background:rgba(255, 255, 255, 0.5)">\
		<img style="position:absolute;z-index:1001;" src="/img/loader.gif" >\
	</div>';
	block.css('position', 'relative');
	bg = $(html);
	bg.find('img')[0].onload = function() {
		img = bg.find('img');
		img.css('left', ( (block.width() - img.width()) / 2 )  ).
			css('top', ( (block.height() - img.height()) / 2 )  );
	}
	bg.css('width', block.width() + 'px');
	bg.css('height', block.height() + 'px');
	block.append(bg);
},
unlock:function(xpath){
	if ($(xpath).data('position')) {
		$(xpath).css('position', $(xpath).data('position') );
	}
	$(xpath + ' .prelocker').remove();
},
/**
 * @param {$Object} container контейнер, в который добавляют новые свойства
 * @param {String} tag имя тега - шаблона, содержащего css tpl 
 * @param {Array} config Конфигурация, что на что заменять, элемент массива - объект {key, val}, key- placeholder (можно RegExp) в шаблоне, val - имя поля в элементе массиве data  или функция, в которую будет передан элемент
 * @param {Array} data Массив элементов
*/
render:function(container, tag, config, data) {
	var oTpl = container.find(tag + '.tpl').first(),
		css = oTpl.attr('class').replace('tpl', ''),
		tpl = oTpl.html(),
		s, i, it, j, newItem
	;
	container.find(tag).each(function(i, j){
		if (!$(j).hasClass('tpl')) {
			$(j).remove();
		}
	});
	for (i in data) {
		it = data[i];
		s = tpl;
		for (j = 0; j < config.length; j++ ) {
			if (config[j].val instanceof Function) {
				s = s.replace(config[j].key, config[j].val(it));
			} else {
				s = s.replace(config[j].key, it[ config[j].val ] );
			}
		}
		newItem = $('<' + tag + ' class="' + css + '">' + s + '</' + tag + '>');
		container.append(newItem);
	}
},
expect:function(val, expectVal, message, errMessage) {
	if (val == expectVal) {
		console.log(message + ' Ok');
	} else {
		console.log(' Err');
		var s = "expect " + expectVal + " got " + val;
		if (errMessage) {
			s += " " + errMessage;
		}
		throw new Error(s);
	}
}
};//end Object
