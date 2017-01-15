/** 
 * @class Обрабатывает код PHP класса
*/
var ClassParser = {	
	/** @property classInfo {className, classBody, extendsClassName, interfaces:[], template, outerPlaceholders} 
	 * outerPlaceholders - элементы, начинающиеся с Phpjs.pcp и встречающиеся до слова class
	*/

	/**
	 * @property cFunctions {Array} массив хеш функйий
	 * Элемент: {placeholder:String, name:String, args:[], body:String}
	 * placeholder - ключ, на который заменена функция в исходном коде
	 * name - имя функции
	 * args - массив аргументов функции 
	 *        Элемент: String
	 * body - текст функции от открывающей { до закрывающей }
	 * visible - string private, protected or public
	 * isStatic  - true
	*/
	cFunctions: [],
	/**
	 * @property cFunctions {Array} массив хеш функйий
	 * Элемент: {placeholder:String, :String, args:[], body:String}
	 * placeholder - ключ, на который заменена функция в исходном коде
	 * name - имя функции
	 * args - массив аргументов функции 
	 *        Элемент: String
	 * body - текст функции от открывающей { до закрывающей }
	 * visible - string private, protected or public
	 * isStatic  - true
	*/
	cFields   : [],
	pcp       : 'phpjs_f_placeholder_',
	pcpCounter : 0,
	/** @property {Array} constructorFragment собирает поля класса в этот массив, чтобы поместить потом этот фрагмент в текст функции конструктора **/
	constructorFragment : [],
	/** @property {Array} constantsFragment собирает константы класса в этот массив, чтобы определить из потом в синтаксисе js **/
	constantsFragment : [],
	/** @property {Boolean}  buildAsStaticObject  если true то собирает класс как объект без возможности наследования */
	buildAsStaticObject : false,

	init:function(objectType) {
		this.cFunctions = [];
		this.cFields = [];
		this.pcpCounter = 0;
		this.constructorFragment = [];
		this.constantsFragment = [];
		if (objectType == 1) {
			this.buildAsStaticObject = true;
		}
	},

	/** Парсит определение одного php класса */
	parse:function(sClassPhp, cPhpjs) {
		var s = sClassPhp;
		this.cPhpjs = cPhpjs;
		
		//3 распарсить код класса, заполнить стек функций элементами имя тело аргументы
		// 3.1 class Foo extends Bar { ... } вырезаем, оставляем только ...
		/** @var classInfo {className, classBody, extendsClassName, interfaces:[], template} */
		//здесь template - это наша s, в которой ... заменен на placeholder_class_body
		var classInfo = this.grabClassDefine(s);
		//console.log(this.classInfo);
		this.parseBody();
		//6 Пройти по стеку функций, каждое тело отдавать translateFunction(lines)
		this.translateFunctions(cPhpjs);
		//6.1 поля собрат в конструктор или в отдельную секцию для static класса
		//конструктор получить в цикле выше. В него при получении добавить спец __PHPJS_CLASS_INITALIZE__
		//Этот маркер заменить на собранные поля.
		//TODO меняем на 
		s = this.build();
		return s;
	},

	parseBody:function() {
		this.grabFunctions();
		//5 Последовательно ищем static  и все остальные поля класса, меняем на плейсхолдеры.
		this.grabFields();
	},
	/** 
     * @description Собирает поля класса в массив cFields
	*/
	grabFields:function() {
		var s = this.classInfo.classBody,
			keywords = ['public', 'private', 'protected', 'static', 'const'],
			metadata = {},
			placeholder,
			i, kw, p = 0, start, end, data;
		for(i = 0; i < keywords.length; i++) {
			kw = keywords[i];
			p = s.indexOf(kw);
			while (p != -1) {
				end = s.indexOf(';', p);
				//start = s.lastIndexOf(';', p);
				if (/*start == -1 && */kw != 'static') {
					start = s.lastIndexOf('static', p);
				}
				if (start == -1) {
					start = p;
				} else {
					//start++;
				}
				if (end > start) {
					data = this.parseClassField(s.substring(start, end + 1));
					if (!data.success) {
						p = s.indexOf(kw, p + 1);
						continue;
					} else {
						this.cFields.push(data);
						s = s.replace(data.raw, data.placeholder);
						p = s.indexOf(kw);
					}
				} else {
					p = s.indexOf(kw, p + 1);
				}
			}
		}
		this.classInfo.classBody = s;
	},
	/** 
     * @description Собирает поля класса в массив cFields
     * @param {String} s - строка определяющая поле класса, например `static public $arr = [1,2,3];`
     * @return {placeholder, varname, value, visible, isStatic, isConst}
	*/
	parseClassField:function(s) {
		s = $.trim(s);
		var brStart = s.indexOf('['),
			brEnd = s.lastIndexOf(']'),
			array, res = {raw:$.trim(s)}, i, word, placeholder;
		placeholder = this.pcp + this.pcpCounter;
		res.placeholder = placeholder;
		this.pcpCounter++;

		if (brStart != -1 && brEnd != -1 && brStart < brEnd ) {
			array = s.substring(brStart, brEnd + 1);
			res.value = array;
			s = s.replace(array, '');
		}
		array = s.split(/\s/);
		for (i = 0; i < array.length; i++) {
			word = array[i];
			word = word.replace(/;$/, '');
			word = word.replace(/^;/, '');
			if (word.length > 1) {
				if (word == 'static') {
					res.isStatic = true;
				} else if (word == 'private' || word == 'public' || word == 'protected') {
					res.visible = word;
				} else if (word == 'const') {
					res.isConst = true;
				}else if (word.charAt(0) == '$') {
					res.varname = word;
					res.success = true;
				} else if (res.isConst && word.charAt(0) != '=' && !res.varname) {
					res.varname = word;
					res.success = true;
				} else if (word.charAt(0) == '=') {
					continue;
				} else if (!res.value && word != ';'){
					res.value = word;
				}
			}
		}
		//console.log('parseClassField: RETURN: "' + s + '"');
		return res;
	},
	/** 
     * @description Собирает функции в массив cFunctions
     * TODO проверить
	*/
	grabFunctions:function() {
		// 3.2 Находим ближайшее вхождение function от него получаем имя, аргументы и тело.
		// 3.3 От того же вхождения function надо как-то получить static public
		//     Например пятиться назад, пока встретился "не символ", потом инвертировать полученное слово
		//     и сравнить его с public private protected static
		
		//     закончить процесс, когда встретился } или ; или вышли за начало строки
		// 4 Все эти методы менять на плейсхолдеры. Должны остаться только плейсхолдеры и объявления 
		//    полей класса.
		var s = this.classInfo.classBody,
			f = 'function',
			metadata = {},
			placeholder,
			p = s.indexOf(f);
		//console.log(s);
		while (p != -1) {
			/* s - content, p - position, f - function */
			metadata = this.parseFunction(s, p, f);
			if (metadata.success) {
				placeholder = this.pcp + this.pcpCounter;
				this.pcpCounter++;
				s = s.replace(metadata.rawContent, placeholder);
				this.cFunctions.push( {
					placeholder:placeholder,
					name:metadata.name,
					args:metadata.args,
					body:metadata.body,
					visible:metadata.visible,
					isStatic:metadata.static
				} );
				p = s.indexOf(placeholder);
				p = s.indexOf(f, p);
			} else {
				p = s.indexOf(f, p + 1);
			}
		}
		//console.log(s);
		this.classInfo.classBody = s;
	},
	/**
	 * @return {name, body, args:[], closePosition, rawContent}
	*/
	parseFunction:function(content, position, sFunction, noSetArgumets) {
		//console.log(content);
		position += sFunction.length;
		var f = sFunction, bCount = 0, start = 0, sz = content.length, i, s = content, ch,
			res = {}, body = '',
			//переменные относящиеся к разбору имени
			inArglist = 0, word = '', allow = '$&abcdefghijklmnopqrstuv_wxyz=[]', args = [],
			//переменные относящиеся к разбору модификаторов области видимости  и типа функции
			aWord = [], startPos;
		allow += (allow.toUpperCase() + '0123456789');
		for (i = position; i < sz; i++) {
			ch = s.charAt(i);
			if (ch == '{') {
				bCount++;
				start = 1;
			}
			if (ch == '}') {
				bCount--;
				if (start && bCount == 0) {
					res.closePosition = i + 1;
				}
			}
			if (start) {
				body += ch;
			}
			if (start && bCount == 0) {
				break;
			}
			//разбор имени функции
			if (!start) {
				if (~allow.indexOf(ch)) {
					word += ch;
				} else {
					if (inArglist) {
						args.push(word);
						word = '';
					}
				}

				if (ch == '(') {
					res.name = word;
					word = '';
					inArglist = 1;
				}
				if (ch == ')') {
					inArglist = 0;	
				}
			}
		}
		var dbg = false, countVisible = 0;
		
		
		if (!noSetArgumets) {
			//console.log('GET ' + args);
			var defaultArgsFragment = this.createDefaultArgsFragment(args);
			//console.log('OUTPUT ' + defaultArgsFragment);
			//body = defaultArgsFragment + body;
			body = body.replace('{', '{\n' + defaultArgsFragment);
		}
		args = this.normalizeArgs(args, dbg);//удаляет значения по умолчанию и типы данных
		//console.log('after normalize:');
		//console.log(args);
		if (res.closePosition) {
			res.body = body;
			res.args = args;
			position -= sFunction.length;
			for (i = position; i > -1; i--) {
				ch = s.charAt(i);
				if (ch == '}' || ch == ';') {
					startPos = s.indexOf(res.visible, i);
					if (res.static) {
						var ts = startPos = s.indexOf('static', i);
						if (ts < startPos) {
							startPos = ts;
						}
					}
					break;
				}
				if (~allow.indexOf(ch)) {
					aWord.push(ch);
				} else {
					word = aWord.reverse().join('');
					aWord = [];
					switch (word) {
						case 'public':
						case 'private':
						case 'protected':
							countVisible++;
							if (res.visible) {
								break;
							}
							res.visible = word;
							break;
						case 'static':
							res.static = true;
							break;
					}
				}
				if ( (res.static && countVisible > 0) || countVisible > 1) {
					startPos = i;
					if (countVisible > 1) {
						startPos = s.indexOf(res.visible, i + 1);
					}
				}
			}
			res.rawContent = s.substring(startPos, res.closePosition);
			//phpjs_f_placeholder_
			var placeholderstart = 'phpjs_f_placeholder_', isInvalid = 0;
			while (~res.rawContent.indexOf(placeholderstart)) {
				isInvalid = 1;
				startPos = res.rawContent.indexOf(placeholderstart) + placeholderstart.length + 1;
				while (allow.indexOf(res.rawContent.charAt(startPos)) != -1) {
					startPos++;
				}
				res.rawContent = s.substring(startPos, res.closePosition);
			}
			if (isInvalid) {
				res.rawContent = s.substring(startPos, res.closePosition);
			}
			res.success = true;
			return res;
		}
	},
	/** 
	 * @return {Array} массив строк аргументов, освобожденных от типа данных и значений по умолчанию
	*/
	normalizeArgs:function(args, dbg) {
		args = this._prepareArgs(args, dbg);
		/*if (dbg) {
			console.log(args);
		}*/
		var i, j, ch, s, arr, res = [], val, pair;
		for (i = 0; i < args.length; i++) {
			s = args[i];
			arr = s.split('=');
			s = arr[0];
			val = null;
			if (arr[1]) {
				val = arr[1];
			}
			arr = s.split(/\s+/);
			for (j = 0; j < arr.length; j++) {
				ch = arr[j];
				if (ch.length && ch.charAt(0) == '$') {
					pair = [];
					pair.push(ch);
					if (val) {
						pair.push(val);
					}
					res.push(pair);
					break;
				}
			}
		}
		return res;
	},
	/**
     * @description Собирает значения по умолчания переменных в переменные
     * Например если передан ['$varname', '=', 'value', 'array', '$arr'] вернет ['$varname=value', 'array', '$arr']
	*/
	_prepareArgs:function(args, dbg) {
		/*if (dbg) {
			console.log('_prepareArgs get args:');
			console.log(args);
		}*/
		var buf = [], i, j, prev, bufSz = 0;
		for (i = 0; i < args.length; i++) {
			j = args[i];
			if (j == '=') {
				prev = buf[bufSz - 1];
				if (String(prev).charAt(0) == '$') {
					buf[bufSz - 1] = buf[bufSz - 1] + '=' + args[i + 1];
					i++;
					continue;
				}
			} else {
				if (j) {
					buf.push(j);
					bufSz++;
				}
			}
		}
		return buf;
	},
	/** @var classInfo {className, classBody, extendsClassName, interfaces:[], template} */
		
	grabClassDefine:function(s) {
		this.classInfo = {interfaces:[]};
		var i = s.indexOf('class'),
			allow = 'abcdefghijklmnopqrstuvwxyz', ch, word, j, isExtends = false,
			isImplements = false;
		allow += allow.toUpperCase() + '0123456789';
		if (i > -1) {
			i = i + String('class').length;
			for (j = i; j < s.length; j++) {
				ch = s.charAt(j);
				if (!~allow.indexOf(ch)) {
					word = $.trim(word);
					//console.log('word = ' + word);
					if (word.length) {
						//console.log(word);
						if (!this.classInfo.className) {
							this.classInfo.className = word;
						} else if (word == 'extends') {
							isExtends = true;
						} else if(this.classInfo.className) {
							//console.log('Ye, it already className');
							if (isExtends) {
								//console.log('Ye, it already extends...');
								this.classInfo.extendsClassName = word;
								isExtends = false;
							}else if (word == 'implements') {
								isImplements = true;
							}else if (isImplements) {
								this.classInfo.interfaces.push(word);
							}
						}
					}
					word = '';
				} else {
					word += ch;
				}
				if (ch == '{') {
					break;
				}
			}

			if(this.classInfo.className) {
				var start = s.indexOf('{'),
					end = s.lastIndexOf('}');
				this.classInfo.classBody = s.substring(start + 1, end);
				this.classInfo.outerPlaceholders = this.parseClassOuterPlaceholders(s);
			}
		}
	},
	//.... перед вызовом должен выполниться код из Phpjs::translate. (cycle 6)
	build:function() {
		//7 Пройти по стеку полей,  сохраненные строки парсить. Если поле было инициализованно значением, 
		//   менять на строку, которая будет переправлена в constructor
		//   иначе на комментарий вида @property
		this.restoreFields();//TODO 
		var s = this.buildClassDefinion();
		return s;
	},
	/**
     * @description Устанавливает -ому элементу cFunctions переведенный на js текст body
     * @param {String} jsFunctionText
     * @param {Number} index
	*/
	setFunctionData:function(jsFunctionText, index) {
		var data = this.parseFunction(jsFunctionText, 0, 'function', true);
		this.cFunctions[index].body = data.body;
	},
	/** @description Проходит по всем элементам cFunctions и меняет body на js код 
	 *  
	*/
	translateFunctions:function(cPhpJs) {
		//console.log(cPhpJs);
		for (var i in this.cFunctions) {
			var fLines = 'function ' + this.cFunctions[i].name + '(' + 
				this.joinArgs(i) + ') ' + this.cFunctions[i].body;
			var translate = cPhpJs.translateFunction(fLines, this.classInfo.className);//TODO второй аргумент с аргументами разбираемой функции и пусть их добавить в тело со значениями по умолчанию.
			this.setFunctionData(translate, i);//TODO
		}
	},
	/**
	 *
	**/
	joinArgs:function(i) {
		var args = this.cFunctions[i].args, b = [], j, n;
		for (j = 0; j < args.length; j++) {
			n = args[j][0];
			if (args[j][1]) {
				n += ' = ' + args[j][1];
			}
			b.push(n);
		}
		return b.join(', ');
	},
	restoreFields:function() {
		var s = this.classInfo.classBody, i, j, iValue, dValue, sValue, divider = '=', token = ';', expr, ex;
		
		for(i = 0; i < this.cFields.length; i++) {
			j = this.cFields[i];
			
			if (j.value) {
				sValue = String(j.value);
				iValue = parseInt(sValue, 10);
				dValue = parseFloat(sValue);
				if (String(iValue) === sValue) {
					j.value = iValue;
				} else if (String(dValue) === sValue) {
					j.value = dValue;
				} else {
					j.value = sValue;
				}
				if (!j.isConst) {
					ex = '/** @property ' + j.varname + ' */\n' + '\tthis.' + j.varname + ' ' + divider + ' ' + j.value + token;
				} else {
					ex = '/** @const ' + j.varname + ' */\n' +  this.classInfo.className +  '.' + j.varname + ' ' + divider + ' ' + j.value + token;
				}
				s = s.replace(j.placeholder, '');
			} else {
				ex = '/** @property ' + j.varname + ' */';
				s = s.replace(j.placeholder, '');
			}
			if (!j.isConst) {
				this.constructorFragment.push(ex);
			} else {
				this.constantsFragment.push(ex);
			}
			this.classInfo.classBody = s;
		}
		//7 Пройти по стеку полей,  сохраненные строки парсить. Если поле было инициализованно значением, 
		//   менять на строку, которая будет переправлена в constructor
		//   иначе на комментарий вида @property
		
		
	},
	/**
	 *
	**/
	buildClassDefinion:function() {
		var i, j, constructorFragment = this.constructorFragment.join('\n'), extendConstructorBody = '',
			openClassPart = '', closeClassPart = '', sArgs, body = [], F, token = '\n', s,
			sBody = this.classInfo.classBody;
		var tab = '    ';
		
		//1 Если тип класса не статик, строим функцию конструктор.
		//2 В засисимости от типа класса стоим открывающий и закрывающий код определения класса
		//static:
		//var ClassName = {
		//};

		//extendSupport
		//ClassName.prototype = {

		//};
		if (this.buildAsStaticObject == false) {
			extendConstructorBody = 'function ' + this.classInfo.className + '(ARGUMENTS) {\n//CONSTRUCTOR_FRAGMENT\n}\n';
			openClassPart = '';//this.classInfo.className + '.prototype = {\n';
		} else {
			openClassPart = '';//'var ' + this.classInfo.className + ' = {\n';
		}
		//3 Проходим по функциям и добавляем их в тело.
		//  Встретив __construct 
		//    Если static
		//      constructorFragment добавляем перед первой функцией
		//    Иначе 
		//      тело функции добавляем в код конструктора из первого пункта.
		for (i = 0; i < this.cFunctions.length; i++) {
			j     = this.cFunctions[i];
			sArgs = this._prepareArgsForBuild(j.args);
			/**
			 * @property cFunctions {Array} массив хеш функйий
			 * Элемент: {placeholder:String, name:String, args:[], body:String}
			 * placeholder - ключ, на который заменена функция в исходном коде
			 * name - имя функции
			 * args - массив аргументов функции 
			 *        Элемент: String
			 * body - текст функции от открывающей { до закрывающей }
			 * visible - string private, protected or public
			 * isStatic  - true
			*/
			if (j.name == '__construct') {
				if (this.buildAsStaticObject) {
					j.body = j.body.replace('{', '{\n' + tab + tab + constructorFragment + '\n');
				} else {
					s = j.body.replace('{', '');
					s = s.replace(/\}$/m, '');
					extendConstructorBody = extendConstructorBody.replace('//CONSTRUCTOR_FRAGMENT', '\n' + constructorFragment + "\n" + s);
					extendConstructorBody = extendConstructorBody.replace('ARGUMENTS', sArgs);
					sBody = sBody.replace(j.placeholder, '');
					continue;
				}
			}
			if (i == this.cFunctions.length - 1) {
				token = '\n';
			}
			j.body = this.formatter(j.body, 1, tab);//TODO
			var prefixClassMethod = this.classInfo.className + '.prototype.'

			if (this.buildAsStaticObject || j.isStatic) {
				prefixClassMethod = this.classInfo.className + '.'
			}
			F = prefixClassMethod + j.name + ' = function(' + sArgs + ') ' + j.body + token;
			sBody = sBody.replace(j.placeholder, F);
			//body.push(F);
		}
		var res = this.classInfo.outerPlaceholders + '\n' + extendConstructorBody + openClassPart + sBody + closeClassPart;
		if (this.classInfo.extendsClassName) {
			this.constantsFragment.push('extend(' + this.classInfo.extendsClassName + ', ' + this.classInfo.className + ');');
		}
		res = this.constantsFragment.join('\n') + '\n' + res;
		return res;
	},
	/**
     * @description  Соединить аргументы для публикации в js функции (то есть берем только имена аргументов)
	*/
	_prepareArgsForBuild:function(args) {
		var s = '', i, j, b = [];
		for (i = 0; i < args.length; i++) {
			j = args[i];
			b.push(j[0]);
		}
		s = b.join(', ');
		return s;
	},
	/**
	 *
	*/
	formatter:function(s, count, tab) {
		var a = s.split('\n'), i, q, j, lines = [], c = count, lTab = tab, f = 0;
		for (i = 0; i < a.length; i++) {
			q = $.trim(a[i]);
			
			if (i > 0) {
				if (i == a.length - 1) {
					c--;
					if (c < 0) {
						c = 0;
					}
				}
				if (q == '}') {
					//var x = lTab.lastIndexOf(tab);
					//lTab = lTab.substring(0, x);
					c--;
					f = 1;
				}
				for (j = 0; j < c; j++) {
					q = lTab + q;
				}
				if (q.indexOf('{') != -1) {
					//lTab += tab;
					c++;
				}
				if (q.indexOf('}') != -1 && f != 1) {
					//var x = lTab.lastIndexOf(tab);
					//lTab = lTab.substring(0, x);
					c--;
				} else if (f == 1) {
					f = 0;
					//lTab += tab;
					//c++;
				}
			}
			lines.push(q);
		}
		return lines.join('\n');
	},
	/**
	 * @description
	*/
	parseClassOuterPlaceholders:function(s) {
		var q = s.substring(0, s.indexOf('class')),
			a = q.split(/\s+/mig), i, word, r = [];
		for (i = 0; i < a.length; i++) {
			word = a[i];
			if (~word.indexOf(this.cPhpjs.pcp)) {
				r.push(word);
			}
		}
		r = r.join('\n');
		return r;
	},
	/**
	 * @description Создаёт строку вида arg0 = String(arg0) === 'undefined' ? value : arg0; для аргументов фукнкции со значениями по умолчанию.
	*/
	createDefaultArgsFragment:function(args) {
		var aBuf = [], s, i, j, k = 0, linkBuf = [], isLink = false, map = {};
		for (i = 0; i < args.length; i++) {
			if 	(
					(args[i + 1] == '='  && args[i + 2].charAt(0) != '$' && args[i].charAt(0) == '$')
					||(
						args[i + 1] == '='  && args[i + 2].charAt(0) != '&' && args[i].charAt(0) == '&'
					)
				) {
				if (args[i + 2].charAt(0) != '&' && args[i].charAt(0) == '&') {
					isLink = true;
				}
				args[i] = args[i].replace('&', '');
				aBuf.push('\t' + args[i] + " = String(" + args[i]  +  ") == 'undefined' ? " + args[i + 2] + " : " +  args[i] + ";");
				map[args[i]] = 1;
				if (!isLink) {
					linkBuf.push( '\t' + args[i] + " = __php2js_clone_argument__("  + args[i] + ");");
				} else {
					isLink = false;
				}
				k++;
			}
		}
		
		for (i = 0; i < args.length; i++) {
			if ( (args[i].charAt(0) == '$' && !map[args[i]]) ) {
				linkBuf.push( '\t' + args[i] + " = __php2js_clone_argument__("  + args[i] + ");");
				map[args[i]] = 1;
				k++;
			} else if (args[i].charAt(0) == '&' && !map[args[i].replace('&', '')]) {
				args[i] = args[i].replace('&', '');
				map[args[i]] = 1;
				k++;
			}
		}
		
		if (k > 0) {
			return (aBuf.join("\n") + "\n" + linkBuf.join("\n") + "\n");
		}
		return "";
	}
}

		


		

		
		
