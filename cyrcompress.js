/** @depend php.js */
var $aPairs = JSON.parse('{"0":"\u0430","1":"\u0431","2":"\u0432","3":"\u0433","4":"\u0434","5":"\u0435","6":"\u0451","7":"\u0436","8":"\u0437","9":"\u0438","a":"\u0439","b":"\u043a","c":"\u043b","d":"\u043c","e":"\u043d","f":"\u043e","g":"\u043f","h":"\u0440","i":"\u0441","j":"\u0442","k":"\u0443","l":"\u0444","m":"\u0445","n":"\u0446","o":"\u0447","p":"\u0448","q":"\u0449","r":"\u044a","s":"\u044b","t":"\u044c","u":"\u044d","v":"\u044e","w":"\u044f"}')
function _decode(s) {
	var i, ch, r = '', sz = s.length;
	for (i = 0; i < sz; i++) {
		ch = s.charAt(i);
		if (strpos('0123456789abcdefghijklmnopqrstuvwxyz', ch) !== false) {
			if (ch == 'x') {
				r += s.charAt(i + 1);
				i++;
				continue;
			}
			if (ch == 'y') {
				ch = s.charAt(i + 1);
				if ($aPairs[ch]) {
					r += $aPairs[ch].toUpperCase();
				}
				i++;
				continue;
			}
			if ($aPairs[ch]) {
				r += $aPairs[ch];
			}
		} else {
			r += ch;
		}
	}
	return r;
}
/**
 * Если символ не найден в $aPairs и это десятичная цифра или латинский символ, возвращает xN где N - число
 * Если символ не найден в $aPairs но его нижний регистр найден, возвращает yN где N - код в aPairs
 * Если символ не найден в $aPairs возвращает его в utf8
*/
function _encode($s){
	var $sz, $r, $i, $ch, $lch, $buf, $n, $v;
	$buf = [];
	for ($n in $aPairs) { $v = $aPairs[$n];
		$buf[$v] = $n;
	}
	
	$sz = $s.length;
	$r = '';
	for ($i = 0; $i < $sz; $i++) {
		$ch = mb_substr($s, $i, 1, 'UTF-8');
		if (isset($buf, $ch)) {
			$r += $buf[$ch];
		} else {
			if (strpos('0123456789abcdefghijklmnopqrstuvwxyz', $ch) !== false) {
				$r += 'x' + $ch;
			} else {
				$lch = mb_strtolower($ch, 'UTF-8');
				if (isset($buf, $lch)) {
					$r += 'y' + $buf[$lch];
				} else {
					$r += $ch;
				}
			}
		}
	}
	return $r;
}
