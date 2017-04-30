/**  for fun create analogy mysql_* php5 functions*/
var mysql = {};
/**
 * @param {Function} callback принимает аргументы (error, numrows, numaffectedrows, rows, insertid)
*/
function mysql_query(s, callback, progress_callback) {
	if (window.rawdbdata) {
		delete window.rawdbdata;
	}
	mysql.callback = callback;
	mysql.progress_callback = progress_callback;
	if (isSelectSqlQuery(s)) {
		_mysqlParseSelect(s);//TODO вызвать callback с ошибкой или в случае успеха выполнить код ниже.
	} else {
		_mysqlLog(s);//TODO
	}
}
/**
 * @description сецчс узко заточено для парсинга запросов SELECT ... FROM ... WHERE {one_fielname} LIKE('word%')   LIMIT 30
 * @return {table,condition,limit,selectFields,numParts}
 */
function _mysqlParseSelect(s) {
	s = trim(s);
	var sourceSelect = s, res = {}, i, j, k, selectFields = [], a;
	s = s.toLowerCase();
	a = s.split('from')[0];
	if (a.indexOf('select') != 0) {
		res.failure = true;;
		res.error = 'It no SELECT query';
		//(error, numrows, numaffectedrows, rows, insertid)
		mysql.callback('It no SELECT query', 0, 0, [], 0);
		return;
	}
	a = trim(a.replace('select', ''));
	a = a.split(',');
	for (i = 0; i < a.length; i++) {
		if (trim(a[i])) {
			selectFields.push(a[i]);
		}
	}
	res.selectFields = selectFields;
	//get table name
	a = s.split('from');
	s = a[1];
	if (!s) {
		res.failure = true;
		res.error = 'In SELECT query not found part after FROM';
		mysql.callback(res.error, 0, 0, [], 0);
		return;
	}
	a = s.split('where')[0];
	res.table = trim(a);
	if (!res.table) {
		res.failure = true;
		res.error = 'In SELECT query not found part after FROM';
		mysql.callback(res.error, 0, 0, [], 0);
		return;
	}
	s = sourceSelect;
	//get condition
	a = s.split('where')[1];
	if (!a) {
		a = s.split('WHERE')[1];
	}
	if (!a) {
		res.failure = true;
		res.error = 'In SELECT query not found part after WHERE';
		mysql.callback(res.error, 0, 0, [], 0);
		return;
	}
	a = a.split('limit')[0];
	if (!a.split('limit')[1]) {
		a = a.split('LIMIT')[0];
	}
	res.condition = [];
	res.condition.push(trim(a));
	//get limit
	a = s.split('limit')[1];
	if (!a) {
		a = s.split('LIMIT')[1];
	}
	if (!a) {
		res.failure = true;
		res.error = 'In SELECT query not found part after LIMIT';
		mysql.callback(res.error, 0, 0, [], 0);
		return;
	}
	res.limit = intval(trim(a));
	if (defined('MYSQL_EMU_SOURCE_FILE')) {
		var id = 'mysqlemuscript';
		var scr = document.getElementById(id);
		var head = document.getElementsByTagName('head')[0];
		if (scr) {
			head.removeChild(scr);
		}
		scr = document.createElement('script');
		scr.id = id;
		scr.src = 'js/db/' + res.table + '.info.js';
		mysql.scr = scr;
		mysql.selectQuery = res;
		scr.onload = _mysqlOnParseSelect;
		scr.onerror = _mysqlOnFailLoadScriptData;
		head.appendChild(scr);
	}
	return res;
}
/**
 * @description Обработка успешного добавления скрипта с данными
*/
function _mysqlOnParseSelect() {
	if (window.rawdbinfo && parseInt(window.rawdbinfo.size)) {
		var numParts = parseInt(window.rawdbinfo.size);
		//console.log(mysql.selectQuery);
		if(mysql.selectQuery.failure) {
			_mysqlLog(selectQuery.error);
			mysql.callback(selectQuery.error, 0, 0, [], 0);
			return;
		}
		mysql.selectQuery.numParts = numParts;
		mysql.selectQuery.currentPart = 0;
		mysql.result = [];
		mysql.currentRow = 0;
		_mysqlIncludePart();
		return;//DEBUG
		/*var i, j, k, row, result = [];
		for (i = 0; i < numParts; i++) {
			if (window.rawdbdata) {
				delete window.rawdbdata;
			}
			_mysqlIncludePart(i, selectQuery.table);
			
			mysql.res = result;
			return true;//вместо этого вызываем callback
		}*/
	} else {
		var res = {};
		res.failure = true;
		res.error = 'Source '  + mysql.scr.src + ' not found or not work';
		mysql.callback(res.error, 0, 0, [], 0);
	}
}
/**
 * 
*/
function onLoadPartTable() {
	//mysql.callback('Fail load part ' + mysql.currentPart + ' of table ' + mysql.selectQuery.table, 0, 0, [], 0);
	mysql.startTime = time();
	var row, i, t;
	//console.log(mysql.currentRow);
	mysql.progress_callback(mysql.currentRow, mysql.selectQuery.currentPart);
	for (j in window.rawdbdata) {
		mysql.currentRow++;
		row = window.rawdbdata[j];
		row = _mysqlCheckCondition(row, mysql.selectQuery.condition);
		if (row) {
			mysql.result.push(_mysqlDecode(row));
			if (parseInt(String(mysql.selectQuery.limit))) {
				if (mysql.result.length == parseInt(String(mysql.selectQuery.limit))) {
					mysql.progress_callback(mysql.currentRow, mysql.selectQuery.currentPart);
					mysql.callback('', mysql.result.length, 0, mysql.result, 0);
					return;
				}
			}
		} else {
			delete window.rawdbdata[j];
		}
		if (time() - mysql.startTime > 3) {
			setTimeout(function(){
				//mysql.currentPart
				mysql.progress_callback(mysql.currentRow, mysql.selectQuery.currentPart);
				onLoadPartTable();
			},10
			);
			return;
		}
	}
	setTimeout(function(){
		mysql.selectQuery.currentPart++;
		if (mysql.selectQuery.currentPart > mysql.selectQuery.numParts) {
			mysql.progress_callback(mysql.currentRow, mysql.selectQuery.currentPart);
			mysql.callback('', mysql.result.length, 0, mysql.result, 0);
		} else {
			_mysqlIncludePart();
		}
	},10
	);
}
function _mysqlisLike(conditionPart, info) {
	var re = /[a-zA-Z]+\s+like/i, a, s;
	if (re.test(conditionPart)) {
		a = conditionPart.split('like');
		if (!a[1]) {
			a = conditionPart.split('LIKE');
		}
		info.field = trim(a[0]);
		s = trim(a[1]).replace('(', '').replace(')', '');
		s = s.replace(/'/gim, '');
		s = trim(s);
		if (s.indexOf('%') == 0) {
			info.isEnd = 1;
		} else if (s.indexOf('%') != -1) {
			info.isBegin = 1;
		}
		s = s.replace('%', '');
		if (s.indexOf('%') != -1) {
			if (info.isEnd) {
				info.isWord = 1;
			}
			s = s.replace('%', '');
		}
		info.str = s.toLowerCase();
		return true;
	}
	return false;
}
function _mysqlCheckConditionPart(row, conditionPart) {
	var info = {field:'', str:'', isBegin:0, isWord:0, isEnd:0};//{field, str, isBegin, isWord, isEnd}
	if (_mysqlisLike(conditionPart, info)) {
		/*console.log('Ye, it is like');
		console.log(info);
		console.log(row);*/
		
		if (isset(row, info.field)) {
			if (info.isBegin) {
				if (_decode(row[info.field]).toLowerCase().indexOf(info.str) == 0) {
					return true;
				}
			}//TODO later other varianrs
		}
	}
	return false;//TODO later other variants
}
function _mysqlDecode(row) {
	var k, i;
	for (k in row) {
		i = row[k];
		row[k] = _decode(row[k]);
	}
	return row;
}
function _mysqlCheckCondition(row, condition) {
	//console.log(row);
	//console.log(condition);
	var i;
	for (i = 0; i < condition.length; i++) {
		if (!_mysqlCheckConditionPart(row, condition[i])) {
			return false;
		}
	}
	//throw new Error('_mysqlCheckCondition break');
	return row;
}
/**
 * 
*/
function onFailLoadPartTable() {
	mysql.callback('Fail load part ' + mysql.currentPart + ' of table ' + mysql.selectQuery.table, 0, 0, [], 0);
}
/**
 * @description Подключает очередную часть таблицы
*/
function _mysqlIncludePart() {
	var o = mysql.selectQuery, s = 'js/db/' + o.table + '.part' + o.currentPart + '.js', scr = document.getElementById('mysqlemuscript');
	//console.log('o.currentPart = ' + o.currentPart);
	if (!scr) {
		mysql.callback('Error mysql: not found element mysqlemuscript');
		return;
	}
	scr.parentNode.removeChild(scr);
	
	scr = document.createElement('script');
	scr.onload = onLoadPartTable;
	scr.onerror = onFailLoadPartTable;
	scr.id = 'mysqlemuscript';
	scr.src = s;
	document.head.appendChild(scr);
}
function _mysqlOnFailLoadScriptData() {
	var res = {};
	res.failure = true;
	res.error = 'Source '  + mysql.scr.src + ' not found or not work';
	mysql.callback(res.error, 0, 0, [], 0);
}
function isSelectSqlQuery(s) {
	s = trim(strtolower(s));
	if (s.indexOf('select') != 0) {
		return false;
	}
	return true;
}
function mysql_connect(){return true;}
function mysql_close(){return true;}
function mysql_select_db(){return true;}
