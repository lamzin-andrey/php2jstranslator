/** @const LONG_ARRAY_SIZE */
TestArraySlice.LONG_ARRAY_SIZE = 100;
/** @property ASSOC_NUMS_ARRAY_SIZE */
TestArraySlice.ASSOC_NUMS_ARRAY_SIZE = 6;

function TestArraySlice() {

		var $i;

		this._longArray = [];
		for ($i = 0; $i < TestArraySlice.LONG_ARRAY_SIZE; $i++) {
			this._longArray.push($i);
		}
		
		//Массив для тестирования bPreversekeys = true

		this._assocNums = {
			'five' : 15,
			'ten' : 110,
			'seven' : 17,
			'fourteen' : 114,
			'hft' : 142,
			'hsz' : 160
		};
		console.log(this._assocNums);
		//Для php нет разницы между этим и предыдушим объявлением, но после трансляции в js разница будет

		/*this._assocNums = [];
		this._assocNums[5] = 15;
		this._assocNums[10] = 110;
		this._assocNums[7] = 17;
		this._assocNums[14] = 114;
		this._assocNums[42] = 142;
		this._assocNums[60] = 160;/**/
	
}

	
	
	
	
	
	
	//Тут все варианты для положительного offset и длины тоже положительной

	TestArraySlice.prototype.testPositiveOffsetAndPositiveLength = function() {
    
    var $eArr, $aR, $name, $aCtrl;
    
    $eArr = [];
    //от начала массива

    $aR = array_slice(this._longArray, 0, 3);
    if (!this._eqSets($aR, [0, 1, 2])) {
        this._errMsg('Error on от начала массива ');
        exit();
        } else {
        this._info();
    }
    
    //часть массива

    $aR = array_slice(this._longArray, 2, 2);
    if (!this._eqSets($aR, [2, 3])) {
        var_dump($aR);
        this._errMsg('Error on часть массива');
        exit();
        } else {
        this._info();
    }
    
    //часть массива нулевой длины

    $aR = array_slice(this._longArray, 2, 0);
    
    if (!this._eqSets($aR, $eArr)) {
        var_dump($aR);
        this._errMsg('Error on часть массива нулевой длины');
        exit();
        } else {
        this._info();
    }
    
    //часть массива с длиной больше чем массив

    $name = 'часть массива с длиной больше чем массив';
    $aR = array_slice(this._longArray, TestArraySlice.LONG_ARRAY_SIZE - 3, TestArraySlice.LONG_ARRAY_SIZE + 3);
    if (!this._eqSets($aR, [97, 98, 99])) {
        var_dump($aR);
        this._errMsg('Error on line ' + $name );
        exit();
        } else {
        this._info();
    }
    
    //ассоциативный массив с числами и preverseKey = true

    $eArr = [];
    //от начала массива bPreversekeys = false

    $name = 'ассоциативный от начала массива bPreversekeys = false';
    $aR = array_slice(this._assocNums, 0, 3);
    if (!this._eqAssocSets($aR, [15, 110, 17])) {
        var_dump($aR);
        this._errMsg('Error on ' + $name);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //от начала массива bPreversekeys = true

    $name = 'ассоциативный от начала массива bPreversekeys = true';
    $aR = array_slice(this._assocNums, 0, 3, true);
    $aCtrl = {
        5 : 15,
        10 : 110,
        7 : 17
        };
    if (!this._eqAssocSets($aR, $aCtrl)) {
        var_dump($aR);
        this._errMsg('Error on ' + $name);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //часть массива bPreversekeys = false

    $name = 'часть массива bPreversekeys = false';
    $aR = array_slice(this._assocNums, 2, 2);
    if (!this._eqAssocSets($aR, [17, 114])) {
        var_dump($aR);
        this._errMsg('Error on ' + $name);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //часть массива bPreversekeys = true

    $name = 'часть массива bPreversekeys = true';
    $aR = array_slice(this._assocNums, 2, 2, true);
    $aCtrl = {
        7 : 17,
        14 : 114
        };
    if (!this._eqAssocSets($aR, $aCtrl)) {
        var_dump($aR);
        this._errMsg('Error on ' + $name);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //часть массива нулевой длины bPreversekeys = false

    $name = 'часть массива нулевой длины bPreversekeys = false';
    $aR = array_slice(this._assocNums, 2, 0);
    
    if (!this._eqAssocSets($aR, $eArr)) {
        var_dump($aR);
        this._errMsg('Error on ' + $name);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //часть массива нулевой длины bPreversekeys = true

    $name = 'часть массива нулевой длины bPreversekeys = true';
    $aR = array_slice(this._assocNums, 2, 0, true);
    
    if (!this._eqAssocSets($aR, $eArr)) {
        var_dump($aR);
        this._errMsg('Error on ' + $name);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //часть массива с длиной больше чем массив bPreversekeys = false

    $name = 'часть массива с длиной больше чем массив bPreversekeys = false';
    $aR = array_slice(this._assocNums, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE - 3, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE + 3);
    if (!this._eqAssocSets($aR, [114, 142, 160])) {
        var_dump($aR);
        this._errMsg('Error on line ' + $name );
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //часть массива с длиной больше чем массив bPreversekeys = true

    $name = 'часть массива с длиной больше чем массив bPreversekeys = true';
    $aR = array_slice(this._assocNums, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE - 3, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE + 3, true);
    $aCtrl = {
        14 : 114,
        42 : 142,
        60 : 160
        };
    if (!this._eqAssocSets($aR, $aCtrl)) {
        var_dump($aR);
        this._errMsg('Error on line ' + $name );
        exit();
        } else {
        this._info(' . ' + $name);
    }
}


	//Тут все варианты для положительного offset и отрицательной длины 

	TestArraySlice.prototype.testPositiveOffsetAndNegativeLength = function() {
    
    var $name, $aR, $eAr, $aCtrl;
    
    //отрицательная длина

    $name = 'отрицательная длина';
    $aR = array_slice(this._longArray, 0, -1 * (TestArraySlice.LONG_ARRAY_SIZE - 2 ) );
    if (!this._eqSets($aR, [0, 1])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $eAr = [];
    
    $name = 'пересечение начала и конца';
    $aR = array_slice(this._longArray, 10, -1 * (TestArraySlice.LONG_ARRAY_SIZE - 2 ) );
    if (!this._eqSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'offset больше длины массива';
    $aR = array_slice(this._longArray, TestArraySlice.LONG_ARRAY_SIZE, -1 * (TestArraySlice.LONG_ARRAY_SIZE - 2 ) );
    if (!this._eqSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'length не задан';
    $aR = array_slice(this._longArray, Math.floor(TestArraySlice.LONG_ARRAY_SIZE / 2));
    if (count($aR) != 50) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //ассоциативный с цифрами

    
    //отрицательная длина bPreversekeys = false

    $name = 'отрицательная длина bPreversekeys = false';
    $aR = array_slice(this._assocNums, 0, -1 * (TestArraySlice.ASSOC_NUMS_ARRAY_SIZE - 2 ) );
    if (!this._eqAssocSets($aR, [15, 110])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //отрицательная длина bPreversekeys = true

    $name = 'отрицательная длина bPreversekeys = true';
    $aR = array_slice(this._assocNums, 0, -1 * (TestArraySlice.ASSOC_NUMS_ARRAY_SIZE - 2 ), true);
    $aCtrl = {
        5 : 15,
        10 : 110
        };
    if (!this._eqAssocSets($aR, $aCtrl)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //пересечение начала и конца bPreversekeys = false

    $name = 'пересечение начала и конца bPreversekeys = false';
    $aR = array_slice(this._assocNums, 4, -5);
    if (!this._eqAssocSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    //пересечение начала и конца bPreversekeys = true

    $name = 'пересечение начала и конца bPreversekeys = true';
    $aR = array_slice(this._assocNums, 4, -5, true);
    if (!this._eqAssocSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //offset больше длины массива bPreversekeys = false

    $name = 'offset больше длины массива bPreversekeys = false';
    $aR = array_slice(this._assocNums, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE, -1 * (TestArraySlice.ASSOC_NUMS_ARRAY_SIZE - 2 ) );
    if (!this._eqAssocSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //offset больше длины массива bPreversekeys = true

    $name = 'offset больше длины массива bPreversekeys = true';
    $aR = array_slice(this._assocNums, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE, -1 * (TestArraySlice.ASSOC_NUMS_ARRAY_SIZE - 2 ), true);
    if (!this._eqAssocSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //length не задан bPreversekeys = false

    $name = 'length не задан bPreversekeys = false';
    $aR = array_slice(this._assocNums, Math.floor(TestArraySlice.ASSOC_NUMS_ARRAY_SIZE / 2));
    if (count($aR) != 3) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //length не задан bPreversekeys = true

    $name = 'length не задан bPreversekeys = true';
    $aR = array_slice(this._assocNums, Math.floor(TestArraySlice.ASSOC_NUMS_ARRAY_SIZE / 2), null, true);
    if (count($aR) != 3) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
}

	
	//Тут все варианты для отрицательного offset и отрицательной длины 

	TestArraySlice.prototype.testNegativeOffsetAndNegativeLength = function() {
    
    var $name, $aR, $eAr, $aCtrl;
    
    $name = 'для отрицательного offset и отрицательной длины ';
    $aR = array_slice(this._longArray, -2, -5);
    $eAr = [];
    if (!this._eqSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'для отрицательного offset и отрицательной длины 2';
    $aR = array_slice(this._longArray, -99, -97);
    if (!this._eqSets($aR, [1, 2])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'для отрицательного offset и отрицательной длины 3';
    $aR = array_slice(this._longArray, -60, -50);
    if (!this._eqSets($aR, [40, 41, 42, 43, 44, 45, 46, 47, 48, 49])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //ассоциативный массив с цифрами

    
    //для отрицательного offset и отрицательной длины bPreversekeys = false

    $name = 'для отрицательного offset и отрицательной длины bPreversekeys = false';
    $aR = array_slice(this._assocNums, -2, -5);
    $eAr = [];
    if (!this._eqAssocSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //для отрицательного offset и отрицательной длины bPreversekeys = true

    $name = 'для отрицательного offset и отрицательной длины bPreversekeys = true';
    $aR = array_slice(this._assocNums, -2, -5, true);
    $eAr = [];
    if (!this._eqAssocSets($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //для отрицательного offset и отрицательной длины 2 bPreversekeys = false

    $name = 'для отрицательного offset и отрицательной длины 2 bPreversekeys = false';
    $aR = array_slice(this._assocNums, -5, -2);
    if (!this._eqAssocSets($aR, [110, 17, 114])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //для отрицательного offset и отрицательной длины 2 bPreversekeys = true

    $name = 'для отрицательного offset и отрицательной длины 2 bPreversekeys = true';
    $aR = array_slice(this._assocNums, -5, -2, true);
    $aCtrl = {
        10 : 110,
        7 : 17,
        14 : 114
        };
    if (!this._eqAssocSets($aR, $aCtrl)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //для отрицательного offset и отрицательной длины 3

    //так как по сути то же самое, что и "для отрицательного offset и отрицательной длины 2" пропущен

}

	//Тут все варианты для отрицательного offset и положительной длины 

	TestArraySlice.prototype.testNegativeOffsetAndPositiveLength = function() {
    
    var $name, $aR, $aCtrl;
    
    $name = 'для отрицательного offset и положительной длины 1';
    $aR = array_slice(this._longArray, -10, 3);
    if (!this._eqSets($aR, [90, 91, 92])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'для отрицательного offset и положительной длины большей чем размер массива';
    $aR = array_slice(this._longArray, -2, TestArraySlice.LONG_ARRAY_SIZE);
    if (!this._eqSets($aR, [98, 99])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //ассоциативный массив с цифрами

    
    //для отрицательного offset и положительной длины 1 bPreversekeys = false

    $name = 'для отрицательного offset и положительной длины 1 bPreversekeys = false';
    $aR = array_slice(this._assocNums, -4, 3);
    if (!this._eqAssocSets($aR, [17, 114, 142])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //для отрицательного offset и положительной длины 1 bPreversekeys = true

    $name = 'для отрицательного offset и положительной длины 1 bPreversekeys = true';
    $aR = array_slice(this._assocNums, -4, 3, true);
    $aCtrl = {
        7 : 17,
        14 : 114,
        42 : 142,
        };
    if (!this._eqAssocSets($aR, $aCtrl)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //для отрицательного offset и положительной длины большей чем размер массива bPreversekeys = false

    $name = 'для отрицательного offset и положительной длины большей чем размер массива bPreversekeys = false';
    $aR = array_slice(this._assocNums, -2, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE);
    if (!this._eqAssocSets($aR, [142, 160])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    //для отрицательного offset и положительной длины большей чем размер массива bPreversekeys = true

    $name = 'для отрицательного offset и положительной длины большей чем размер массива bPreversekeys = true';
    $aR = array_slice(this._assocNums, -2, TestArraySlice.ASSOC_NUMS_ARRAY_SIZE, true);
    $aCtrl = {
        42 : 142,
        60 : 160
        };
    if (!this._eqAssocSets($aR, $aCtrl)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
}

	/**
	 * @return bool
	*/
	TestArraySlice.prototype._eqSets = function($arr1, $arr2) {
    
    var $nArr1Sz, $nArr2Sz, $i;
    
    $arr1 = __php2js_clone_argument__($arr1);
    $arr2 = __php2js_clone_argument__($arr2);
    
    $nArr1Sz = count($arr1);
    $nArr2Sz = count($arr2);
    
    if ($nArr1Sz != $nArr2Sz) {
        return false;
    }
    
    for ($i = 0; $i < $nArr1Sz; $i++) {
        if ($arr1[$i] != $arr2[$i]) {
            return false;
        }
    }
    return true;
}

	/**
	 * Проверка равенства ассоциативного массива
	 * @return bool
	*/
	TestArraySlice.prototype._eqAssocSets = function($arr1, $arr2) {
    
    var $nArr1Sz, $nArr2Sz, $i, $v;
    
    $arr1 = __php2js_clone_argument__($arr1);
    $arr2 = __php2js_clone_argument__($arr2);
    
    $nArr1Sz = count($arr1);
    $nArr2Sz = count($arr2);
    
    if ($nArr1Sz != $nArr2Sz) {
        return false;
    }
    
    for ($i in $arr1) { $v = $arr1[$i];
        if (!isset($arr2, $i)) {
            return false;
        }
        if ($arr1[$i] != $arr2[$i]) {
            return false;
        }
    }
    return true;
}

	
	TestArraySlice.prototype._errMsg = function($s) {
    
    $s = __php2js_clone_argument__($s);
    
    console.error($s);
}

	
	TestArraySlice.prototype._info = function($s) {
    $s = String($s) == 'undefined' ? '.' : $s;
    $s = __php2js_clone_argument__($s);
    
    console.log($s);
}

