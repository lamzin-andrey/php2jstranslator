function main()
{
	var $o;
	$o = new TestArraySlice();
	$o.testPositiveOffsetAndPositiveLength();
	$o.testPositiveOffsetAndNegativeLength();
	$o.testNegativeOffsetAndNegativeLength();
	$o.testNegativeOffsetAndPositiveLength();
}
main();
