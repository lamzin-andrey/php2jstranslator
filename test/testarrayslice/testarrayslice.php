<?php
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
		if (!$this->_eqArray($aR, [])) {
			var_dump($aR);
			$this->_errMsg('Error on часть массива нулевой длины');
			exit();
		} else {
			$this->_info();
		}
		
		//часть массива с длиной больше чем массив
		$aR = array_slice($this->_longArray, static::LONG_ARRAY_SIZE - 3, static::LONG_ARRAY_SIZE + 3);
		if (!$this->_eqArray($aR, [97, 98, 99])) {
			var_dump($aR);
			$this->_errMsg('Error on line ' . __LINE__);
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
		
		
		$name = 'пересечение начала и конца';
		$aR = array_slice($this->_longArray, 10, -1 * (static::LONG_ARRAY_SIZE - 2 ) );
		if (!$this->_eqArray($aR, [])) {
			$this->_errMsg('Error on line ' . $name);
			var_dump($aR);
			exit();
		} else {
			$this->_info();
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
		echo ("{$s}\n\n");
		echo ("\033[41m{$s}.\033[m\n");
	}
	
	private function _info($s = '.')
	{
		echo ("{$s}\n");
	}
}
