define('app/action/member',['require','module','reflux'],function(require, module,Reflux){
	module.exports = Reflux.createActions([
		'saveAddress',
		'loadAddressList',
		'loadAddress',
		'newAddress',
		'selectAddress',
		'toggleShowMoreAddress'
	]);
});