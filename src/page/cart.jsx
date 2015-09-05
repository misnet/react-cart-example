define('app/page/cart',['require','exports','module','layer','app/component/carttable'],function (require, exports, module,layer) {
	layer.config({
	    path: QING_BASEURL+'js/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});
	var langs     = require('langs/'+QING_LOCALE);
	var cartTable = require('app/component/carttable');
	cartTable.render('cart-table');
});