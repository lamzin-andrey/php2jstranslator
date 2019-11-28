<?php

class console {
	static public function log($s)
	{
		echo ("{$s}\n");
	}
	static public function error($s)
	{
		echo ("{$s}\n\n");
		echo ("\033[41m{$s}.\033[m\n");
	}
}
