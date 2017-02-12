window.e = function(i) {return document.getElementById(i);}
window.onload = init;
function init() {
	var KEY = 'd8sfldspgj';
	var LS = window.localStorage;
	e('in').value = LS.getItem(KEY) ? LS.getItem(KEY) : '';
	//e('ok').onclick = main;
	e('in').onkeydown = function() {
		setTimeout(function(){
			LS.setItem(KEY, e('in').value);
			main();
		}, 100);
	};
	e('out').onclick = function() {
		e('out').select();
	};
}
/** Драйвер класса */
function main() {
	var s = e('in').value, i, r = [];
	e('out').value = Phpjs.translate(s);
}
