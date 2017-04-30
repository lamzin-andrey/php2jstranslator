
/** 
 * @class Транслирует php код в js
*/
var Phpjs = {	
	/** @property {Array} fStrings стек строковых переменных функции*/
	fStrings : [],
	
	/** @property {Array} fComments стек комментариев функции*/
	fComments : [],
	
	/** @property {Array} fVars стек переменных функции */
	fVars : [],
	
	/** @property {Array} fForeach стек foreach функции */
	fForeach : [],
	
	/** @property {Number} SINGLE_STRING указывает тип игнорируемого блока */
	SINGLE_STRING : 1,
	
	/** @property {Number} STRING указывает тип игнорируемого блока */
	STRING : 2,
	
	/** @property {Number} SINGLE_COMMENT указывает тип игнорируемого блока */
	SINGLE_COMMENT : 3,
	
	/** @property {Number} COMMENT указывает тип игнорируемого блока */
	COMMENT : 4,
	
	/** @property {Number} placeholderN счетчик плейсхолдеров */
	placeholderN : 0,
	
	/** @property {Number} locvarCounter счетчик плейсхолдеров */
	locvarCounter : 0,
	
	/** @property {String} pcp префикс плейсхолдеров */
	pcp : 'phpjs_placeholder_',

	/**
	 * Далее идут переменные, связанные с разбором кода включающего несколько функций
	*/
	/** @property {Boolean} true когда происходит парсинг кода включающего несколько функций */
	parseFunctionsMode: false,

	/** @property {Array} cStrings стек строковых переменных вне функций*/
	cStrings : [],
	
	/** @property {Array} cComments стек комментариев вне функций*/
	cComments : [],
	
	/** @property {Array} fVars стек полей класса */
	cVars : [],

	/** @property {String}  */
	numLength : '00000',

	/**
	 * @description временно вызывает translateFunction то есть пока можно транслировать одну функцию
	*/
	translate:function(lines) {
		var data = {}, s;
		lines = this.adaptiveArrayLexema(lines);
		if (!this.isValidPhp(lines, data)) {
			s = 'Строка ' + data.line + ', символ ' + data.position + ': ';
			if (data.message) {
				alert(s + data.message);
			} else {
				alert(s + 'Недопустимое вхождение ' + data.word);
			}
			return lines;
		}
		this.placeholderN = 0;
		this.clearClassStack();
		//заменить все [];//{} на {};
		lines = lines.replace(/\[\];\/\/\{\}/gim, '{push:__php2js_push__};');
		//1 Заменить строки и комментарии на плейсхолдеры, используя существующий код
		var s = this.grabClassCommentAndString(lines);
		//console.log(s);
		//return;
		//2 скопировать стеки f в стеки c
		this.copyFunctionsStackToClassStack();
		
		//TODO заменить на 
		ClassParser.init(Library._GET('objType', 0));
		s = ClassParser.parse(s, this);//TODO
		
		//9 Восстановить из c стеков комментарии и плейсхолдеры
		this.clearFunctionStack();
		this.copyClassStackToFunctionsStack();
		
		//все строки содержащие в себе {$var} или  $var разбить, заменить все подстроки на плейсхолдеры, результат на конкатенацию плейсхолдеров, исходный плейсхолдер в коде заменить на этот результат
		s = StringProcessor.replace(s, ' + ');
		this.replaceNewLines();
		
		
		//console.log(this.cComments);
		s = this.restorePlaceholders(s, true);
		return s;
		//return this.translateFunction(lines);
	},
	/**
	 * @description транслирует код php функции в код js функции
	 * @param lines код функции
	 * @param className это значение (className.) будет подставлено вместо self::
	*/
	translateFunction:function(lines, className) {
		lines = this.adaptiveArrayLexema(lines);
		var i, s = lines;
		className = String(className) == 'undefined' ? 'this' : className;
		this.clearFunctionStack();
		//0 пройти по функции и собрать все комментарии и строки в массивы, вместо них оставить макрос phpjs_placeholder_comment|string_N
		//1 собрать все переменные внутри функции.
		//все 'foreach ($arr as $item) {' заменить на 'for (foritN in $arr) {$item = $arr[foritN];' где N число
		s = this.grabCommentsStringsVars(s, i);
		//console.log(s);
		//все строки содержащие в себе {$var} или  $var разбить, заменить все подстроки на плейсхолдеры, результат на конкатенацию плейсхолдеров, исходный плейсхолдер в коде заменить на этот результат
		s = StringProcessor.replace(s);
		//переносы строк заменить на сложение
		this.replaceNewLines();
		//заменить все . на +
		s = s.replace(/([0-9]+)\.([0-9]+)/mg, '$1phpjsdot$2');
		s = s.replace(/\./mg, '+');
		s = s.replace(/phpjsdot/mg, '.');
		//2 заменить все $this-> на this.
		s = s.replace(/\$this\->/mg, 'this.');
		//2 заменить все self:: на this.
		s = s.replace(/self\:\:/mg, className + '.');
		//2 заменить все parent:: на {className}.superclass.{methodName}.apply(this, arguments)
		s = this.replaceParentLexema(className, s);
		//s = s.replace(/parent\:\:/mg, className + '.');
		//2 заменить все :: на .
		s = s.replace(/\:\:/mg, '.');
		//3 заменить все -> на .
		s = s.replace(/\->/mg, '.');
		//4 заменить все Math функции
		s = this.setMathFunctions(s);
		s = this.setIssetExpression(s);
		
		//s = s.replace(/new\s+StdClass\(\)/gm, '{}');
		s = s.replace(/new\s+\\StdClass\(\)/gm, 'new StdClass()');
		//s = s.replace(/new\s+StdClass/gm, '{}');
		s = s.replace(/new\s+\\StdClass/gm, 'new StdClass');
		//TODO $arr[] = some; -> $arr.push(some);
		s = this.arrayPush(s);
		//инициализацию ассоциативных массивов  на инициализацию объектов
		s = this.assocArray2Object(s);
		//плейсхолдеры - на место
		s = this.restorePlaceholders(s);
		//добавить список переменных, не забыв выкинуть из них аргументы функций и $this
		s = this.addVarDefine(s);
		//удалить типы ат=ругментов функций
		s = this.removeTypesFromArgumentsList(s);
		s = s.replace(/Exception/gm, 'Error');
		/*console.log(this.fStrings);
		console.log(this.fComments);*/
		//console.log(this.fVars);
		//console.log(this.fForeach);
		return s;
	},
	/**
	 * @description Добавляет определения переменных в начало функции
	 * @param {String } s текст js функции
	*/
	addVarDefine:function(s) {
		var i, L = this.fVars.length, p = s.indexOf('{'), map = {}, buf = [],
			r = '', head, tail, fail = 0, offset = '',
			globals = {
				'$_POST':1,
				'$_GET':1,
				'$_SERVER':1,
				'$_SESSION':1,
				'$this':1
			};
		i = p + 1;	
		//отступ получить
		while (s.charAt(i) == ' ' || s.charAt(i) == '\t' || s.charAt(i) == '\n') {
			i++;
			if(String(s.charAt(i)) === 'undefined') {
				fail = 1;
				break;
			}
		}
		if (!fail) {
			offset = s.substring(p + 1, i + 1);
			p = i;
		}
		map = this.getArgumentsList(s);
		for (i = 0; i < L; i++) {
			if ( !map[ this.fVars[i] ] && !globals[ this.fVars[i] ]) {
				map[ this.fVars[i] ] = 1;
				buf.push( this.fVars[i] );
			}
		}
		r = 'var ' + buf.join(', ') + ';' + offset;
		if (buf.length == 0) {
			r = '';
			p--;
		}
		head = s.substring(0, p);
		tail = s.substring(p + 1);
		s = head + r + tail;
		return s;
	},
	/**
	 * @description возвращает имена аргументов как ключи объекта
	 * @return {Object}
	*/
	getArgumentsList:function(s) {
		var start = s.indexOf('('), end = s.indexOf(')', start),
			sArgs = s.substring(start, end), res = {}, i;
		StringProcessor.clearStack();
		StringProcessor.extractVars(sArgs);
		for (i = 0; i < StringProcessor.vars.length; i++) {
			res[ StringProcessor.vars[i] ] = 1;
		}
		return res;
	},
	/**
	 * TODO сделать вынос типов аргументов в javadoc
	 * @description Удаляет типы аргументов функции
	 * @return {String}
	*/
	removeTypesFromArgumentsList:function(s) {
		var start = s.indexOf('('), end = s.indexOf(')', start),
			sArgs = s.substring(start, end), res = [], i, tail, head;
		StringProcessor.clearStack();
		StringProcessor.extractVars(sArgs);
		head = s.substring(0, start);
		tail = s.substring(end);
		s = head + '(' + StringProcessor.vars.join(', ') +  tail;
		return s;
	},
	/**
	 * @description Заменяет конструкцию вида $arr[] = someval; на $arr.push(someval);
	 * @param {String} s текст js функции
	*/
	arrayPush:function(s) {
		var i, j, k, prev = null, p, offset = 0;
		while (~s.indexOf('[]', offset)) {
			p = s.indexOf('[]', offset);
			if (this.isPushLexema(s, p)) {
				var safe = s;
				s = this.replacePushLexema(s, p);
				if (safe == s) {
					return s;
				}
			} else {
				offset = p + 1;
			}
		}
		return s;
	},
	/**
	 * @description Заменяет $arr[] = val; $arr.push(val); в строке s
	 * @param {String} s
	 * @param {Number} pos позиция [] лексемы
	 * @return {String}
	*/
	replacePushLexema:function(s, pos) {
		var i, L = s.length, ch, start = false, val = '', varname = '',
			aVar = [], fragStart = L, fragEnd = 0, head, tail;
		for (i = pos; i < L; i++) {
			ch = s.charAt(i);
			if (ch == '=') {
				start = true;
				continue;
			}
			if (start) {
				if (ch == ';') {
					fragEnd = i;
					start = false;
					break;
				}
				val += ch;
			}
		}
		for (i = pos - 1; i > -1; i--) {
			aVar.push(s.charAt(i));
			if (s.charAt(i) == '$' || 
				((s.charAt(i) == 't')
				&& (s.charAt(i + 1) == 'h')
				&& (s.charAt(i + 2) == 'i')
				&& (s.charAt(i + 3) == 's')
				&& (s.charAt(i + 4) == '.'))
					) {
				fragStart = i;
				break;
			}
		}
		aVar = aVar.reverse();
		varname = $.trim( aVar.join('') );
		if (fragStart < fragEnd) {
			head = s.substring(0, fragStart);
			tail = s.substring(fragEnd);
			val = $.trim(val);
			if (val == '[]') {
				val = 'new Array()';
			}
			s = head + varname + '.push(' + val + ')' + tail;
		}
		return s;
	},
	/**
	 * @description 
	 * @param {String} s
	 * @param {Number} pos
	 * @return {Boolean} true если [] часть оператора получения в массив нового элемента
	*/
	isPushLexema:function(s, pos) {
		var i, buksEntry = 0;
		for (i = pos; i > -1; i--) {
			if (s.charAt(i) == '=') {
				return false;
			}
			
			if (s.charAt(i) == '$' || 
				((s.charAt(i) == 't')
				&& (s.charAt(i + 1) == 'h')
				&& (s.charAt(i + 2) == 'i')
				&& (s.charAt(i + 3) == 's')
				&& (s.charAt(i + 4) == '.'))
					) {
				return true;
			}
			if (s.charAt(i) == '\n' && !buksEntry) {
				return false;
			}
			if (s.charAt(i) == '{') {
				return true;
			}
			if (String(s.charAt(i)) == 'undefined') {
				return true;
			}
		}
		return false;
	},
	/**
	 * @description Восстанавливает в исходном коде строки и комментарии, ранее замененные на плейсхолдеры
	 * @param {String } s текст js функции
	*/
	restorePlaceholders:function(s, dbg) {
		var i, L = this.fStrings.length;
		for (i = 0; i < L; i++) {
			s = s.replace(this.fStrings[i].k, this.fStrings[i].v);
		}
		L = this.fComments.length;
		if(dbg){
			//console.log(s);
			//console.log(this.fComments);
		}
		for (i = 0; i < L; i++) {
			s = s.replace(this.fComments[i].k, this.fComments[i].v);
		}
		return s;
	},
	/**
	 * @description Заменяет определение ассоциативного массива на определение объекта
	 * @param {String } s текст php функции
	*/
	assocArray2Object:function(s) {
		var source = s, prevP = null, bre = 0;
		//console.log(s);
		while(~s.indexOf('=>')) {
			var p, openB = null, closeB = null, i, frag, repl,
				p = s.indexOf('=>'), brCounter, ch;
			if (p === prevP) {
				return source;
			}
			prevP = p;
			i = p;
			while (s.charAt(i) != '[') {
				i--;
				//console.log(i);
				if (i < 0) {
					return source;
				}
			}
			openB = i;
			i = p;
			brCounter = 1;
			while (brCounter != 0) { /* s.charAt(i) != ']' */
				i++;
				ch = s.charAt(i);
				if (ch == '[') {
					brCounter++;
				}
				if (ch == ']') {
					brCounter--;
				}
				//console.log( String(ch) );
				if (String(ch) == 'undefined' || String(ch) == "") {
					return source;
				}
			}
			closeB = i;
			frag = s.substring(openB, closeB + 1);
			//console.log(frag);
			//console.log(frag);
			repl = frag.replace(/=>/gi, ':');
			repl = repl.replace(/\[/gi, '{');
			repl = repl.replace(/\]/gi, '}');
			s = s.replace(frag, repl);
		}
		return s;
	},
	/**
	 * @description Восстанавливает в исходном коде строки и комментарии, ранее замененные на плейсхолдеры
	 * @param {String } s текст js функции
	*/
	setMathFunctions:function(s) {
		var fs = ['ceil', 'floor', 'abs', 'sin', 'cos']; //TODO продолжить
		var i, L = fs.length, re;
		for (i = 0; i < L; i++) {
			re = new RegExp(fs[i], 'mg');
			s = s.replace(re, 'Math.' + fs[i]);
		}
		return s;
	},
	/**
	 * @description Берет все помещенные в стек строки и заменяет в них перенос строки на конкатенацию строк
	*/
	replaceNewLines:function() {
		var i, s, L = this.fStrings.length;
		for (i = 0; i < L; i++) {
			this.fStrings[i].v = StringProcessor.replaceNewLines(this.fStrings[i].v);
		}
	},
	clearFunctionStack:function() {
		this.fVars = [];
		this.fComments = [];
		this.fStrings = [];
		this.fForeach = [];
		//this.placeholderN = 0;
		this.locvarCounter = 0;
	},
	/**
	 * @description Определяет, находится ли i внутри "игнорируемого" блока (комментарий или строка), в случае его завершения устанавливает
	 *значения state.ignoreBlockType, state.ignoreBlockContent, state.ignore да и всех полей state
	*/
	isIgnoreBlockStart:function(ch, s, i, state) {
		if (state.ignore) {
			var append = 0;
			if (state.sQuoteIsOpen) {
				if (ch == "'" && !this.previousSymbolIsSlash(s, i)) {//s.charAt(i - 1) != '\\'
					state.ignoreBlockContent += ch;
					append = 1;
					state.sQuoteIsOpen = state.ignore = false;
					state.ignoreBlockType = this.SINGLE_STRING;
				}
			}
			if (state.dQuoteIsOpen) {
				if (ch == '"' && !this.previousSymbolIsSlash(s, i)) {
					state.ignoreBlockContent += ch;
					append = 1;
					state.dQuoteIsOpen = state.ignore = false;
					state.ignoreBlockType = this.STRING;
				}
			}
			if (state.sCommentIsOpen) {
				if (ch == '\n') {
					state.ignoreBlockContent += ch;
					append = 1;
					state.sCommentIsOpen = state.ignore = false;
					state.ignoreBlockType = this.SINGLE_COMMENT;//TODO define it
				}
			}
			if (state.dCommentIsOpen) {
				if (ch == '/' && s.charAt(i - 1) == '*') {
					state.ignoreBlockContent += ch;
					append = 1;
					state.dCommentIsOpen = state.ignore = false;
					state.ignoreBlockType = this.COMMENT;//TODO define it
				}
			}
			if (!append) {
				state.ignoreBlockContent += ch;
			}
		} else {// here state.ignore == false on call
			if (ch == "'") {
				state.sQuoteIsOpen = state.ignore = true;
				state.ignoreBlockContent += ch;
			}
			if (ch == '"') {
				state.dQuoteIsOpen = state.ignore = true;
				state.ignoreBlockContent += ch;
			}
			if (ch == '/' && s.charAt(i + 1) == '/') {
				state.sCommentIsOpen = state.ignore = true;
				state.ignoreBlockContent += ch;
			}
			if (ch == '/' && s.charAt(i + 1) == '*') {
				state.dCommentIsOpen = state.ignore = true;
				state.ignoreBlockContent += ch;
			}
		}
		return state;
	},
	/**
	 * @description Добавляет непустой игнорируемый блок в стек плейсхолдеров, очищает  state.ignoreBlockContent,ignoreBlockType
	*/
	addLastIgnoreBlockToStack:function(state) {
		if (state.ignoreBlockContent && state.ignoreBlockType) {
			switch(state.ignoreBlockType) {
				case this.SINGLE_STRING:
				case this.STRING:
					this.fStrings.push({v:state.ignoreBlockContent, k:''});
					break;
				case this.SINGLE_COMMENT:
				case this.COMMENT:
					this.fComments.push({v:state.ignoreBlockContent, k:''});
					break;
			}
			state.ignoreBlockType = 0;
			state.ignoreBlockContent = '';
		}
	},
	/**
	 * пройти по функции и собрать все комментарии и строки в массивы, вместо них оставить макрос phpjs_placeholder_comment|string_N
	 * собрать все переменные внутри функции.
	*/
	grabCommentsStringsVars:function(s, i) {
		var state = {sQuoteIsOpen:false, dQuoteIsOpen:false,
						sCommentIsOpen:false,
						dCommentIsOpen: false,
						ignore: false,
						ignoreBlockType:0,
						ignoreBlockContent:''
						},
			inVar = false,
			buf = '',
			ch,
			obj,
			lat = 'abcdefghijklmnopqrstuvwxyz',
			varAllow = '$0123456789_' + lat + lat.toUpperCase(),
			j, k, L = s.length, foreachBuf = '', inForeach = false
			;
		this.varAllow = varAllow;
		for (i = 0; i < L; i++) {
			ch = s.charAt(i);
			state = this.isIgnoreBlockStart(ch, s, i, state);
			if (!state.ignore) {
				//console.log('LastIgnoreBlock = ' + state.ignoreBlockContent);
				this.addLastIgnoreBlockToStack(state);
				if (ch == '$') {
					inVar = true;
				}
				if (inVar) {
					if (~varAllow.indexOf(ch)) {
						buf += ch;
					} else {
						this.fVars.push( $.trim(buf) );
						buf = '';
						inVar = false;
					}
				}
				
				inForeach = this.isInForeach(ch, i, s, inForeach);
				if (!inForeach && foreachBuf) {
					//console.log('append ' + foreachBuf + '{, i = ' + i + ', ch = ' + ch);
					this.addPlaceHolder('foreach',  this.fForeach, foreachBuf + '{');
					foreachBuf = '';
				} else if (inForeach) {
					foreachBuf += ch;
				}
				
			} else {
				inVar = false;
				inForeach = false;
			}
		}
		//заменить все строки  и комментарии на плейсхолдеры
		return this.setPlaceholders(s);
	},
	/**
	 * @description Возвращает true если указатель i внутри "заголовка" foreach. Если передан inForeach == true  возвращает false только в том случае если ch == {
	*/
	isInForeach:function(ch, i, s, inForeach) {
		if (this.parseFunctionsMode) {
			return false;
		}
		if (inForeach) {
			if (ch == '{') {
				return false;
			}
			return true;
		} else {
			if (ch == 'f' && s.charAt(i + 1) == 'o' && s.charAt(i + 2) == 'r'  && s.charAt(i + 3) == 'e') {
				return true;
			}
		}
		return false;
	},
	setPlaceholders:function(s) {
		var i, L = this.fStrings.length, type = 'string', q, pc;
		for (i = 0; i < L; i++) {
			q = this.fStrings[i].v;
			pc = this.pcp + type + '_' + this.getPlaceholderNumber();
			s = s.replace(q, pc);
			this.fStrings[i].k = pc;
			this.placeholderN++;
		}
		L = this.fComments.length;
		type = 'comment';
		for (i = 0; i < L; i++) {
			q = this.fComments[i].v;
			pc = this.pcp + type + '_' + this.getPlaceholderNumber();
			this.fComments[i].k = pc;
			if (q.charAt(0) == '/' && q.charAt(1) == '/') {
				pc += '\n';
			}
			s = s.replace(q, pc);
			this.placeholderN++;
		}
		
		type = 'foreach';
		L = this.fForeach.length;
		for (i = 0; i < L; i++) {
			var forin  = this.parseForeach(this.fForeach[i].v); //TODO it и не забыть в fVars добавить хелпер
			s = s.replace(this.fForeach[i].v, forin);
		}
		return s;
	},
	parseForeach:function(s) {
		var i, L = s.length, r, locvar;
		StringProcessor.clearStack();
		StringProcessor.extractVars(s);
		if (StringProcessor.vars.length  == 2) {
			locvar = 'phpjslocvar_' + this.locvarCounter;
			this.locvarCounter++;
			this.fVars.push( $.trim(locvar) );
			r = 'for (' + locvar + ' in ' + StringProcessor.vars[0] + ') { ' + StringProcessor.vars[1] + ' = ' + StringProcessor.vars[0] + '[' + locvar + '];';
			return r;
		} else if (StringProcessor.vars.length  == 3) {
			locvar = StringProcessor.vars[1];
			r = 'for (' + locvar + ' in ' + StringProcessor.vars[0] + ') { ' + StringProcessor.vars[2] + ' = ' + StringProcessor.vars[0] + '[' + locvar + '];';
			return r;
		} else {
			return s;
		}
	},
	addStringPlaceholder:function(s) {
		return this.addPlaceHolder('string', this.fStrings, s);
	},
	addPlaceHolder:function(type, data, s) {
		var pc = this.pcp + type + '_' + this.getPlaceholderNumber();
		data.push({k:pc, v:s});
		this.placeholderN++;
		return pc;
	},
	/* Заменить строки и комментарии на плейсхолдеры в коде класса, используя существующий код */
	grabClassCommentAndString:function(lines) {
		this.clearFunctionStack();
		this.parseFunctionsMode = true;
		var r = this.grabCommentsStringsVars(lines);
		this.parseFunctionsMode = false;
		return r;
	},
	/** @description скопировать стеки f в стеки c */
	copyFunctionsStackToClassStack:function() {
		this.cStrings  = [];
		this.cComments = [];
		var i, L = this.fStrings.length;
		for (i = 0; i < L; i++) {
			this.cStrings.push( this.fStrings[i] );
		}

		L = this.fComments.length;
		for (i = 0; i < L; i++) {
			this.cComments.push( this.fComments[i] );
		}
	},
	/** @description скопировать стеки c в стеки f */
	copyClassStackToFunctionsStack:function() {
		this.clearFunctionStack();
		var i, L = this.cStrings.length;
		for (i = 0; i < L; i++) {
			this.fStrings.push( this.cStrings[i] );
		}

		L = this.cComments.length;
		for (i = 0; i < L; i++) {
			this.fComments.push( this.cComments[i] );
		}
	},
	clearClassStack:function() {
		this.cVars = [];
		this.cComments = [];
		this.cStrings = [];
		//this.fForeach = [];
		//this.placeholderN = 0;
		this.locvarCounter = 0;
	},
	/**
	 * @param {String} s
	 * @param {Number} i
	 * @return {Boolean} true если символу i строки s предшествует символ '\'
	*/
	previousSymbolIsSlash:function(s, i) {
		var prev = s.charAt(i - 1), pp = s.charAt(i - 2);
		if (prev == '\\' && pp == '\\') {
			return false;
		}
		if (prev == '\\') {
			return true;
		}
		return false;
	},
	/**
	 * @description 
	 * @param {Object} info {line, position, word, message}
	 * @return {Boolean} true если код валидный
	*/
	isValidPhp:function(lines, info) {
		info.line = 0;
		info.position = 0;
		info.word = '';
		info.message = '';
		var words = ['arrayka('], i, j, s, a, start;
		for (i = 0; i < words.length; i++) {
			s = words[i];
			start = lines.indexOf(s);
			if (~start && lines.charAt(start - 1) != '_') {
				s = lines.substring(0, start + words[i].length);
				a = s.split('\n');
				info.line = a.length;
				s = a[a.length - 1];
				info.position = s.indexOf(words[i]);
				if (!~info.position) {
					s = a[a.length - 2];
					info.position = s.indexOf(words[i]);
				}
				if (words[i] == 'array(') {
					info.message = 'Недопустимое объявление массива array(), используйте []';
				}
				info.word = words[i];
				return false;
			}
		}
		return true;
	},
	setIssetExpression:function(s) {
		var i, j, s, a, start, p, q, aParts = [], newIsset, oldIsset, buf = [], BREAK = 0;
		start = s.indexOf('isset');
		while (~start) {
				q = this.getCloseIssetExpression(s, start, aParts);
				buf = [];
				for (j = 0; j < aParts.length; j++) {
					if ($.trim(aParts[j]).length) {
						buf.push( $.trim(aParts[j]) );
					}
				}
				aParts = buf;

			p = q.length ? start + q.length : start + 1;
			if (q.length) {
				oldIsset = s.substring(start, p);
				newIsset = 'isset(' + aParts.join(', ') + ')';
				if (oldIsset != newIsset) {
					while (~s.indexOf(oldIsset)) {
						s = s.replace(oldIsset, newIsset);
					}
				}
			}
			start = s.indexOf('isset', p);
			aParts = [];
			/*BREAK++;
			if (BREAK > 500) {
				break;
			}*/
		}
		return s;
	},
	/**
	 * @description  собирает "звенья" ->[][]->[]  и оборачивает их в кавычки при необходимости
	 * в массив args
	 * @return фрагмент кода вида 'isset(....)'
	*/
	getCloseIssetExpression:function(s, start, args) {
		var i = start, cBr = 0, ch, started = false, cQBr = 0;
		for (i = start; i < s.length; i++) {
			ch = s.charAt(i);
			if (ch == '(') {
				started = true;
				cBr++;
			}
			if (ch == ')') {
				cBr--;
			}
			
			if (ch == '[') {
				cQBr++;
			}
			
			if (started) {
				this.addIssetExpressionArgument(ch, args, s.charAt(i + 1), (cQBr > 1), cQBr );
			}
			if (ch == ']') {
				cQBr--;
			}
			if (started && cBr == 0) {
				return s.substring(start, i + 1);
			}
		}
		return '';
	},
	/** @description  собирает "звенья" ->[][]->[]  и оборачивает их в кавычки при необходимости
	 * @params @see getCloseIssetExpression
	 * @param  {Boolean} append - если true то ch безоговорочно добавляется к текущему аргументу
	 * @param  {Number} countQBrackets - уровень вложенности в []
	 * @return {Array}
	*/
	addIssetExpressionArgument:function(ch, args, nextChar, append, countQBrackets) {
		//args.push('T');return;

		var s = args.length > 0 ? args[args.length - 1] : '',
		   idx = args.length > 0 ? args.length - 1 : -1;
		if (idx == -1) {
			args.push('');
			idx = 0;
		}
		
		if (!append && countQBrackets == 1) {
			if (ch == '-' || ch == '>' || ch == '.') {
				append = true;
			}
		}
		
		if (append ||  (ch != '[' && ch != ']' && ch != '-'  && nextChar != '>' && ch != ')' && ch != '(' && ch != '.')) {
			s += ch;
			args[idx] = s;
		} else if(s.length){
			s = s.replace(/\s/gm, '');
			if (s.length) {
				if (s.indexOf(this.pcp) !== 0 && s.indexOf('$') !== 0 && args.length != 1) {
					s = '"' + s + '"';
					s = this.addPlaceHolder('string', this.fStrings, s);
					//console.log('Append ' + s);
				}
				args[args.length - 1] = s;
				args.push('');
			}
		}
	},
	/**
	 * @description Заменяет все вхождения parent::foo(bar); в исходный код  на className.superclass.foo.call(this, bar);
	*/
	replaceParentLexema:function(className, s) {
		var start, end, i, j, q, head, tail;
		start = s.indexOf('parent');
		while (~start) {
			end = s.indexOf(';', start);
			if (end > start) {
				q = this._replaceOneParentFragment(className, s.substring(start, end));
				head = s.substring(0, start);
				tail = s.substring(end);
				s = head + q + tail;
			} else {
				break;
			}
			start = s.indexOf('parent');
		}
		return s;
	},
	/**
	 * @description Заменяет все вхождения parent::foo(bar); в исходный код  на className.superclass.foo.call(this, bar);
	*/
	_replaceOneParentFragment:function(className, s) {
		s = s.replace(/parent\s*\:\:\s*/, '');
		s = s.replace(/parent\s+\.\s+/, '');
		var a = s.split('('), t = ', ';
		if ($.trim(a[1]).charAt(0) == ')') {
			t = '';
		}
		s = className + '.superclass.' + a[0] + '.call(this' + t + a[1];
		return s;
	},
	/**
	 * @description Заменяет все вхождения array(bar); на [bar]
	*/
	adaptiveArrayLexema:function(s) {
		var re = /array\s*\(/mi, start = s.search(re), i, j, k = 0,
			ch, sBuf = '', placeholder = 'PHPJS_ARR_TAG_', m, 
			list = {}, q, doExit,
			lat = 'abcdefghijklmnopqrstuvwxyz',
			varAllow = '$0123456789_' + lat + lat.toUpperCase(),
			head, tail;
		while (~start) {
			ch = s.charAt(start - 1);
			if (~varAllow.indexOf(ch) ) {
				//start = s.search(re, start + 1);
				m = placeholder + k;
				k++;
				q = 'array(';
				s = s.replace(/array\s*\(/im, m);
				list[m] = q;
				start = s.search(re);
				break;
			} else {
				head = s.substring(0, start);
				tail = s.substring(start);
				tail = tail.replace(/^array\s*\(/i, '[');
				i = 1;
				sBuf = '';
				doExit = false;
				for (j = 0; j < tail.length; j++) {
					ch = tail.charAt(j);
					if (ch == '(') {
						i++;
					}
					if (ch == ')') {
						i--;
					}
					if (ch == ')' && i == 0 && !doExit) {
						ch = ']';
						doExit = true;
					}
					sBuf += ch;
				}
				s = head + sBuf;
				start = s.search(re);
			}
		}
		for (i in list) {
			s = s.replace(i, list[i]);
		}
		return s;
	},
	/**
	 * @description Устанавливает номер плейсхолдера с ведущими нулями
	*/
	getPlaceholderNumber:function() {
		var n = String(this.placeholderN), L = this.numLength.length - n.length, i, s = '';
		for (i = 0; i < L; i++) {
			s += '0';
		}
		s += n;
		return s;
	}
};


