window.pseudorequest = {};
function p_post(data, onSuccess, url, onFail) {
	if (!url) {
		url = window.location.href;
	} else {
		url = W.root + url;
	}
	window.pseudorequest.onSuccess = onSuccess;
	window.pseudorequest.onFail    = onFail;
	$_SERVER['REQUEST_URI'] = url;
	$_POST = data;
	$_POST['_token'] = getToken();
	window.pseudorequest.active = 1;
	pseudoRequestRun();
}
function pseudoRequestClose() {
	window.pseudorequest.active = 0;
	_post($_POST, window.pseudorequest.onSuccess, $_SERVER['REQUEST_URI'].replace(W.root, ''), window.pseudorequest.onFail);
}
