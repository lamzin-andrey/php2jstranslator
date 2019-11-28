<?php
//php 7.2.24
require_once __DIR__ . '/console.php';

class TestArraySlice {
	
	const LONG_ARRAY_SIZE = 100;
	
	public function __construct()
	{
		$this->_longArray = [];
		for ($i = 0; $i < static::LONG_ARRAY_SIZE; $i++) {
			$this->_longArray[] = $i;
		}
	}
	//Тут все варианты для положительного offset и длины тоже положительной
	public function testPositiveOffsetAndPositiveLength()
	{
		$eArr = [];
		//от начала массива
		$aR = array_slice($this->_longArray, 0, 3);
		if (!$this->_eqArray($aR, [0, 1, 2])) {
			$this->_errMsg('Error on от начала массива ');
			exit();
		} else {
			$this->_info();
		}
		
		//часть массива
		$aR = array_slice($this->_longArray, 2, 2);
		if (!$this->_eqArray($aR, [2, 3])) {
			var_dump($aR);
			$this->_errMsg('Error on часть массива');
			exit();
		} else {
			$this->_info();
		}
		
		//часть массива нулевой длины
		$aR = array_slice($this->_longArray, 2, 0);
		
		if (!$this->_eqArray($aR, $eArr)) {
			var_dump($aR);
			$this->_errMsg('Error on часть массива нулевой длины');
			exit();
		} else {
			$this->_info();
		}
		
		//часть массива с длиной больше чем массив
		$name = 'часть массива с длиной больше чем массив';
		$aR = array_slice($this->_longArray, static::LONG_ARRAY_SIZE - 3, static::LONG_ARRAY_SIZE + 3);
		if (!$this->_eqArray($aR, [97, 98, 99])) {
			var_dump($aR);
			$this->_errMsg('Error on line ' . $name );
			exit();
		} else {
			$this->_info();
		}
	}
	//Тут все варианты для положительного offset и отрицательной длины 
	public function testPositiveOffsetAndNegativeLength()
	{
		//отрицательная длина
		$aR = array_slice($this->_longArray, 0, -1 * (static::LONG_ARRAY_SIZE - 2 ) );
		if (!$this->_eqArray($aR, [0, 1])) {
			$this->_errMsg('Error on line отрицательная длина');
			var_dump($aR);
			exit();
		} else {
			$this->_info();
		}
		
		$eAr = [];
		
		$name = 'пересечение начала и конца';
		$aR = array_slice($this->_longArray, 10, -1 * (static::LONG_ARRAY_SIZE - 2 ) );
		if (!$this->_eqArray($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info();
		}
		
		$name = 'offset больше длины массива';
		$aR = array_slice($this->_longArray, static::LONG_ARRAY_SIZE, -1 * (static::LONG_ARRAY_SIZE - 2 ) );
		if (!$this->_eqArray($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'length не задан';
		$aR = array_slice($this->_longArray, floor(static::LONG_ARRAY_SIZE / 2));
		if (count($aR) != 50) {
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
		if (!$this->_eqArray($aR, $eAr)) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'для отрицательного offset и отрицательной длины 2';
		$aR = array_slice($this->_longArray, -99, -97);
		if (!$this->_eqArray($aR, [1, 2])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'для отрицательного offset и отрицательной длины 3';
		$aR = array_slice($this->_longArray, -60, -50);
		if (!$this->_eqArray($aR, [40, 41, 42, 43, 44, 45, 46, 47, 48, 49])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
	}
	//Тут все варианты для отрицательного offset и положительной длины 
	public function testNegativeOffsetAndPositiveLength()
	{
		$name = 'для отрицательного offset и положительной длины 1';
		$aR = array_slice($this->_longArray, -10, 3);
		if (!$this->_eqArray($aR, [90, 91, 92])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info(' . ' . $name);
		}
		
		$name = 'для отрицательного offset и положительной длины большей чем размер массива';
		$aR = array_slice($this->_longArray, -2, static::LONG_ARRAY_SIZE);
		if (!$this->_eqArray($aR, [98, 99])) {
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
	private function _eqArray($arr1, $arr2)
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
	 * Это позже, пока сосредоточусь на массивах (js Array)
	 * @return bool
	*/
	private function _eqAssocArray($arr1, $arr2)
	{
		//TODO
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
