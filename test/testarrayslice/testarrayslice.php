<?php
//php 7.2.24
require_once __DIR__ . '/console.php';

class TestArraySlice {
	
	const LONG_ARRAY_SIZE = 100;
	
	const ASSOC_NUMS_ARRAY_SIZE = 6;
	
	public function __construct()
	{
		$this->_longArray = [];
		for ($i = 0; $i < self::LONG_ARRAY_SIZE; $i++) {
			$this->_longArray[] = $i;
		}
		
		//Массив для тестирования bPreversekeys = true
		$this->_assocNums = [
			'five' => 15,
			'ten' => 110,
			'seven' => 17,
			'fourteen' => 114,
			'fortytwo' => 142,
			'sixty' => 160
		];
		
		//Для php нет разницы между этим и предыдушим объявлением, но после трансляции в js разница будет
		$this->_assocNums = [];//{}
		$this->_assocNums['five'] = 15;
		$this->_assocNums['ten'] = 110;
		$this->_assocNums['seven'] = 17;
		$this->_assocNums['fourteen'] = 114;
		$this->_assocNums['fortytwo'] = 142;
		$this->_assocNums['sixty'] = 160;
		
		//var_dump($this->_assocNums);die;
	}
	//Тут все варианты для положительного offset и длины тоже положительной
	public function testPositiveOffsetAndPositiveLength()
	{
		$eArr = [];
		//от начала массива
		$aR = array_slice($this->_longArray, 0, 3);
		if (!$this->_eqSets($aR, [0, 1, 2])) {
			$this->_errMsg('Error on от начала массива ');
			exit();
		} else {
			$this->_info();
		}
		
		//часть массива
		$aR = array_slice($this->_longArray, 2, 2);
		if (!$this->_eqSets($aR, [2, 3])) {
			var_dump($aR);
			$this->_errMsg('Error on часть массива');
			exit();
		} else {
			$this->_info();
		}
		
		//часть массива нулевой длины
		$aR = array_slice($this->_longArray, 2, 0);
		
		if (!$this->_eqSets($aR, $eArr)) {
			var_dump($aR);
			$this->_errMsg('Error on часть массива нулевой длины');
			exit();
		} else {
			$this->_info();
		}
		
		//часть массива с длиной больше чем массив
		$name = 'часть массива с длиной больше чем массив';
		$aR = array_slice($this->_longArray, self::LONG_ARRAY_SIZE - 3, self::LONG_ARRAY_SIZE + 3);
		if (!$this->_eqSets($aR, [97, 98, 99])) {
			var_dump($aR);
			$this->_errMsg('Error on line ' . $name );
			exit();
		} else {
			$this->_info();
		}
		
		//от начала массива 
		$name = 'ассоциативный от начала массива';
		$aR = array_slice($this->_assocNums, 0, 3);
		$aCtrl = [
			'five' => 15,
			'ten' => 110,
			'seven' => 17
		];
		if (!$this->_eqAssocSets($aR, $aCtrl)) {
			var_dump($aR);
			$this->_errMsg('Error on ' . $name);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//часть массива
		$name = 'часть массива';
		$aR = array_slice($this->_assocNums, 2, 2);
		$aCtrl = [
			'seven' => 17,
			'fourteen' => 114
		];
		if (!$this->_eqAssocSets($aR, $aCtrl)) {
			var_dump($aR);
			$this->_errMsg('Error on ' . $name);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//часть массива нулевой длины bPreversekeys = false
		$name = 'часть массива нулевой длины bPreversekeys = false';
		$aR = array_slice($this->_assocNums, 2, 0);
		
		if (!$this->_eqAssocSets($aR, $eArr)) {
			var_dump($aR);
			$this->_errMsg('Error on ' . $name);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//часть массива нулевой длины bPreversekeys = true
		$name = 'часть массива нулевой длины bPreversekeys = true';
		$aR = array_slice($this->_assocNums, 2, 0, true);
		
		if (!$this->_eqAssocSets($aR, $eArr)) {
			var_dump($aR);
			$this->_errMsg('Error on ' . $name);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//часть массива с длиной больше чем массив
		$name = 'часть массива с длиной больше чем массив';
		$aR = array_slice($this->_assocNums, self::ASSOC_NUMS_ARRAY_SIZE - 3, self::ASSOC_NUMS_ARRAY_SIZE + 3);
		$aCtrl = [
			'fourteen' => 114,
			'fortytwo' => 142,
			'sixty' => 160
		];
		if (!$this->_eqAssocSets($aR, $aCtrl)) {
			var_dump($aR);
			$this->_errMsg('Error on line ' . $name );
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
	}

	//Тут все варианты для положительного offset и отрицательной длины 
	public function testPositiveOffsetAndNegativeLength()
	{
		//отрицательная длина
		$name = 'отрицательная длина';
		$aR = array_slice($this->_longArray, 0, -1 * (self::LONG_ARRAY_SIZE - 2 ) );
		if (!$this->_eqSets($aR, [0, 1])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$eAr = [];
		
		$name = 'пересечение начала и конца';
		$aR = array_slice($this->_longArray, 10, -1 * (self::LONG_ARRAY_SIZE - 2 ) );
		if (!$this->_eqSets($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'offset больше длины массива';
		$aR = array_slice($this->_longArray, self::LONG_ARRAY_SIZE, -1 * (self::LONG_ARRAY_SIZE - 2 ) );
		if (!$this->_eqSets($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'length не задан';
		$aR = array_slice($this->_longArray, floor(self::LONG_ARRAY_SIZE / 2));
		if (count($aR) != 50) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//ассоциативный 
		
		
		//отрицательная длина
		$name = 'отрицательная длина';
		$aR = array_slice($this->_assocNums, 0, -1 * (self::ASSOC_NUMS_ARRAY_SIZE - 2 ));
		$aCtrl = [
			'five' => 15,
			'ten' => 110
		];
		if (!$this->_eqAssocSets($aR, $aCtrl)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//пересечение начала и конца
		$name = 'пересечение начала и конца';
		$aR = array_slice($this->_assocNums, 4, -5);
		if (!$this->_eqAssocSets($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		
		//offset больше длины массива
		$name = 'offset больше длины массива';
		$aR = array_slice($this->_assocNums, self::ASSOC_NUMS_ARRAY_SIZE, -1 * (self::ASSOC_NUMS_ARRAY_SIZE - 2 ) );
		if (!$this->_eqAssocSets($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//length не задан
		$name = 'length не задан';
		$aR = array_slice($this->_assocNums, floor(self::ASSOC_NUMS_ARRAY_SIZE / 2), null);
		if (count($aR) != 3) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
	}
	
	//Тут все варианты для отрицательного offset и отрицательной длины 
	public function testNegativeOffsetAndNegativeLength()
	{
		$name = 'для отрицательного offset и отрицательной длины ';
		$aR = array_slice($this->_longArray, -2, -5);
		$eAr = [];
		if (!$this->_eqSets($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'для отрицательного offset и отрицательной длины 2';
		$aR = array_slice($this->_longArray, -99, -97);
		if (!$this->_eqSets($aR, [1, 2])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'для отрицательного offset и отрицательной длины 3';
		$aR = array_slice($this->_longArray, -60, -50);
		if (!$this->_eqSets($aR, [40, 41, 42, 43, 44, 45, 46, 47, 48, 49])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//ассоциативный массив
			
		//для отрицательного offset и отрицательной длины
		$name = 'для отрицательного offset и отрицательной длины';
		$aR = array_slice($this->_assocNums, -2, -5);
		$eAr = [];
		if (!$this->_eqAssocSets($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//для отрицательного offset и отрицательной длины 2
		$name = 'для отрицательного offset и отрицательной длины 2';
		$aR = array_slice($this->_assocNums, -5, -2);
		$aCtrl = [
			'ten' => 110,
			'seven' => 17,
			'fourteen' => 114
		];
		if (!$this->_eqAssocSets($aR, $aCtrl)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//для отрицательного offset и отрицательной длины 3
		//так как по сути то же самое, что и "для отрицательного offset и отрицательной длины 2" пропущен
	}
	//Тут все варианты для отрицательного offset и положительной длины 
	public function testNegativeOffsetAndPositiveLength()
	{
		$name = 'для отрицательного offset и положительной длины 1';
		$aR = array_slice($this->_longArray, -10, 3);
		if (!$this->_eqSets($aR, [90, 91, 92])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'для отрицательного offset и положительной длины большей чем размер массива';
		$aR = array_slice($this->_longArray, -2, self::LONG_ARRAY_SIZE);
		if (!$this->_eqSets($aR, [98, 99])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//ассоциативный массив
		
		//для отрицательного offset и положительной длины 1
		$name = 'для отрицательного offset и положительной длины 1';
		$aR = array_slice($this->_assocNums, -4, 3);
		$aCtrl = [
			'seven' => 17,
			'fourteen' => 114,
			'fortytwo' => 142,
		];
		if (!$this->_eqAssocSets($aR, $aCtrl)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		//для отрицательного offset и положительной длины большей чем размер массива
		$name = 'для отрицательного offset и положительной длины большей чем размер массива';
		$aR = array_slice($this->_assocNums, -2, self::ASSOC_NUMS_ARRAY_SIZE);
		$aCtrl = [
			'fortytwo' => 142,
			'sixty' => 160
		];
		if (!$this->_eqAssocSets($aR, $aCtrl)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
	}
	/**
	 * @return bool
	*/
	private function _eqSets($arr1, $arr2)
	{
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
	private function _eqAssocSets($arr1, $arr2)
	{
		$nArr1Sz = count($arr1);
		$nArr2Sz = count($arr2);
		
		if ($nArr1Sz != $nArr2Sz) {
			return false;
		}
		
		foreach ($arr1 as $i => $v) {
			if ($i == '__php2js_push__') {
				continue;
			}
			if (!isset($arr2[$i])) {
				return false;
			}
			if ($arr1[$i] != $arr2[$i]) {
				return false;
			}
		}
		return true;
	}
	
	private function _errMsg($s)
	{
		console::error($s);
	}
	
	private function _info($s = '.')
	{
		console::log($s);
	}
}
