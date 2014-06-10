
module('Venda.js');  
test("Check for Venda", function() {
	if (typeof Venda !== "undefined" || Venda){
		ok(true);
	}
});

test("Create Venda.namespace", function() {
	ok(createNamespace('Test') === 'object', 'It is an object');
});

module('Platform.js');
test("Venda.Platform.getUrlParam", function() {

	var url = 'http://www.venda.com&test=value&test1=value1&test2=value2&test3=value3';

	ok(Venda.Platform.getUrlParam(url,'test'));
	ok(Venda.Platform.getUrlParam(url,'test1'));
	ok(Venda.Platform.getUrlParam(url,'test2'));
	ok(Venda.Platform.getUrlParam(url,'test3'));
});




test("Venda.Platform.escapeHTML", function() {

	var scriptXSS = Venda.Platform.escapeHTML('<script>alert("Hi there");</script>');
	var span = Venda.Platform.escapeHTML('<span>Hi there</span>');

	ok(!scriptXSS.match('<script>'),'<script>');
	ok(!span.match('<span>'),'<span>');

});


module('cookiejar.js');
test("cookiejar tests", function() {

	var Cookie = new CookieJar({expires: 3600 * 24 * 7, path: '/'});
	
	Cookie.put('testCookie','test');
	Cookie.get('testCookie');

	ok(Cookie.get('testCookie') == 'test', 'Cookie .put and .get');

	Cookie.remove('testCookie');

	QUnit.equal( Cookie.get('testCookie'), null, 'Cookie removed .remove'); 

});

module('SafeConsole.js');
test("SafeConsole tests", function() {

	ok(window.console, 'window.console is true');
	ok(console.log, 'console.log is true');

});

module('Touch.js');
test("Touch.js tests", function() {

	var touch = "ontouchstart" in document.documentElement

	ok( is_touch_device() === touch, "Touch Passed!" );

});

module('Search.js');
test("Search.js tests", function() {

	var decodeURL = Venda.Search._decodeURI('http://www.venda.com%20This%20URL%20Has%20No%20percentage%2020s')
	ok( decodeURL === "http://www.venda.com This URL Has No percentage 20s", "Decoded URL" );

});






/*Below are functions used by the above tests*/
function createNamespace(name) { 
	Venda.namespace(name);
    return  typeof Venda[name];
}  