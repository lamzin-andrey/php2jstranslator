/** 
 * @class Обрабатывает все строки содержащие в себе {$var} или  $var (разбивает на несколько), заменяет все подстроки на плейсхолдеры, результат на конкатенацию плейсхолдеров, исходный плейсхолдер в коде заменить на этот результат
*/
var StringProcessor = {	
	/** @property {Phpjs} phpjs для доступа к свойствам*/
	
	/** @property {Array} vars переменные в строке */
	vars : [],
	
	/**
	 * @description 
	*/
	replace:function(s, concatFragment) {
		s = this.replaceInlineVars(s, concatFragment);
		return s;
	},
	/**
	 * TODO меняет в  строке s все переносы строк на конкатенацию
	*/
	replaceNewLines:function(s) {
		s = $.trim(s);
		var i, L = s.length, ch, r = '', quote;
		quote = s.charAt(0);
		for (i = 0; i < L; i++) {
			ch = s.charAt(i);
			if (ch == '\n') {
				r += '\\n' + quote + ' + \n' + quote;
			} else {
				r += ch;
			}
		}
		return r;
	},
	replaceInlineVars:function(s, concatFragment) {
		var i, arr = Phpjs.fStrings, L = arr.length, q;
		for (i = 0; i < L; i++) {
			q = $.trim(arr[i].v);
			if (q.charAt(0) == '"') {
				this.clearStack();
				this.extractVars(q);
				if (this.vars.length) {
					q = this.replaceVars(q, concatFragment);
					//в q  меняем строки на плейсхолдеры
					q = this.setPlaceholders(q);
					//дальше в s меняем плейсхолдер на q
					s = s.replace(arr[i].k, q);
				}
			}
		}
		return s;
	},
	/**
	 * @description заменить все строки в s на плейсхолдеры
	*/
	setPlaceholders:function(s) {
		var i, L = s.length, quoteIsOpen = false, ch, buf = '',
			strings = [], placeholder;
		for (i = 0; i < L; i++) {
			ch = s.charAt(i);
			if (quoteIsOpen) {
				buf += ch;
				if (ch == '"') {
					placeholder = Phpjs.addStringPlaceholder(buf);
					strings.push( {k:placeholder, v:buf} );
					buf = '';
					quoteIsOpen = false;
				}
			} else {
				if (ch == '"') {
					quoteIsOpen = true;
					buf += '"';
				}
			}
		}
		if (buf) {
			placeholder = Phpjs.addStringPlaceholder(buf);
			strings.push( {k:placeholder, v:buf} );
			buf = '';
			quoteIsOpen = false;
		}
		L = strings.length;
		for (i = 0; i < L; i++) {
			s = s.replace(strings[i].v, strings[i].k);
		}
		return s;
	},
	replaceVars:function(s, concatFragment) {
		var i, L = this.vars.length, q;
		concatFragment = concatFragment ? concatFragment : ' . ';
		for (i = 0; i < L; i++) {
			q = $.trim(this.vars[i]);
			var re = new RegExp(q.replace('-', '\\-').replace(/\[/g, '\\[').replace(/\}/g, '\\}').replace(/\{/g, '\\{').replace(/\$/g, '\\$'), 'gim');
			if (q.charAt(0) == '{') {
				q = q.replace('{', '').replace('}', '');
				q = q.replace(/->/g, '.');
			}
			s = s.replace(re, '"' + concatFragment + q  + concatFragment +  '"');
		}
		return s;
	},
	extractVars:function(s){
		var i, allow = Phpjs.varAllow + '->[]', grabStart = false, grabType, //1 $var 2 {$var}
			L = s.length, ch, buf = '';
		;
		for (i = 0; i < L; i++) {
			ch = s.charAt(i);
			if (grabStart) {
				if (~allow.indexOf(ch)) {
					buf += ch;
				} else {
					if (grabType == 2 && ch == '}') {
						buf += ch;
					}
					this.vars.push(buf);
					buf = '';
					grabStart = false;
				}
			} else {
				if (ch == '$') {
					grabType = 1;
					if (s.charAt(i - 1) == '{') {
						buf += '{$';
						grabType = 2;
					} else {
						buf += '$';
					}
					grabStart = true;
				}
			}
			
		}
		if (buf) {
			this.vars.push(buf);
		}
	},
	clearStack:function() {
		this.vars = [];
	},
	
};
