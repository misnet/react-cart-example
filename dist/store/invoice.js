define('app/store/invoice',['require','module','reflux','app/action/invoice','app/utils/qing','langs/'+QING_LOCALE],function(require,m,Reflux){
	var InvoiceActions = require('app/action/invoice');
	var langs          = require('langs/'+QING_LOCALE);
	var Qing  		   = require('app/utils/qing');
	
	m.exports = Reflux.createStore({
		listenables:[InvoiceActions],
		getInitData:function(){

		},
		onNewInvoice:function(){

		}
	});
});