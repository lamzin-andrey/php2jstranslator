/** @const LONG_ARRAY_SIZE */
TestArraySlice.LONG_ARRAY_SIZE = 100;
//php 7.2.24

'/console.php';
function TestArraySlice() {




		var $i;

		this._longArray = [];
		for ($i = 0; $i < TestArraySlice.LONG_ARRAY_SIZE; $i++) {
			this._longArray.push($i);
		}
	
}

	
	
	
	
	//Тут все варианты для положительного offset и длины тоже положительной

	TestArraySlice.prototype.testPositiveOffsetAndPositiveLength = function() {
    
    var $eArr, $aR, $name;
    
    $eArr = [];
    //от начала массива

    $aR = array_slice(this._longArray, 0, 3);
    if (!this._eqArray($aR, [0, 1, 2])) {
        this._errMsg('Error on от начала массива ');
        exit();
        } else {
        this._info();
    }
    
    //часть массива

    $aR = array_slice(this._longArray, 2, 2);
    if (!this._eqArray($aR, [2, 3])) {
        var_dump($aR);
        this._errMsg('Error on часть массива');
        exit();
        } else {
        this._info();
    }
    
    //часть массива нулевой длины

    $aR = array_slice(this._longArray, 2, 0);
    
    if (!this._eqArray($aR, $eArr)) {
        var_dump($aR);
        this._errMsg('Error on часть массива нулевой длины');
        exit();
        } else {
        this._info();
    }
    
    //часть массива с длиной больше чем массив

    $name = 'часть массива с длиной больше чем массив';
    $aR = array_slice(this._longArray, TestArraySlice.LONG_ARRAY_SIZE - 3, TestArraySlice.LONG_ARRAY_SIZE + 3);
    if (!this._eqArray($aR, [97, 98, 99])) {
        var_dump($aR);
        this._errMsg('Error on line ' + $name );
        exit();
        } else {
        this._info();
    }
}

	//Тут все варианты для положительного offset и отрицательной длины 

	TestArraySlice.prototype.testPositiveOffsetAndNegativeLength = function() {
    
    var $aR, $eAr, $name;
    
    //отрицательная длина

    $aR = array_slice(this._longArray, 0, -1 * (TestArraySlice.LONG_ARRAY_SIZE - 2 ));
    if (!this._eqArray($aR, [0, 1])) {
        this._errMsg('Error on line отрицательная длина');
			var d = -1 * (TestArraySlice.LONG_ARRAY_SIZE - 2 );
			console.log('d', d);
			var_dump($aR);
			exit();
        } else {
        this._info();
    }
    
    $eAr = [];
    
    $name = 'пересечение начала и конца';
    $aR = array_slice(this._longArray, 10, -1 * (TestArraySlice.LONG_ARRAY_SIZE - 2 ) );
    if (!this._eqArray($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info();
    }
    
    $name = 'offset больше длины массива';
    $aR = array_slice(this._longArray, TestArraySlice.LONG_ARRAY_SIZE, -1 * (TestArraySlice.LONG_ARRAY_SIZE - 2 ) );
    if (!this._eqArray($aR, $eAr)) {
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
}

	
	//Тут все варианты для отрицательного offset и отрицательной длины 

	TestArraySlice.prototype.testNegativeOffsetAndNegativeLength = function() {
    
    var $name, $aR, $eAr;
    
    $name = 'для отрицательного offset и отрицательной длины ';
    $aR = array_slice(this._longArray, -2, -5);
    $eAr = [];
    if (!this._eqArray($aR, $eAr)) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'для отрицательного offset и отрицательной длины 2';
    $aR = array_slice(this._longArray, -99, -97);
    if (!this._eqArray($aR, [1, 2])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'для отрицательного offset и отрицательной длины 3';
    $aR = array_slice(this._longArray, -60, -50);
    if (!this._eqArray($aR, [40, 41, 42, 43, 44, 45, 46, 47, 48, 49])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
}

	//Тут все варианты для отрицательного offset и положительной длины 

	TestArraySlice.prototype.testNegativeOffsetAndPositiveLength = function() {
    
    var $name, $aR;
    
    $name = 'для отрицательного offset и положительной длины 1';
    $aR = array_slice(this._longArray, -10, 3, false, true);
    if (!this._eqArray($aR, [90, 91, 92])) {
        this._errMsg('Error on line ' + $name);
        var_dump($aR);
        exit();
        } else {
        this._info(' . ' + $name);
    }
    
    $name = 'для отрицательного offset и положительной длины большей чем размер массива';
    $aR = array_slice(this._longArray, -2, TestArraySlice.LONG_ARRAY_SIZE);
    if (!this._eqArray($aR, [98, 99])) {
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
	TestArraySlice.prototype._eqArray = function($arr1, $arr2) {
    
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
	 * Это позже, пока сосредоточусь на массивах (js Array)
	 * @return bool
	*/
	TestArraySlice.prototype._eqAssocArray = function($arr1, $arr2) {
    
    $arr1 = __php2js_clone_argument__($arr1);
    $arr2 = __php2js_clone_argument__($arr2);
    
    //TODO

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

