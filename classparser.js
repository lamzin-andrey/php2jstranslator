/** 
 * @class Обрабатывает код PHP класса
*/
var ClassParser = {	
	/** Парсит определение одного php класса */
	parse:function(sClassPhp, cPhpjs) {
		var s = sClassPhp;
		//3 распарсить код класса, заполнить стек функций элементами имя тело аргументы
		// 3.1 class Foo extends Bar { ... } вырезаем, оставляем только ...
		/** @var classInfo {className, classBody, extendsClassName, interfaces:[], template} */
		//здесь template - это наша s, в которой ... заменен на placeholder_class_body
		var classInfo = this.grabClassDefine(s);//TODO
		// 3.2 Находим ближайшее вхождение function от него получаем имя, аргументы и тело.
		// 3.3 От того же вхождения function надо как-то получить static public
		//     Например пятиться назад, пока встретился "не символ", потом инвертировать полученное слово
		//     и сравнить его с public private protected static
		//     закончить процесс, когда встретился } или ; или вышли за начало строки
		// 4 Все эти методы менять на плейсхолдеры. Должны остаться только плейсхолдеры и объявления 
		//    полей класса.
		//5 Последовательно ищем static  и все остальные поля класса, меняем на плейсхолдеры.
		classParser.parseBody(classInfo.classBody);//TODO

		//6 Пройти по стеку функций, каждое тело отдавать translateFunction(lines)
		for (var i in this.cFunctions) {
			var fLines = 'function ' + this.cFunctions[i].name + '(' + 
				this.cFunctions[i].args,join(', ') + ') ' + this.cFunctions[i].body;
			var translate = cPhpJs.translateFunction(fLines);
			this.setFunctionData(translate, i);//TODO
		}
		//TODO меняем на 
		s = classParser.build();
		return s;
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

		


		

		
		