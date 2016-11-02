/** 
 * @class Обрабатывает код PHP класса
*/
var ClassParser = {	
	/** @property classInfo {className, classBody, extendsClassName, interfaces:[], template} */
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

	/** Парсит определение одного php класса */
	parse:function(sClassPhp, cPhpjs) {
		var s = sClassPhp;
		
		//3 распарсить код класса, заполнить стек функций элементами имя тело аргументы
		// 3.1 class Foo extends Bar { ... } вырезаем, оставляем только ...
		/** @var classInfo {className, classBody, extendsClassName, interfaces:[], template} */
		//здесь template - это наша s, в которой ... заменен на placeholder_class_body
		var classInfo = this.grabClassDefine(s);
		//console.log(this.classInfo);
		
		this.parseBody();//TODO тестировать все используемые функции

		//6 Пройти по стеку функций, каждое тело отдавать translateFunction(lines)
		/*for (var i in this.cFunctions) {
			var fLines = 'function ' + this.cFunctions[i].name + '(' + 
				this.cFunctions[i].args,join(', ') + ') ' + this.cFunctions[i].body;
			var translate = cPhpJs.translateFunction(fLines);
			this.setFunctionData(translate, i);//TODO
		}

		//6.1 поля собрат в конструктор или в отдельную секцию для static класса
		//конструктор получить в цикле выше. В него при получении добавить спец __PHPJS_CLASS_INITALIZE__
		//Этот маркер заменить на собранные поля.

		//TODO меняем на 
		s = classParser.build();*/
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
			keywords = ['public', 'private', 'protected', 'static'],
			metadata = {},
			placeholder,
			i, kw, p = 0, start, end, data;
		for(i = 0; i < keywords.length; i++) {
			kw = keywords[i];
			p = s.indexOf(kw);
			while (p != -1) {
				end = s.indexOf(';', p);
				start = s.lastIndexOf(';', p);
				if (start == -1 && kw != 'static') {
					start = s.lastIndexOf('static', p);
				}
				if (start == -1) {
					start = p;
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
     * @return {placeholder, varname, value, visible, isStatic}
	*/
	parseClassField:function(s) {
		var brStart = s.indexOf('['),
			brEnd = s.lastIndexOf(']'),
			array, res = {raw:s}, i, word, placeholder;
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
				} else if (word.charAt(0) == '$') {
					res.varname = word;
					res.success = true;
				} else if (word.charAt(0) == '=') {
					continue;
				} else if (!res.value && word != ';'){
					res.value = word;
				}
			}
		}
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
		this.classInfo.classBody = s;

	},
	/**
	 * @return {name, body, args:[], closePosition, rawContent}
	*/
	parseFunction:function(content, position, sFunction) {
		position += sFunction.length;
		var f = sFunction, bCount = 0, start = 0, sz = content.length, i, s = content, ch,
			res = {}, body = '',
			//переменные относящиеся к разбору имени
			inArglist = 0, word = '', allow = '$abcdefghijklmnopqrstuvwxyz=', args = [],
			//переменные относящиеся к разбору модификаторов области видимости  и типа функции
			aWord = [], startPos;
		allow.toUpperCase() + '0123456789';
		for (i = position; i < sz; i++) {
			ch = s.charAt(i);
			if (ch == '{') {
				bCount++;
				start = 1;
			}
			if (ch == '}') {
				bCount--;
				if (start && bCount == 0) {
					res.closePosition = i;
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
		args = this.normalizeArgs(args);//TODO удаляет значения по умолчанию и типы данных
		if (res.closePosition) {
			res.body = body;
			res.args = args;
			position -= sFunction.length;
			for (i = position; i > -1; i--) {
				ch = s.charAt(i);
				if (ch == '}' || ch == ';') {
					break;
				}
				if (~allow.indexOf(ch)) {
					aWord.push(ch);
				} else {
					word = aWord.reverse().join();
					aWord = [];
					switch (word) {
						case 'public':
						case 'private':
						case 'protected':
							res.visible = word;
							break;
						case 'static':
							res.static = true;
					}
				}
				if (res.static && res.visible) {
					startPos = i;
				}
			}
			res.rawContent = s.substring(startPos, metadata.closePosition);
			res.success = true;
			return res;
		}
	},
	/** 
	 * @return {Array} массив строк аргументов, освобожденных от типа данных и значений по умолчанию
	*/
	normalizeArgs:function(args) {
		var i, j, ch, s, arr, res = [];
		for (i = 0; i < args.length; i++) {
			s = args[i];
			arr = s.split('=');
			s = arr[0];
			arr = s.split(/\s+/);
			for (j = 0; j < arr.length; j++) {
				ch = arr[j];
				if (ch.length && ch.charAt(0) == '$') {
					res.push(ch);
					break;
				}
			}
		}
		return res;
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

			if(this.classInfo.className){
				var start = s.indexOf('{'),
					end = s.lastIndexOf('}');
				this.classInfo.classBody = s.substring(start + 1, end);
			}
		}
	},
	//.... перед вызовом должен выполниться код из Phpjs::translate. (cycle 6)
	build:function() {
		//7 Пройти по стеку полей,  сохраненные строки парсить. Если поле было инициализованно значением, 
		//   менять на строку, которая будет переправлена в constructor
		//   иначе на комментарий вида @property
		this.restoreFields();//TODO этот
		var s = this.buildClassDefinion(classInfo);//TODO все слепит И ЭТОТ
		return s;
	}
}

		


		

		
		