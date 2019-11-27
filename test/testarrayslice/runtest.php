<?php
require_once __DIR__ . '/testarrayslice.php';


function main()
{
	$o = new TestArraySlice();
	$o->testPositiveOffsetAndPositiveLength();
	$o->testPositiveOffsetAndNegativeLength();
}

main();


