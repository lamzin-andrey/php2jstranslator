var subject;
var line;
var strPostReplace;
$(init);

function init() {
	if (Library._GET('test', 0) == 'sp' || Library._GET('test', 0) == 'all') {
		subject = StringProcessor;
		window.expect = Library.expect;
		testClearStack();
		testExtractVars();
		testReplaceVars();
		testSetPlaceholders();
	}
}
function testSetPlaceholders() {
	Phpjs.clearFunctionStack();
	var s = subject.setPlaceholders(strPostReplace);
	console.log(s);
}
function testReplaceVars() {
	var q = subject.replaceVars(line);
	//console.log(q);
	strPostReplace = q;
	expect(q, '"found " . $varname . " bu {template} " . $vary . " is " . $class->member . " but " . $array[10] . ""', 'replaceVars');
}
function testExtractVars() {
	var lat = 'abcdefghijklmnopqrstuvwxyz',
		varAllow = '$0123456789_' + lat + lat.toUpperCase();
	Phpjs.varAllow = varAllow;
			
	var s = '"found {$varname} bu {template} $vary is {$class->member} but {$array[10]}"';
	line = s;
	subject.extractVars(s);
	//console.log(subject.vars);
	expect(subject.vars.length, 4, 'extractVars');
	expect(subject.vars[0], '{$varname}', 'extractVars');
	expect(subject.vars[1], '$vary', 'extractVars');
	expect(subject.vars[2], '{$class->member}', 'extractVars');
	expect(subject.vars[3], '{$array[10]}', 'extractVars');
}
function testClearStack() {
	subject.vars.push(11);
	subject.clearStack();
	expect(subject.vars.length, 0, 'clearStack');
}
