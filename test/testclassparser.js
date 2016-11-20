var subject;
var line;
var strPostReplace;
/** @var  phpClassWithPlaceholders  - текст php класса в котором все строки и комментарии замененны на  плейсхолдеры */
var phpClassWithPlaceholders;
$(init);

function init() {
	if (Library._GET('test', 0) == 'cp' || Library._GET('test', 0) == 'all') {
		subject = ClassParser;
		window.expect = Library.expect;
		testParseClassField();
		testGrabFields();
		testGrabFunctions();
		testTranslateFunctions();
		testBuild();
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

	s = 'static\nprotected\n$arr = [0, 1, [0, [1,2,5], 2, "jghjhj"] ]';
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

function testGrabFunctions() {
	
	let s = `class CApplication extends CBaseApplication {
	private $statement = FULERHJGFSDhJ;
	public  $chakra;

	protected $innovation;
	
	public function __construct() {
		$this->title(S1, S2);
		parent::__construct();
	}
	
	protected function _route($url = REF) {
		$work_folder = WORK_FOLDER;
		switch ($url) {
			case $work_folder . SIMPLE:
				$this->layout = PATH;
				$this->handler = $h = $this->_load(SPH);
				return;
			case $work_folder . FLD:
				$this->layout = LAYOPUT;
				$this->handler = $h = $this->_load(TDFRER);
				return;
			case $work_folder . GOOD:
				$this->layout = KDE;
				$this->handler = $h = $this->_load(EXMPLI);
				return;
			case $work_folder . JEI:
			case $work_folder . EQI:
				$this->layout = LAYOUT;
				$this->handler = $h = $this->_load(NJSH);
				return;
			case $work_folder . NJSL:
			case $work_folder . FLDR:
				$this->layout = ABCD;
				$this->handler = $h = $this->_load(NoJSLoginHandler);
				return;
		}
		parent::_route($url);
	}

	sd
	protected function _loginActions() {
		$this->handler = $h = $this->_load(LoginHandler);
	}
	COMM2
	protected function _remindPasswordActions() {
		$this->handler = $h = $this->_load(LoginHandler);
	}
	
	COMM1
	protected function _404() {
		$this->handler = $h = $this->_load(Page404);
	}
	CISKO
	protected function _promoPageActions() {
		$this->handler = $h = $this->_load(MPH);
	}
	COMM
	protected function _load($class_name, $level = 10) {
		if ($this->role < $level) {
			utils_302(WEB_ROOT);
			return;
		}
		$file = APP_ROOT . CSES . $class_name . PHI;
		if (file_exists($file)) {
			include_once($file);
			return new $class_name($this);
		} else {
			throw new Exception(STR1 . $class_name . STR2);
		}
	}
	COMM
	protected function _req($v, string $varname = STR, array $array=[]) {
		$data = $_REQUEST;
		switch ($varname) {
			case PST:
			$data = $_POST;
				break;
			case GET:
				$data = $_GET;
				break;
		}
		if (isset($data[$v])) {
			return $data[$v];
		}
		return null;
	}
	COMM
	static public function getUid() {
		if ((int)sess(IOD)) {
			return (int)sess(GID);
		}
		if (USE_GUID_SESSION == true) {
			if ((int)sess(GHID)) {
				return (int)sess(GID);
			}
			if (trim(a($_COOKIE, GID))) {
				$guid = trim(a($_COOKIE, CN));
				$table = SRT;
				if (defined(SRT)) {
					$table = USERS_TABLE_CUSTOM_NAME;
				}
				$guid = dbvalue(STR);
				if ($guid) {
					sess(GUID, $guid);
				}
				return $guid;
			}
		}
		return 0;
	}
	CONNM
	protected function _loadAuthUserData() {
		if ($uid = (int)sess(KIO)) {
			$table = HGI;
			if (defined(ABCD)) {
				$table = USERS_TABLE_CUSTOM_NAME;
			}
			$data = dbrow(KIY, $nR);
			COMM
			if ($nR) {
				$this->user_email = $data[Y];
				$this->user_name = $data[YU];
				$this->user_surname = $data[Y];
				$this->role = $data[Y];
			}
		}
	}
	COMM
	protected function _ajaxHandler() {
		$action = $this->_req(B, C);
		$lang = $this->lang;
		switch ($action) {
			case A:
				$this->_generateGuid();
				break;
		}
	}
	COMM
	protected function _generateGuid() {
		if (USE_GUID_SESSION != true) {
			json_ok(STR, 0);
		}
		$datetime = now();
		$ip = $_SERVER[OPI];
		$table = USE;
		if (defined(KLI)) {
			$table = USERS_TABLE_CUSTOM_NAME;
		}
		$query = MMM;
		$uid = query($query);
		$query = MMM;
		$guid = dbvalue($query);
		json_ok(LLL, $guid);
	}
	
	static public function userIsAuth() {
		return (sess(UI) ? true: false);
	}
	
	public static function title($title = J, $base_title = C, $title_separator = V) {
		$s = '';
		if ($title) {
			$this->_title = $title;
		}
		if ($base_title) {
			$this->_base_title = $base_title;
		}
		if ($title_separator) {
			$this->_title_separator = $title_separator;
		}
		$s = $this->_title;
		if ($this->_base_title) {
			$s = $this->_base_title . ' ' . $this->_title_separator . $this->_title;
		}
		return $s;
	}

}`;
	phpClassWithPlaceholders = s;
	subject.grabClassDefine(s);
	o = subject.classInfo;
	expect(o.className, 'CApplication', 'grabClassDefine');
	var q = s.replace('class CApplication extends CBaseApplication {', '');
	q = q.replace(/\}$/g, '');
	expect(o.classBody, q, 'grabClassDefine');
	expect(o.extendsClassName, 'CBaseApplication', 'grabClassDefine');
	expect(o.interfaces.length, 0, 'grabClassDefine');
	
	subject.grabFunctions();
	expect(subject.cFunctions.length, 14, 'grabFunctions');
	expect(subject.cFunctions[13].name, 'title', 'grabFunctions');
	expect(subject.cFunctions[12].name, 'userIsAuth', 'grabFunctions');
	expect(subject.cFunctions[12].isStatic, true, 'grabFunctions');
	expect(subject.cFunctions[12].visible, 'public', 'grabFunctions');
	expect(subject.cFunctions[7].visible, 'protected', 'grabFunctions');
	expect(subject.cFunctions[7].name, '_req', 'grabFunctions');
	expect(subject.cFunctions[7].args.length, 3, 'grabFunctions');

	//console.log( subject.cFunctions[7].args );

	expect(subject.cFunctions[7].args[0].length, 1, 'grabFunctions');
	expect(subject.cFunctions[7].args[0][0], '$v', 'grabFunctions');
	expect(subject.cFunctions[7].args[1].length, 2, 'grabFunctions');
	expect(subject.cFunctions[7].args[1][0], '$varname', 'grabFunctions');
	expect(subject.cFunctions[7].args[1][1], 'STR', 'grabFunctions');
	expect(subject.cFunctions[7].args[2].length, 2, 'grabFunctions');
	expect(subject.cFunctions[7].args[2][0], '$array', 'grabFunctions');
	expect(subject.cFunctions[7].args[2][1], '[]', 'grabFunctions');


	expect(subject.cFunctions[6].args[1][1], 10, 'grabFunctions');
	expect(subject.cFunctions[6].args[1][0], '$level', 'grabFunctions');
	
	/*expect(o.varname, '$_class_name', 'parseClassField');
	expect(String(o.value), 'undefined', 'parseClassField');
	expect(o.placeholder, subject.pcp + (subject.pcpCounter - 1), 'parseClassField');*/
}
/**
 * 
*/
function testTranslateFunctions() {
	var s = phpClassWithPlaceholders;
	subject.grabClassDefine(s);
	o = subject.classInfo;
	subject.grabFunctions();
	subject.translateFunctions(Phpjs);
	//console.log(subject.cFunctions[1]);
	let et = `{
		var $work_folder, $this, $h;
		$work_folder = WORK_FOLDER;
		switch ($url) {
			case $work_folder + SIMPLE:
				this.layout = PATH;
				this.handler = $h = this._load(SPH);
				return;
			case $work_folder + FLD:
				this.layout = LAYOPUT;
				this.handler = $h = this._load(TDFRER);
				return;
			case $work_folder + GOOD:
				this.layout = KDE;
				this.handler = $h = this._load(EXMPLI);
				return;
			case $work_folder + JEI:
			case $work_folder + EQI:
				this.layout = LAYOUT;
				this.handler = $h = this._load(NJSH);
				return;
			case $work_folder + NJSL:
			case $work_folder + FLDR:
				this.layout = ABCD;
				this.handler = $h = this._load(NoJSLoginHandler);
				return;
		}
		parent._route($url);
	}`;
	//console.log(subject.cFunctions);
	expect(subject.cFunctions[1].body, et, 'testTranslateFunctions');
	//console.log(subject.cFunctions[9].body);
	//console.log(et);
}
function testBuild() {
	subject.init();
	var s = phpClassWithPlaceholders;
	subject.grabClassDefine(s);
	//o = subject.classInfo;

	subject.grabFunctions();

	//console.log( 'H = ' + subject.classInfo.classBody );

	subject.grabFields();

	//console.log(subject.cFields);


	//console.log( 'M = "' + subject.classInfo.classBody + '"');
	let q = `
	phpjs_f_placeholder_15
	phpjs_f_placeholder_14

	phpjs_f_placeholder_16
	
	phpjs_f_placeholder_0
	
	phpjs_f_placeholder_1

	sd
	phpjs_f_placeholder_2
	COMM2
	phpjs_f_placeholder_3
	
	COMM1
	phpjs_f_placeholder_4
	CISKO
	phpjs_f_placeholder_5
	COMM
	phpjs_f_placeholder_6
	COMM
	phpjs_f_placeholder_7
	COMM
	phpjs_f_placeholder_8
	CONNM
	phpjs_f_placeholder_9
	COMM
	phpjs_f_placeholder_10
	COMM
	phpjs_f_placeholder_11
	
	phpjs_f_placeholder_12
	
	public phpjs_f_placeholder_13

`;
	//console.log("|" + subject.classInfo.classBody + "|");
	//return;
	expect(subject.classInfo.classBody, q, 'testBuild');

	subject.translateFunctions(Phpjs);
	console.log(subject.cFunctions[9].body);
	s = subject.build();
	console.log(s);
}