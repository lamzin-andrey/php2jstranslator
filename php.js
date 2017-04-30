$_POST = {};
$_SERVER = {};
$_SESSION = {};
function StdClass() {}
function extend(a,b){
	var c=new Function();
	c.prototype=a.prototype;
	b.prototype=new c();
	b.prototype.constructor=b;
	b.superclass=a.prototype;
	b.superclass.__construct = a;
}
/**
 * @description В транслированом из php кода js коде тип Object может иметь только то, что в оригинальном коде было ассоциативным массивом
*/
function __php2js_clone_argument__(o) {
	if ((o instanceof Array) || (o && o.constructor && o.constructor.name == 'Object') ) {
		if (o instanceof Array) {
			var r = [], i, j;
			for (i = 0; i < o.length; i++) {
				j = o[i];
				if (j instanceof Array) {
					j = __php2js_clone_argument__(j);
				}
				r.push(o[i]);
			}
			return r;
		}
		var r = {}, i;
		for (i in o) {
			if ((o[i] instanceof Array) || (o[i] && o[i].constructor && o[i].constructor.name == 'Object') ) {
				o[i] = __php2js_clone_argument__(o[i]);
			}
			r[i] = o[i];
		}
		return r;
	}
	return o;
}
/**
 * @description замена метода push для ассоциативных массивов, транслированных в 
*/
function __php2js_push__(item) {
	var o = this, max = -1, i;
	for (i in o) {
		i = parseInt(i, 10);
		if (!isNaN(i)) {
			if (max < i) {
				max = i;
			}
		}
	}
	max++;
	this[max] = item;
}
function chr(n) {
	return String.fromCharCode(n);
}
function count(data, dbg) {
	if (!data) {
		return 0;
	}
	if (data instanceof Array /*|| isset(data.length)*/) {
		return data.length;
	}
	var i, c = 0;
	for (i in data) c++;
	return c;
}
function dechex(n) {
	 return Number(n).toString(16);
}
function define(name, val) {
	window[name] = val;
}
function defined(name) {
	if (window[name]) {
		return true;
	}
	return false;
}
function isset(v) {
	var dbg = window.issetdbg;
	if (dbg) {
		console.log('arguments:');
		console.log(arguments);
	}
	if (String(v) === 'undefined') {
		if (dbg) {
			//window.issetdbg = 0;
		}
		return !(String(v) === 'undefined');
	}
	for (var i = 1; i < arguments.length; i++) {
		if (dbg) {
			console.log('check key = ' + arguments[i]);
		}
		v = v[ arguments[i] ];
		if (!isset(v)) {
			if (dbg) {
				//window.issetdbg = 0;
			}
			return false;
		}
	}
	if (dbg) {
		//window.issetdbg = 0;
	}
	return true;
}
function get_defined_vars() {
	return window;
}
function getimagesize($path) {
	if (PHP && PHP.getimagesize) {
		var r = PHP.getimagesize($path);
		return r;
	}
	return {};
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

function ord(s) {
	return String(s).charCodeAt(0);
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
function array_merge(arr) {
	var i, j, sub, k, b;
	if (arr instanceof Array) {
		for (i = 1; i < arguments.length; i++) {
			sub = arguments[i];
			if (sub instanceof Object) {
				b = {};
				for (j = 0; j < arr.length; j++) {
					b[String[j]] = arr[j];
				}
				arr = b;
				break;
			}
		}
	}
	for (i = 1; i < arguments.length; i++) {
		sub = arguments[i];
		if (!(sub instanceof Array) && !(sub instanceof Object)) {
			continue;
		}
		if (sub instanceof Array) {
			for (j = 0; j < sub.length; j++) {
				arr[j] = sub[j];
			}
		} else if (sub instanceof Object) {
			for (j  in sub) {
				arr[j] = sub[j];
			}
		}
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
function array_unique(a){
	if (!(a instanceof Array) && !!(a instanceof Object)) {
		return a;
	}
	var i, o = {};
	if ((a instanceof Array)) {
		for (i = 0; i < a.length; i++) {
			o[a[i]] = 1;
		}
	} else {
		for (i in a) {
			o[a[i]] = 1;
		}
	}
	a = [];
	for (i in o) {
		a.push(i);
	}
	return a;
}
function array_fill_keys(arr, value) {
	var i, res = {};
	for (i = 0; i < arr.length; i++) {
		res[arr[i]] = value;
	}
	return res;
}
function hexdec(n) {
	var r =  parseInt(n, 16);
	if (isNaN(r)) {
		throw new Error('n = ' + n);
	}
	return r;
}
function in_array(needle, subject, strict) {
	var i, j, r;
	if (typeof(subject) == 'array') {
		for (i = 0; i < subject.length; i++) {
			j = subject[i];
			r = (j == needle);
			if (strict) {
				r = (j === needle);
			}
			if (r) {
				return true;
			}
		}
	} else if (typeof(subject) == 'object') {
		for (i in subject) {
			j = subject[i];
			r = (j == needle);
			if (strict) {
				r = (j === needle);
			}
			if (r) {
				return true;
			}
		}
	}
	return false;
}
function intval(i) {
	var r = parseInt(i, 10);
	return isNaN(r) ? 0 : r;
}
function is_array(s) {
	if (s instanceof Array) {
		return true;
	}
	if (typeof(s) == 'array') {
		return true;
	}
	return false;
}
function is_string(s) {
	if (s instanceof String) {
		return true;
	}
	if (typeof(s) == 'string') {
		return true;
	}
	return false;
}
/**
 * @description 
 * @param {String} sDatetime 'Y-m-d H:i:s' (php date() format)
 * @return Количество секунд с 01.01.1970 до sDatetime
*/
function time(sDatetime) {
	var re = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/, arr = String(sDatetime).split(' '),
		sDate = arr[0],
		sTime = arr[1], d = new Date(),
		re2 = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/;
	if (!re.test(sDatetime) && !re2.test(sDatetime)) {
		return parseInt(new Date().getTime()/1000);
	}
	arr = sDate.split('-');
	d.setDate(parseInt(arr[2], 10));
	d.setFullYear(arr[0]);
	d.setMonth(parseInt(arr[1], 10) - 1);
	
	if (sTime) {
		arr = sTime.split(':');
		d.setHours(parseInt(arr[0], 10));
		d.setMinutes(parseInt(arr[1], 10));
		d.setSeconds(parseInt(arr[2], 10), 0);
	} else {
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0, 0);
	}
	return parseInt(d.getTime()/1000);
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
function substr(s, start, length) {
	if (length) {
		return s.substring(start, start + length);
	} else {
		return s.substring(start);
	}
}
function sqrt(a) {
	return Math.sqrt(a);
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

function round(float, per) {
	if (!per) {
		return Math.round(float);
	}
	var n = 1, i;
	for (var i = 0; i < per; i++) {
		n *= 10;
	}
	return Math.round(float * n) / n;

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
function sprintf() {
	var format = arguments[0], argIdx = 1, i, j, ch, buf = '', q, sym;
	//console.log(arguments);
	
	var locs = '';
	for (var loc = 0; loc < arguments.length; loc++) {
		if (String(arguments[loc]) == 'NaN') {
			throw new Error('sprintf got NaN!');
		}
		locs += arguments[loc] + ',';
	}
	//console.log(locs);
	
	if (typeof(format) == 'array') {
		throw new Error('Sprintf got array');
	}
	while (true) {
		i = format.indexOf('%');
		if (~i) {
			buf = '';
			for (j = i; j < format.length; j++) {
				ch = format.charAt(j);
				if (ch == ' ' || ch == '\t' || ch == '\r' || ch == '\n' || ch == ')' || ch == '('|| ch == ']' || ch == '[') {
					break;
				}
				buf += ch;
			}
			var re = /%\.[0-9]+F/, num,
				re2 = /%[0-9]+d/;
			if (buf != '%.d' && re.test(buf)) {
				ch = buf.replace('%.', '');
				num = parseInt(ch, 10);
				ch = arguments[argIdx];
				argIdx++;
				if (!isNaN(parseFloat(ch))) {
					ch = String(round(ch, num));
					if (ch.indexOf('.') == -1) {
						ch += '.';
					}
					q = ch.substring(ch.indexOf('.'));

					while(q.length < num + 1) {
						q += '0';
						ch += '0';
					}
					format = format.replace(buf, ch);
				}
			} else if (buf != '%.d' && re2.test(buf)) {
				ch = buf.replace('%', '');
				sym = (String(ch).charAt(0) == '0') ? '0' : ' ';
				num = parseInt(ch, 10);
				ch = arguments[argIdx];
				argIdx++;
				q = '';
				if (!isNaN(num)) {
					for (j = 3; j < num; j++) {
						q += sym;
					}
				}
				q += String(ch);
				format = format.replace(buf, q);
			} else if (buf == '%.d') {
				ch = arguments[argIdx];
				argIdx++;
				format = format.replace(buf, parseInt(ch, 10));
			} else if (buf == '%d') {
				ch = arguments[argIdx];
				argIdx++;
				format = format.replace(buf, ch);
			} else if (buf == '%s') {
				ch = arguments[argIdx];
				argIdx++;
				format = format.replace(buf, ch);
			}
			else {
				console.log('buf = ' + buf);
				format = format.replace(buf, 'nAn');
				throw new Error("sprintf: unable process |" + format + '|');
			}
		} else {
			break;
		}
	}
	//console.log('return |' + format + '|');
	return format;
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
	if (String(s) == 'undefined')
		throw new Error('strtolower: s is undefined');
	return String(s).toLowerCase();
}
function strpos(s, needle, offset) {
	offset = parseInt(offset) ? parseInt(offset) : 0;
	var n = s.indexOf(needle, offset);
	if (n == -1) {
		return false;
	}
	return n;
}
/**
 * @description this private helper for define strrpos();
*/
function _strrpos(s, needle, offset) {
	offset = parseInt(offset) ? parseInt(offset) : s.length;
	if (offset < 0) {
		s = s.substring(0, s.length + offset + 1);
		return strrpos(s, needle);
	} else {
		offset = s.length;
	}
	var n = s.lastIndexOf(needle, offset);
	if (n == -1) {
		return false;
	}
	return n;
}
/**
 * @testing
 * Test values from
 * PHP 5.5.9 (cli) (built: Feb 12 2014 22:09:05) 
	Copyright (c) 1997-2014 The PHP Group
	Zend Engine v2.5.0, Copyright (c) 1998-2014 Zend Technologies
		with Xdebug v2.2.3, Copyright (c) 2002-2013, by Derick Rethans
		* 
 * Test code:
	var $s = 'abrrrerf';
	
	var values = {'-9': false, '-8':false, '-7': false, '-6':2, '-5':3,'-4':4, '-3':4,
	 '-2':6,'-1':6, '0':6, '1':6,
		2:6, 3:6, 4:6, 5:6, 6:6, 7:false, 8:false, 9:false
	};

   $('#console').html('');	
	for (var i = -9; i < 10; i++) {
		var m = strrpos($s, 'r', i);
		if (m === values[i]) {
			writeln('on i == ' + i + ' m = ' + m + ', expected = ' + values[i] + ', success');
		} else {
			writeln('<span style="color:#ff0000;">on i == ' + i + ' m = ' + m + ', expected = ' + values[i] + ', FAIL</span>');
		}
	}
	$s = '/media/andrey/C/dev/v3-r9/default/php/PdfCreator/fpdf17/0.png';
	m = strrpos($s, '.');
	if (m === 57) {
		writeln('on i == ' + i + ' m = ' + m + ', expected = ' + 57 + ', success');
	} else {
		writeln('<span style="color:#ff0000;">on i == ' + i + ' m = ' + m + ', expected = ' + 57 + ', FAIL</span>');
	}
 */	
function strrpos(s, needle, offset) {
	var sourceOffset = offset;
	offset = parseInt(offset) ? parseInt(offset) : s.length;
	if (offset < 0) {
		s = s.substring(0, s.length + offset + 1);
		//writeln('call _strrpos');
		return _strrpos(s, needle);
	} else {
		if (offset >= s.length - 1 && sourceOffset !== 0 && String(sourceOffset) !== 'undefined') {
			//writeln('return false here!');
			return false;
		}
		offset = s.length;
	}
	var n = s.lastIndexOf(needle, offset);
	if (n == -1) {
		return false;
	}
	return n;
}
function strtoupper(s) {
	return s.toUpperCase();
}

function max(arr) {
	if (arr instanceof Array) {
		return Math.max.apply(Math, arr);
	}
	return Math.max.apply(Math, arguments);
}
function method_exists(obj, foo) {
	if (obj[foo] instanceof Function) {
		return true;
	}
	return false;
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

function file_get_contents($file) {
	if (PHP && PHP.file_get_contents) {
		return PHP.file_get_contents($file);
	}
	return '';
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
