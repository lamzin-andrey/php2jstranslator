function count(data) {
	if (!data) {
		return 0;
	}
	if (data instanceof Array || isset(data.length)) {
		return data.length;
	}
	var i, c;
	for (i in data) c++;
	return c;
}
function isset(v) {
	if (String(v) === 'undefined') {
		return !(String(v) === 'undefined');
	}
	for (var i = 1; i < arguments.length; i++) {
		v = v[ arguments[i] ];
		if (!isset(v)) {
			return false;
		}
	}
	return true;
}
function explode(ch, str) {
	return str.split(ch);
}
/**
 * @return {Array} of Object or Array в зависимости от типа data  и safeKeys
 * safeKeys == true вернет array of Objects
 * иначе data instanceof Array ? Array : Object
*/
function array_chunk(data, size, safeKeys) {
	if (data instanceof Array) {
		if (safeKeys) {
			var buf = {}, i;
			for (i = 0; i < data.length; i++) {
				buf[i] = data[i];
			}
			return object_chunk(data, size, safeKeys);
		}
		return _array_chunk(data, size);
	}
	return object_chunk(data, size, safeKeys);
}
function object_chunk(data, size, safeKeys) {
	var i, j, k, buf = {length:0}, r = [];
	j = k = 0;
	for (i in data) {
		if (j >= size) {
			r.push(buf);
			buf = {length:0};
			j = 0;
		}
		if (safeKeys) {
			buf[i] = data[i];
		} else {
			buf[k] = data[i];
		}
		buf.length++;
		j++;
		k++;
	}
	if (buf.length) {
		r.push(buf);
	}
	return r;
}

function _array_chunk(data, size) {
	var i, j, buf = [], r = [];
	for (j = 0, i = 0; i < data.length; i++) {
		if (j >= size) {
			r.push(buf);
			buf = [];
			j = 0;
		}
		buf.push(data[i]);
		j++;
	}
	if (buf.length) {
		r.push(buf);
	}
	return r;
}

function array_intersect(a, b) {
   var i, buf = [];
   for (i = 0; i < a.length; i++) {
	   if (~$.inArray(a[i], b)) {
		   buf.push(a[i]);
	   }
   }
   return buf;
}
function array_map(F, arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = F(arr[i]);
	}
	return arr;
}
function array_search(s, arr) {
	var r = false;
	$(arr).each(function(i, j) {
		if (r === false && j == s) {
			r = i;
		}
	});
	return r;
}
function array_fill_keys(arr, value) {
	var i, res = {};
	for (i = 0; i < arr.length; i++) {
		res[arr[i]] = value;
	}
	return res;
}
function intval(i) {
	return parseInt(i);
}
function trim(s) {
	return $.trim(s);
}
function strval(s) {
	return String(s);
}
function strlen(s) {
	return s.length;
}


function empty(v) {
	if (!v) {
		return true;
	}
	if (v instanceof Array) {
		if (v.length == 0) {
			return true;
		}
	}
	return false;
}
function array() {
	return [];
}
function sizeof(n){
	if (n && n.length) {
		return n.length;
	}
	if (n && (n instanceof Object) ) {
		var sz = 0, i;
		for (i in n) {
			sz++;
		}
		return sz;
	}
	return null;
}
function pathinfo(path) {
	var a = path.split('/'),
		filename = a[a.length - 1], ext,  r = {};
	a.pop();
	r.dirname = a.join('/');
	r.basename = filename;
	a = filename.split('.');
	ext = a[a.length - 1];
	a.pop();
	filename = a.join('.');
	r.filename = filename;
	r.extension = ext;
	return r;
}
function array_values(v) {
	var r = [];
	if (v instanceof Array) {
		for (var i = 0; i < v.length; i++) {
			if (v[i]) {
				r.push( v[i] );
			}
		}
	} else if (v instanceof Object) {
		for (var i in v) {
			if (v[i]) {
				r.push( v[i] );
			}
		}
	}
	return r;
}

function array_keys(arr){
	var r = [];
	if (v instanceof Array) {
		for (var i = 0; i < v.length; i++) {
			if (v[i]) {
				r.push(i);
			}
		}
	} else if (v instanceof Object) {
		for (var i in v) {
			r.push(i);
		}
	}
	return r;
}

function strtolower(s) {
	return s.toLowerCase();
}

function max(arr) {
	if (arr instanceof Array) {
		return Math.max.apply(Math, arr);
	}
	return Math.max.apply(Math, arguments);
}

function min(arr) {
	if (arr instanceof Array) {
		return Math.min.apply(Math, arr);
	}
	return Math.min.apply(Math, arguments);
}

function mb_strtolower(s) {
	return s.toLowerCase();
}
function mb_strlen(s) {
	return s.length;
}
function mb_substr(s, index, length) {
	return s.substring(index, (index + length));
}
function mb_strpos(s, substr) {
	var i = s.indexOf(substr);
	if (i == -1) {
		return false;
	}
	return i;
}

function rand(min, max) {
	var n = Math.random(), sN = String(n), sMin = String(min),
	    sMax = String(max), s;
	while (true) {
		sN = sN.replace('.', '');
		sN = sN.replace(/^0+/, '');
		if (sN.length >= sMin.length) {
			sN = sN.substring(0, sMin.length + 1);
			break;
		}
		n = Math.random();
		sN = String(n);
	}
	n = parseInt(sN, 10);
	if (n < min) {
		n += min;
	}
	if (n > max) {
		n = n % max;
	}
	if (n < min) {
		n += min;
	}
	return n;
}


function session_start() {}

function dirname() {
	if (Qt && Qt.appDir) {
		return Qt.appDir();
	}
	return '/';
}

function file_exists(filename) {
	if (PHP && PHP.file_exists) {
		return PHP.file_exists(filename);
	}
	return false;
}

function str_replace(search, replace, subject, oCount) {
	while (subject.indexOf(search) != -1) {
		subject = subject.replace(search, replace);
		if (oCount && (oCount instanceof Object)) {
			if (!oCount.v) {
				oCount.v = 0;
			}
			oCount.v++;
		}
	}
	return subject;
}

function date(pattern){
	var dt = new Date(), map = {
		Y : dt.getFullYear(),
		m : dt.getMonth() + 1,
		d : dt.getDate(),
		H : dt.getHours(),
		i : dt.getMinutes(),
		s : dt.getSeconds()
	};
	var key;
	for (key in map) {
		map[key] = +map[key] < 10 ? ('0' + map[key]) : map[key];
		pattern = str_replace(key, map[key], pattern);
	}
	return pattern;
}


function Request(){}
Request.prototype.input = function(v, def) {
	return Library._GET(v, def);
}
