function main()
{
	var $o;
	window.tas = $o = new TestArraySlice();
	$o.testPositiveOffsetAndPositiveLength();
	$o.testPositiveOffsetAndNegativeLength();
	$o.testNegativeOffsetAndNegativeLength();
	$o.testNegativeOffsetAndPositiveLength();
}
main();
