var subject;
var line;
var strPostReplace;
$(init);

function init() {
	if (Library._GET('test', 0) == 'cp' || Library._GET('test', 0) == 'all') {
		subject = ClassParser;
		window.expect = Library.expect;
		testParseClassField();
		testGrabFields();
	}
}
//static public $less = "hello";private $p;\n\nstatic\nprivate\n$arr = [0, 1, [0, [1,2,5], 2, "jghjhj"] ]
//
function testParseClassField() {
	var s = 'static private $_class_name;';
	var o = subject.parseClassField(s);
	
	expect(o.isStatic, true, 'parseClassField');
	expect(o.success, true, 'parseClassField');
	expect(o.visible, 'private', 'parseClassField');
	expect(o.varname, '$_class_name', 'parseClassField');
	expect(String(o.value), 'undefined', 'parseClassField');
	expect(o.placeholder, subject.pcp + (subject.pcpCounter - 1), 'parseClassField');

	s = 'static public $less = "hello";';
	o = subject.parseClassField(s);
	expect(o.success, true, 'parseClassField');
	expect(o.isStatic, true, 'parseClassField');
	expect(o.visible, 'public', 'parseClassField');
	expect(o.varname, '$less', 'parseClassField');
	expect(o.value, '"hello"', 'parseClassField');
	expect(o.raw, s, 'parseClassField');
	expect(o.placeholder, subject.pcp + (subject.pcpCounter - 1), 'parseClassField');


	s = 'public static $less = "hello";';
	o = subject.parseClassField(s);
	expect(o.success, true, 'parseClassField');
	expect(o.isStatic, true, 'parseClassField');
	expect(o.visible, 'public', 'parseClassField');
	expect(o.varname, '$less', 'parseClassField');
	expect(o.value, '"hello"', 'parseClassField');
	expect(o.raw, s, 'parseClassField');
	expect(o.placeholder, subject.pcp + (subject.pcpCounter - 1), 'parseClassField');

	s = '\n\nstatic\nprotected\n$arr = [0, 1, [0, [1,2,5], 2, "jghjhj"] ]';
	o = subject.parseClassField(s);
	expect(o.success, true, 'parseClassField');
	expect(o.isStatic, true, 'parseClassField');
	expect(o.visible, 'protected', 'parseClassField');
	expect(o.varname, '$arr', 'parseClassField');
	expect(o.value, '[0, 1, [0, [1,2,5], 2, "jghjhj"] ]', 'parseClassField');
	expect(o.raw, s, 'parseClassField');
	expect(o.placeholder, subject.pcp + (subject.pcpCounter - 1), 'parseClassField');

	s = 'private $p;';
	o = subject.parseClassField(s);
	expect(o.success, true, 'parseClassField');
	expect(String(o.isStatic), 'undefined', 'parseClassField');
	expect(o.visible, 'private', 'parseClassField');
	expect(o.varname, '$p', 'parseClassField');
	expect(String(o.value), 'undefined', 'parseClassField');
	expect(o.raw, s, 'parseClassField');
	expect(o.placeholder, subject.pcp + (subject.pcpCounter - 1), 'parseClassField');

	s = 'private K';
	o = subject.parseClassField(s);

	expect(String(o.success), 'undefined', 'parseClassField');

}

function testGrabFields() {
	subject.classInfo = {};
	subject.classInfo.classBody = 'static public $less = "hello";private $p;\n\nstatic\nprivate\n$arr = [0, 1, [0, [1,2,5], 2, "jghjhj"] ];';
	subject.grabFields();

	for (var i = 0; i <  subject.cFields.length; i++) {
		var p = subject.cFields[i],
			s = $.trim(p.raw);
		expect( (s.indexOf(';') == s.length - 1), true, 'grabFields');
		expect( p.success, true, 'grabFields');
	}
	expect( subject.cFields.length, 3, 'grabFields');
}